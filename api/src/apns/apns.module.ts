import {Module} from "@nestjs/common";
import {ApnsService} from "./apns.service";
import { ApnsController } from "./apns.controller";

@Module({
    controllers: [ApnsController],
    providers: [ApnsService],
    exports: [ApnsService]
})

export class APNsModule {}
