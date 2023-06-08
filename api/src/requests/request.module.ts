import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { APNsModule } from "src/apns/apns.module";
import { NotificationSchema } from "src/notifications/schema/schema.notification";
import { UserSchema } from "src/user/schema/schema.user";
import { JoinController } from "./request.controller";
import { JoinService } from "./request.service";
import { JoinSchema } from "./schema/schema.request";

@Module({
    imports: [
        APNsModule,
      MongooseModule.forFeature([
        {name: 'Join', schema: JoinSchema},
        {name: 'User', schema: UserSchema},
        {name: 'Notification', schema: NotificationSchema}])
    ],
    controllers: [JoinController],
    providers: [JoinService]
  })
  export class JoinModule {}
  