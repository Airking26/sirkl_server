import { AppService } from './app.service';
import { Response, Request } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getPrivacyPolicy(res: Response, req: Request): void;
    getTermsUseEnglish(res: Response, req: Request): void;
}
