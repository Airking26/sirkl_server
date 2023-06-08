import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/user/schema/schema.user";
import { NFTController } from "./nft.controller";
import { NFTService } from "./nft.service";
import { NFTSchema } from "./schema/schema.nft";

@Module({
    imports: [MongooseModule.forFeature([
        {name: "NFT", schema: NFTSchema}, {name: 'User', schema: UserSchema},
    ])],
    providers: [NFTService],
    controllers: [NFTController],
    exports: [NFTService]
})

export class NFTModule{}