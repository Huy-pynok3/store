import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { QueueModule } from '@/queues/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [AdminController],
})
export class AdminModule {}
