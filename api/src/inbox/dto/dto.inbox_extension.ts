import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class InboxExtensionDTO{

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly sender: string;

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly receiver: string;

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly message: string
    
}