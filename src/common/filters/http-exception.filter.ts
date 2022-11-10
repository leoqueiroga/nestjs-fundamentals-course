import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()
    const error =
      typeof response === 'string'
        ? { message: exception.message }
        : (exceptionResponse as object)
    response.status(status).json({
      timestamp: new Date().toISOString(),
      ...error,
    })
  }
}
