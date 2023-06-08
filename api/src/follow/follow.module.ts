import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { APNsModule } from "src/apns/apns.module";
import { NotificationSchema } from "src/notifications/schema/schema.notification";
import { UserSchema } from "src/user/schema/schema.user";
import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";
import { FollowSchema } from "./schema/schema.follow";

@Module({
    imports: [
        APNsModule,
      MongooseModule.forFeature([
        {name: 'User', schema: UserSchema},
        {name: 'Follow', schema: FollowSchema}, 
        {name: 'Notification', schema: NotificationSchema}])
    ],
    controllers: [FollowController],
    providers: [FollowService]
  })
  export class FollowModule {}
  