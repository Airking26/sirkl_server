import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NicknamesController } from "./nicknames.controller";
import { NicknamesService } from "./nicknames.service";
import { NicknamesSchema } from "./schema/schema.nicknames";

@Module({
    imports: [MongooseModule.forFeature([{name: "Nicknames", schema: NicknamesSchema}])],
    providers: [NicknamesService],
    controllers: [NicknamesController],
    exports: [NicknamesService]
})

export class NicknamesModule{}