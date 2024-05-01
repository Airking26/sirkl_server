import { AuthService } from '../auth.service';
import { Strategy } from "passport-jwt";
import { JwtPayload } from './interface/auth.passport.interface.jwt_payload';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: JwtPayload): Promise<import("../../user/interface/interface.user").User>;
}
export {};
