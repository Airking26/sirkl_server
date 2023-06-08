import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { ProfileSignalmentSchema } from "./schema/schema.profile_signalment";
import { SignalmentController } from "./signalment.controller";
import { SignalmentService } from "./signalment.service";

@Module({
    imports: [
        UserModule,
        MongooseModule.forFeature([{name: 'ProfileSignalment', schema: ProfileSignalmentSchema}])
    ],
    controllers: [SignalmentController],
    providers: [SignalmentService]
})

export class SignalmentModule{}