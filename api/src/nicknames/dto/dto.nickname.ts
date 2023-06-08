import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class NicknameCreationDTO{
    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly nickname: string
}