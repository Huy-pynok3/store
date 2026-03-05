import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { QueueService } from '@/queues/queue.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private queueService: QueueService) {}

  @Get('queues/stats')
  async getQueueStats() {
    const [orderStats, emailStats] = await Promise.all([
      this.queueService.getOrderQueueStats(),
      this.queueService.getEmailQueueStats(),
    ]);

    return {
      orders: orderStats,
      emails: emailStats,
    };
  }
}
