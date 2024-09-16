import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from '../auth/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SignalmentModule } from 'src/signalment/signalment.module';
import { NFTModule } from 'src/nfts/nft.module';
import { SearchModule } from 'src/search/search.module';
import { FollowController } from 'src/follow/follow.controller';
import { FollowModule } from 'src/follow/follow.module';
import { NotificationModule } from 'src/notifications/notification.module';
import { CallModule } from 'src/call/call.module';
import { InboxModule } from 'src/inbox/inbox.module';
import { GroupModule } from 'src/group/group.module';
import { StoryModule } from 'src/story/story.module';
import { NicknamesModule } from 'src/nicknames/nicknames.module';
import { APNsModule } from 'src/apns/apns.module';
import { JoinModule } from 'src/requests/request.module';
import { ApiKeyMiddleware } from 'src/middleware/api.key.middleware';
import serveStatic from 'serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './uploads'
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URI, {useNewUrlParser: true, useCreateIndex: true}),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    SignalmentModule,
    NFTModule,
    SearchModule,
    FollowModule,
    NotificationModule,
    CallModule,
    InboxModule,
    GroupModule,
    StoryModule,
    NicknamesModule,
    APNsModule,
    JoinModule
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {
  k = `Serving files from ${join(__dirname, '..', '..', 'public')}`;
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(serveStatic(join(__dirname, '..', '..', 'public'), { index: false }))
      .forRoutes('/');
  }
}
