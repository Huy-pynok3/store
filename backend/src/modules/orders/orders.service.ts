import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { QueueService } from '@/queues/queue.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private usersService: UsersService,
    private queueService: QueueService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { items } = createOrderDto;

    // Validate all products and check stock
    for (const item of items) {
      const hasStock = await this.productsService.checkStock(item.productId, item.quantity);
      if (!hasStock) {
        throw new BadRequestException(`Product ${item.productId} is out of stock`);
      }

      // Check if user already purchased this product
      const existingPurchase = await this.prisma.purchase.findUnique({
        where: {
          userId_productId: {
            userId,
            productId: item.productId,
          },
        },
      });

      if (existingPurchase && existingPurchase.status === OrderStatus.COMPLETED) {
        throw new BadRequestException('You have already purchased this product');
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems: Array<{ productId: string; quantity: number; price: number }> = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, price: true, name: true },
      });

      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order with transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber,
          totalAmount,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      // Deduct user balance
      await this.usersService.updateBalance(userId, -totalAmount, 'PURCHASE');

      // Update product stock
      for (const item of items) {
        await this.productsService.decrementStock(item.productId, item.quantity);
      }

      // Create purchase records
      for (const item of items) {
        await tx.purchase.upsert({
          where: {
            userId_productId: {
              userId,
              productId: item.productId,
            },
          },
          create: {
            userId,
            productId: item.productId,
            orderId: newOrder.id,
            status: OrderStatus.PENDING,
          },
          update: {
            orderId: newOrder.id,
            status: OrderStatus.PENDING,
          },
        });
      }

      return newOrder;
    });

    // Add background jobs
    await this.queueService.addOrderProcessingJob(order.id, 10); // High priority
    await this.queueService.sendOrderConfirmationEmail(order.id, order.user.email);

    return order;
  }

  async findUserOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  type: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    return order;
  }

  async completeOrder(orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.COMPLETED,
          paymentStatus: PaymentStatus.COMPLETED,
        },
        include: {
          items: true,
        },
      });

      // Update purchase status
      for (const item of order.items) {
        await tx.purchase.updateMany({
          where: {
            userId: order.userId,
            productId: item.productId,
            orderId,
          },
          data: {
            status: OrderStatus.COMPLETED,
          },
        });
      }

      return order;
    });
  }
}
