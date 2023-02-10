import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class UnhandledExceptionFilter<T extends Error>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception['status'];
    const exceptionResponse = exception['response'];

    if (status && exceptionResponse) {
      return response.status(status).json(exceptionResponse);
    }
    console.log(exception);

    response.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: exception['message'],
    });
  }
}
