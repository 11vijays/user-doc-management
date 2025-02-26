import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck() {
    return { message: 'server is healthy', success: true };
  }
}
