import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getApiRoot() {
    return {
      status: 'ok',
      message: 'Backend API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
