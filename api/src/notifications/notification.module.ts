import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import { NotificationController } from './notification.controller';
import { NotificationSchema } from './schema/schema.notification';
import { NotificationService } from './notification.service';
import { APNsModule } from 'src/apns/apns.module';
import { UserSchema } from 'src/user/schema/schema.user';

@Module({
  imports: [
    APNsModule,
    MongooseModule.forFeature([
      {name: 'Notification', schema: NotificationSchema},
      {name: 'User', schema: UserSchema},
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
