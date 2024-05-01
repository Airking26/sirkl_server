import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class JoinDTO{

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly receiver: string;

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly requester: string;

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly channelId: string


    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly channelName: string

    @ApiPropertyOptional({type: Boolean})
    @IsOptional()
    @IsBoolean()
    readonly accept: boolean

    @ApiPropertyOptional({type: Boolean})
    @IsOptional()
    @IsBoolean()
    readonly paying: boolean

}