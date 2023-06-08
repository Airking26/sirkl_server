import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {AuthService} from "../auth.service";
import { JwtPayload } from "./interface/auth.passport.interface.jwt_payload";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromHeader("refresh")]),
            secretOrKey: process.env.JWT_REFRESH_KEY,
            passReqToCallback: true
        });
    }

    async validate(request: Request, payload: JwtPayload) {
        const token = request.headers["refresh"]
        const user = await this.authService.validateUser(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        
        return user;
    }
}
