import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { InboxController } from "./inbox.controller";
import { InboxService } from "./inbox.service";
import { InboxSchema } from "./schema/schema.inbox";

@Module({
    imports: [
        UserModule,
        MongooseModule.forFeature([{name: "Inbox", schema: InboxSchema}])
    ],
    controllers: [InboxController],
    providers: [InboxService]
})

export class InboxModule{}