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

@Post('create-payment')
@UseGuards(AuthGuard, RolesGuard)
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
    this.paymentsGateway.notifyPaymentCreated(userId, paymentData.paymentId);
    // .then(r => {
    //     if(!r) throw new BadRequestException('Bad request for record-payment');
    //     return r
    // });  
  }

@Get('payments/:id/status')
async getPaymentStatus(@Param('id') id: string) {
    return await this.paymentService.getPaymentStatus(id)
}

@Get('payments')
async getPayment() {
    return this.paymentService.findAll();
}

}