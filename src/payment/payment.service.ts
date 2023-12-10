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
    private readonly keyService: KeysService,
    private readonly paymentsGateway: PaymentsGateway
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
    
    const updatedStatus = await this.prisma.payment.update({
        where: { paymentId: paymentId },
        data: {
            status: status,
        },
    });

    if (status === 'succeeded') {
          const response = await axios.post(process.env.GET_KEYS_OUTLINE_URL);
          console.log('Ключ создан успешно: ', response.data.id)
         
          const dto: CreateProductDto = {
            userId: updatedStatus.userId,
            name: 'VPN 1 month',
            region: 'Nitherlands'
          }
          await this.productService.createProductForUser(dto);

          return { status: 'success' };
        }
        else {
          return status
        }
    }

  async assignKeyToUser(userId: string, keyId: string) {
    const key = await this.keyService.findOne(keyId);

    if (!key) {
      throw new Error(`Key with ID ${keyId} not found`);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        key: key.accessUrl, 
      },
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
