import { Controller, Post, Body, Put, Param, BadRequestException, Get, HttpException, HttpStatus, UseGuards, ForbiddenException } from '@nestjs/common';
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
  
@Post('yookassa-webhook')
async handleWebhook(@Body() webhookData: any) {
  const paymentId = webhookData.object.id; 
  const status = webhookData.object.status; 
  return await this.paymentService.createProductAndKey(paymentId, status)
  .then(r => {
    if(!r) throw new BadRequestException('Bad request for createProduct');
    return r
  })
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

@Post('payments/:id')
@UseGuards(RolesGuard)
async getPaymentStatus(@Param('id') id: string) {
  const status = 'succeeded'  // mock for test
    return await this.paymentService.createProductAndKey(id, status)
}

@Get('payments')
@UseGuards(RolesGuard)
async getPayment() {
    return await this.paymentService.findAll(); 
}

}