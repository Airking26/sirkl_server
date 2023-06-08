import { Controller, Get, HttpCode, Req, Res  } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  @HttpCode(200)
  getHello(): string {
    return "Hello Darkness My Old Friend"
  }

  @Get("/privacy_policy")
  getPrivacyPolicy(@Res() res: Response,@Req() req: Request){
    return res.sendFile('src/html/pp.html', {root: '.'})
  }

  @Get("/terms_of_use")
  getTermsUseEnglish(@Res() res: Response,@Req() req: Request){
    return res.sendFile('src/html/tc.html', {root: '.'})
  }
}
