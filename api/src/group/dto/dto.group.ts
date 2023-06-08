import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { UserInfoDTO } from "src/user/response/response.user";

export class GroupCreationDTO{

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly contractAddress: string;

    @ApiPropertyOptional({type: String})
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @ApiPropertyOptional({type: String})
    @IsNotEmpty()
    @IsString()
    readonly picture: string
}