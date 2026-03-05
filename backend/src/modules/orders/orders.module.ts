import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { QueueModule } from '@/queues/queue.module';

@Module({
  imports: [ProductsModule, UsersModule, QueueModule],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
