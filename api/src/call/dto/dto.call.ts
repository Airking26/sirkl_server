import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CallCreationDTO{
    @ApiProperty({type: Date})
    @IsNotEmpty()
    readonly updatedAt: Date;

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly called: string;

    @ApiProperty({type: Number})
    @IsNotEmpty()
    @IsNumber()
    readonly status: number;

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly channel: string
}

export class CallModificationDTO{

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly id: string

    @ApiProperty({type: Number})
    @IsNotEmpty()
    @IsNumber()
    readonly status: number;

    @ApiProperty({type: Date})
    @IsNotEmpty()
    readonly updatedAt: Date;
}