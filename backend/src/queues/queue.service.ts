import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('orders') private orderQueue: Queue,
    @InjectQueue('emails') private emailQueue: Queue,
    @InjectQueue('notifications') private notificationQueue: Queue,
  ) {}

  // Order processing jobs
  async addOrderProcessingJob(orderId: string, priority: number = 5) {
    return this.orderQueue.add(
      'process-order',
      { orderId },
      {
        priority,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );
  }

  async addOrderDeliveryJob(orderId: string) {
    return this.orderQueue.add(
      'deliver-order',
      { orderId },
      {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    );
  }

  async addStockCheckJob(productId: string) {
    return this.orderQueue.add(
      'check-stock',
      { productId },
      {
        attempts: 2,
        removeOnComplete: true,
      },
    );
  }

  // Email jobs
  async sendWelcomeEmail(userId: string, email: string) {
    return this.emailQueue.add(
      'welcome-email',
      { userId, email },
      {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 10000,
        },
      },
    );
  }

  async sendOrderConfirmationEmail(orderId: string, email: string) {
    return this.emailQueue.add(
      'order-confirmation',
      { orderId, email },
      {
        attempts: 3,
        priority: 8,
      },
    );
  }

  async sendOrderDeliveryEmail(orderId: string, email: string, deliveryData: any) {
    return this.emailQueue.add(
      'order-delivery',
      { orderId, email, deliveryData },
      {
        attempts: 5,
        priority: 10,
      },
    );
  }

  // Notification jobs
  async sendPushNotification(userId: string, title: string, message: string) {
    return this.notificationQueue.add(
      'push-notification',
      { userId, title, message },
      {
        attempts: 2,
        removeOnComplete: true,
      },
    );
  }

  // Bulk operations
  async addBulkStockCheck(productIds: string[]) {
    const jobs = productIds.map((productId) => ({
      name: 'check-stock',
      data: { productId },
      opts: {
        attempts: 2,
        removeOnComplete: true,
      },
    }));

    return this.orderQueue.addBulk(jobs);
  }

  // Queue management
  async getOrderQueueStats() {
    return {
      waiting: await this.orderQueue.getWaitingCount(),
      active: await this.orderQueue.getActiveCount(),
      completed: await this.orderQueue.getCompletedCount(),
      failed: await this.orderQueue.getFailedCount(),
    };
  }

  async getEmailQueueStats() {
    return {
      waiting: await this.emailQueue.getWaitingCount(),
      active: await this.emailQueue.getActiveCount(),
      completed: await this.emailQueue.getCompletedCount(),
      failed: await this.emailQueue.getFailedCount(),
    };
  }

  async pauseQueue(queueName: 'orders' | 'emails' | 'notifications') {
    const queue = this[`${queueName}Queue`];
    await queue.pause();
  }

  async resumeQueue(queueName: 'orders' | 'emails' | 'notifications') {
    const queue = this[`${queueName}Queue`];
    await queue.resume();
  }

  async cleanQueue(queueName: 'orders' | 'emails' | 'notifications', grace: number = 0) {
    const queue = this[`${queueName}Queue`];
    await queue.clean(grace, 1000, 'completed');
    await queue.clean(grace, 1000, 'failed');
  }
}
