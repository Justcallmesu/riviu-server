import { ServerResponse } from '@/modules/common/model/response-model';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): ServerResponse {
    return {
      message: 'Server is Running 🚀',
      status: 200,
    };
  }
}
