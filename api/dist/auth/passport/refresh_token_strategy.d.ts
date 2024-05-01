import { Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { JwtPayload } from "./interface/auth.passport.interface.jwt_payload";
declare const JwtRefreshTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshTokenStrategy extends JwtRefreshTokenStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(request: Request, payload: JwtPayload): Promise<import("../../user/interface/interface.user").User>;
}
export {};
