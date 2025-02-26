// src/utils/custom-exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomBadException extends HttpException {
  constructor(message: string, code?: number, stack?: string[], details?: any) {
    super({ message, stack, details }, code || HttpStatus.BAD_REQUEST);
  }
}
