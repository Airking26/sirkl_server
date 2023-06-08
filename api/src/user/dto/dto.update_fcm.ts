import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { FCMTokenPlatform } from "src/apns/interface/interface.fcm-tokens";

export class UpdateFcmDTO{

    @ApiProperty({type: String})
    @IsString()
    @IsNotEmpty()
    token: string

    @ApiProperty({enum: FCMTokenPlatform, enumName: 'FCMTokenPlatform'})
    @IsEnum(FCMTokenPlatform)
    @IsNotEmpty()
    platform: FCMTokenPlatform
}