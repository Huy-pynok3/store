import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '@/database/prisma.service';
import { OrderStatus } from '@prisma/client';

@Processor('orders')
export class OrderProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job): Promise<any> {
    this.logger.log(`Processing job ${job.name} with id ${job.id}`);

    switch (job.name) {
      case 'process-order':
        return this.processOrder(job.data);
      case 'deliver-order':
        return this.deliverOrder(job.data);
      case 'check-stock':
        return this.checkStock(job.data);
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async processOrder(data: { orderId: string }) {
    const { orderId } = data;

    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Simulate order processing logic
      this.logger.log(`Processing order ${order.orderNumber}`);

      // Update order status
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PROCESSING },
      });

      // If auto-deliver is enabled, trigger delivery
      const hasAutoDeliver = order.items.some((item) => item.product.autoDeliver);
      if (hasAutoDeliver) {
        // Add delivery job with delay
        this.logger.log(`Scheduling auto-delivery for order ${orderId}`);
      }

      return { success: true, orderId };
    } catch (error) {
      this.logger.error(`Failed to process order ${orderId}:`, error);
      throw error;
    }
  }

  private async deliverOrder(data: { orderId: string }) {
    const { orderId } = data;

    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      this.logger.log(`Delivering order ${order.orderNumber}`);

      // Get inventory items for each product
      for (const item of order.items) {
        const inventoryItems = await this.prisma.inventory.findMany({
          where: {
            productId: item.productId,
            isSold: false,
          },
          take: item.quantity,
        });

        if (inventoryItems.length < item.quantity) {
          throw new Error(`Insufficient inventory for product ${item.product.name}`);
        }

        // Mark inventory as sold and attach to order item
        const deliveredData = inventoryItems.map((inv) => inv.data).join('\n---\n');

        await this.prisma.$transaction([
          // Update order item with delivered data
          this.prisma.orderItem.update({
            where: { id: item.id },
            data: { deliveredData },
          }),
          // Mark inventory as sold
          this.prisma.inventory.updateMany({
            where: {
              id: { in: inventoryItems.map((inv) => inv.id) },
            },
            data: {
              isSold: true,
              soldAt: new Date(),
            },
          }),
        ]);
      }

      // Update order status to completed
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.COMPLETED },
      });

      // Update purchase records
      await this.prisma.purchase.updateMany({
        where: { orderId },
        data: { status: OrderStatus.COMPLETED },
      });

      this.logger.log(`Order ${order.orderNumber} delivered successfully`);

      return { success: true, orderId };
    } catch (error) {
      this.logger.error(`Failed to deliver order ${orderId}:`, error);
      throw error;
    }
  }

  private async checkStock(data: { productId: string }) {
    const { productId } = data;

    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error(`Product ${productId} not found`);
      }

      const inventoryCount = await this.prisma.inventory.count({
        where: {
          productId,
          isSold: false,
        },
      });

      // Update product stock if mismatch
      if (product.stock !== inventoryCount) {
        this.logger.warn(
          `Stock mismatch for product ${productId}: DB=${product.stock}, Inventory=${inventoryCount}`,
        );

        await this.prisma.product.update({
          where: { id: productId },
          data: { stock: inventoryCount },
        });
      }

      return { success: true, productId, stock: inventoryCount };
    } catch (error) {
      this.logger.error(`Failed to check stock for product ${productId}:`, error);
      throw error;
    }
  }
}
