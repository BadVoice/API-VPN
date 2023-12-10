import { Controller, Post, Body, Put, Param, BadRequestException, Get, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsGateway } from './payment.gateway';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller()
export class PaymentController {
  constructor(
    
    private readonly paymentService: PaymentService,
    private readonly paymentsGateway: PaymentsGateway
    
    ) {}
  
@Post('api/yookassa-webhook')
async handleWebhook(@Body() webhookData: any) {
  console.log('Received YooKassa webhook:', webhookData);

}

@Post('create-payment')
async createPayment(@Body() createPaymentDto: CreatePaymentDto ) {
    return await this.paymentService.create(createPaymentDto)
    .then(r => {
        if(!r) throw new BadRequestException('Bad request for create-payment');
        return r
    });
  }

@Post('record-payment')
async recordPayment(@Body() body: { userId: string, paymentData: { paymentId: string, status: string, amount: string }}) {
    const { userId, paymentData } = body;
    await this.paymentService.recordPayment(userId, paymentData)
     .then(r => {
        if(!r) throw new BadRequestException('Bad request for record-payment');
        return r
    });  
    this.paymentsGateway.notifyPaymentCreated(userId, paymentData.paymentId);
   
  }

@Get('payments/:id/status')
@UseGuards(RolesGuard)
async getPaymentStatus(@Param('id') id: string) {
    return await this.paymentService.getPaymentStatus(id)
}

@Get('payments')
@UseGuards(RolesGuard)
async getPayment() {
    return this.paymentService.findAll();
}

}