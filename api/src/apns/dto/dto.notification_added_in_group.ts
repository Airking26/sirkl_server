import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

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

}