import { Module } from "@nestjs/common";
import { CallController } from "./call.controller";
import { CallService } from "./call.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CallSchema } from "./schema/schema.call";
import { NotificationSchema } from "src/notifications/schema/schema.notification";
import { UserSchema } from "src/user/schema/schema.user";
import { APNsModule } from "src/apns/apns.module";
import { NicknamesSchema } from "src/nicknames/schema/schema.nicknames";

@Module({
    imports: [APNsModule, MongooseModule.forFeature([{name: "Call", schema: CallSchema},{name: 'User', schema: UserSchema}, {name: 'Notification', schema: NotificationSchema}, {name: "Nicknames", schema : NicknamesSchema}])],
    controllers: [CallController],
    providers: [CallService]
})

export class CallModule{}