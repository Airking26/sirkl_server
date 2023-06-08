import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { InboxModule } from 'src/inbox/inbox.module';
import { InboxService } from 'src/inbox/inbox.service';
import { InboxSchema } from 'src/inbox/schema/schema.inbox';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/local_strategy';
import { JwtRefreshTokenStrategy } from './passport/refresh_token_strategy';

@Module({
    imports:[
        UserModule,
        PassportModule.register({session: true}),
        JwtModule.register({secret: process.env.JWT_AUTH_KEY})
    ],
    providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
    controllers: [AuthController]
})
export class AuthModule {
}
