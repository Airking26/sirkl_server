import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === process.env.SIRKL_API_KEY) {
      next();
    } else {
      res.status(401).json({ message: 'API Key Invalid or missing' });
    }
  }
}
