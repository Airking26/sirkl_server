import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {IsNotEmpty, IsNumber, IsOptional, IsString,} from "class-validator"

export class WalletConnectDTO {
    @ApiProperty({ type: String})
    @IsNotEmpty()
    @IsString()
    readonly wallet: string

    @ApiProperty({ type: String})
    @IsNotEmpty()
    @IsString()
    readonly message: string

    @ApiProperty({ type: String})
    @IsNotEmpty()
    @IsString()
    readonly signature: string

    @ApiPropertyOptional({type: String})
    @IsOptional()
    @IsString()
    readonly platform: string
}
