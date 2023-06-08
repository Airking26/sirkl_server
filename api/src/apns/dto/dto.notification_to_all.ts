import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class NotificationToAllDTO{


    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly message: string;
}