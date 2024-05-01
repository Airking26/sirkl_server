import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class NotificationAddedOrAdmin{

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly idChannel: string;


    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly idUser: string;

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly channelName: string;

    @ApiPropertyOptional({type: String})
    @IsOptional()
    @IsString()
    readonly channelPrice: string

    @ApiPropertyOptional({type: Boolean})
    @IsOptional()
    @IsBoolean()
    readonly channelPrivate: boolean

    @ApiPropertyOptional({type: String})
    @IsOptional()
    @IsString()
    readonly inviteId: string
}