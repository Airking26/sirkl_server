import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class AdminUserGetStream{
    
    @ApiProperty({type: String})
    @IsString({each: true})
    @IsNotEmpty()
    idChannel : string
    
    @ApiProperty({type: String})
    @IsString({each: true})
    @IsNotEmpty()
    userToUpdate : string

    @ApiProperty({type: Boolean})
    @IsBoolean()
    makeAdmin: boolean
}