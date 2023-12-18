import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4 } from 'uuid';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { KeysService } from 'src/keys/keys.service';
import { ProductService } from 'src/product/product.service';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { PaymentsGateway } from './payment.gateway';
const axios = require('axios').create({
    httpsAgent: new (require('https')).Agent({  
      rejectUnauthorized: false,
    }),
  }); // for developer version, dont forgot remove this after deploy

@Injectable()
export class PaymentService {
  constructor(
    private prisma: DatabaseService,
    private readonly configService: ConfigService,
    private readonly productService: ProductService,
    ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const headers = {
      'Idempotence-Key': uuidv4(),
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(`${process.env.SHOP_ID}:${process.env.SHOP_KEY}`).toString('base64')
    };

    try {
        const response = await axios.post(
          'https://api.yookassa.ru/v3/payments',
          createPaymentDto,
          { headers }
        );

        return response.data
      } catch (error) {
        console.error("Error in prisma.payment.create: ", error);
        throw error;
      }
      
  }

  async createProductAndKey(paymentId: string, status: string) {
    console.log('Статус платежа: ', status);
  
    const response = await this.createAccessKey();
    console.log('Ключ создан успешно: ', response.data.id)
    
    const updatedStatus = await this.updatePaymentStatus(paymentId, status);
    
    if (status === 'succeeded') {
      const accessKey = await this.getUnusedAccessKey();
    
      if (!accessKey) {
        throw new Error('No Access Keys available');
      }
  
      console.log('Выданный ID ключа: ', accessKey.id);
  
      await this.markAccessKeyAsUsed(accessKey.id);
  
      const dto = {
        userId: updatedStatus.userId,
        name: 'VPN 1 Month', // replace на tariff plan details
        region: 'Нидерланды', // replace на tariff plan details
        accessUrl: accessKey.id // используется actual ID ключа для теста, далее тут будет accessUrl
      };
  
      await this.productService.createProductForUser(dto);
  
      return status;
    }
  
    return status
  }

  async createAccessKey() {
    return await axios.post(process.env.GET_KEYS_OUTLINE_URL);
  }
  
  async updatePaymentStatus(paymentId: string, status: string) {
    return await this.prisma.payment.update({
      where: { paymentId: paymentId },
      data: { status: status },
    });
  }

  async getUnusedAccessKey() {
    return await this.prisma.accessKey.findFirst({
      where: { usedAt: null },
      orderBy: { createdAt: 'asc' }
    });
  }
  
  async markAccessKeyAsUsed(accessKeyId: string) {
    return await this.prisma.accessKey.update({
      where: { id: accessKeyId },
      data: { usedAt: new Date() }
    });
  }

  findAll() {
    return this.prisma.payment.findMany()
  }

  async recordPayment(userId: string, paymentData: { paymentId: string, status: string, amount: string }) {
    const recordPay =  await this.prisma.payment.create({
        data: {
            paymentId: paymentData.paymentId,
            userId: userId, 
            status: paymentData.status,
            amount: paymentData.amount,
        }
    })
    return recordPay
  }

}
