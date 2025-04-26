import { Injectable, NestMiddleware } from '@nestjs/common'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const { method, originalUrl, body } = req
    const timestamp = new Date().toISOString()
    console.log(
      `[${timestamp}] ${method} ${originalUrl} - Body: ${JSON.stringify(body)}`,
    )
    next()
  }
}
