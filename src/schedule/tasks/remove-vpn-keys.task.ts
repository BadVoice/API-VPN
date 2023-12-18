import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from 'src/database/database.service';
import { MailService } from 'src/mail/mail.service';
import { WebhookService } from 'src/webhook.service';

@Injectable()
export class RemoveVpnKeysTask {
  private readonly logger = new Logger(RemoveVpnKeysTask.name);

  constructor(
    private prisma: DatabaseService,
    private webhokService: WebhookService,
    private mailService: MailService
    ) {}  

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Started cleanup');
    await this.removeOldProductsAndAccessKeys();
  }

  private async removeOldProductsAndAccessKeys() {
    const currentDate = new Date();
    const expireDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

    try {
      const expiredKeys = await this.prisma.accessKey.findMany({
        where: {
          usedAt: {
            lt: expireDate,
          },
        },
      });

      for (const expiredKey of expiredKeys) {

        const products = await this.prisma.product.findMany({
            where: {
              accessUrl: expiredKey.id
            },
            select: {
              accessUrl: true,
              user: {
                select: {
                  email: true
                }
              }
            }
        })

        for (const product of products) {
            await this.mailService.sendDeleteProductInfo(product.user.email, product.accessUrl);
        }

        await this.prisma.product.deleteMany({
          where: {
            accessUrl: expiredKey.id
          },
        });

        await this.prisma.accessKey.delete({
          where: {
            id: expiredKey.id
          }
        });

        await this.webhokService.notifyKeyDeletion(expiredKey.id);

        this.logger.log('Expired access key and their products have been deleted', `${expiredKey.id}`);
      }

      this.logger.log('Cleanup keys have been');

    } catch (error) {
      this.logger.error('Failed to delete expired access keys and their products', error);
    }
  }
}
