import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {AuthService} from '../auth.service';
import {ExtractJwt, Strategy} from "passport-jwt";
import { JwtPayload } from './interface/auth.passport.interface.jwt_payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_AUTH_KEY
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
