import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '@/database/prisma.service';

@Processor('emails')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job): Promise<any> {
    this.logger.log(`Processing email job ${job.name} with id ${job.id}`);

    switch (job.name) {
      case 'welcome-email':
        return this.sendWelcomeEmail(job.data);
      case 'order-confirmation':
        return this.sendOrderConfirmation(job.data);
      case 'order-delivery':
        return this.sendOrderDelivery(job.data);
      default:
        this.logger.warn(`Unknown email job type: ${job.name}`);
    }
  }

  private async sendWelcomeEmail(data: { userId: string; email: string }) {
    const { userId, email } = data;

    try {
      this.logger.log(`Sending welcome email to ${email}`);

      // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
      // For now, just log
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      this.logger.log(`Welcome email sent to ${email} (${user?.username})`);

      return { success: true, email };
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      throw error;
    }
  }

  private async sendOrderConfirmation(data: { orderId: string; email: string }) {
    const { orderId, email } = data;

    try {
      this.logger.log(`Sending order confirmation to ${email}`);

      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      // TODO: Send actual email with order details
      this.logger.log(
        `Order confirmation sent to ${email} for order ${order.orderNumber}`,
      );

      return { success: true, email, orderId };
    } catch (error) {
      this.logger.error(`Failed to send order confirmation to ${email}:`, error);
      throw error;
    }
  }

  private async sendOrderDelivery(data: {
    orderId: string;
    email: string;
    deliveryData: any;
  }) {
    const { orderId, email, deliveryData } = data;

    try {
      this.logger.log(`Sending order delivery email to ${email}`);

      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      // TODO: Send actual email with delivery data
      this.logger.log(
        `Order delivery email sent to ${email} for order ${order.orderNumber}`,
      );

      return { success: true, email, orderId };
    } catch (error) {
      this.logger.error(`Failed to send order delivery email to ${email}:`, error);
      throw error;
    }
  }
}
