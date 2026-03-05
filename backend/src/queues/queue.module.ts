import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { OrderProcessor } from './processors/order.processor';
import { EmailProcessor } from './processors/email.processor';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST') || 'localhost',
          port: config.get('REDIS_PORT') || 6379,
          password: config.get('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue(
      { name: 'orders' },
      { name: 'emails' },
      { name: 'notifications' },
    ),
  ],
  providers: [OrderProcessor, EmailProcessor, QueueService],
  exports: [QueueService],
})
export class QueueModule {}
