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
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get('REDIS_URL') || 'redis://localhost:6379';
        const url = new URL(redisUrl);
        return {
          connection: {
            host: url.hostname,
            port: parseInt(url.port) || 6379,
            password: url.password || undefined,
          },
        };
      },
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
