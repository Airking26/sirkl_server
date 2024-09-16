import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class WalletSearchDTO {

    @ApiProperty({type: String, isArray: true})
    @IsArray()
    @IsNotEmpty()
    @IsString({each: true})
    wallets: string[]
    
}