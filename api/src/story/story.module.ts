import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/user/schema/schema.user";
import { StorySchema } from "./schema/story.schema";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";

@Module({
    imports: [MongooseModule.forFeature([{name: "Story", schema: StorySchema}]), MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
    providers: [StoryService],
    controllers: [StoryController],
    exports: [StoryService]
})

export class StoryModule{}