import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GroupController } from "./group.controller";
import { GroupService } from "./group.service";
import { GroupSchema } from "./schema/schema.group";

@Module({
    imports: [MongooseModule.forFeature([{name: "Group", schema: GroupSchema}])],
    controllers: [GroupController],
    providers: [GroupService]
})

export class GroupModule{}