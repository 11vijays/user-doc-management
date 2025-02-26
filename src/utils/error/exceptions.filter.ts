// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            message: (exception as any)?.message || 'Internal server error',
            stack: (exception as any)?.stack
              ? this.simplifyStackTrace((exception as any).stack)
              : undefined,
          };

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      //refine it later
      error: message,
    });
  }

  // Simplify the stack trace to include only file paths
  simplifyStackTrace = (stack: string): string[] => {
    return stack
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('at '))
      .map((line) => {
        const match = line.match(/\((.*)\)/);
        if (match) {
          return match[1]; // Extract the file path within the parentheses
        }
        return line.replace(/^at\s+/, ''); // If there's no match, return the line as is
      });
  };
}
