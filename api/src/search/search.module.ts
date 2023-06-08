import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/user/schema/schema.user";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    ],
    controllers: [SearchController],
    providers: [SearchService]
})

export class SearchModule{}