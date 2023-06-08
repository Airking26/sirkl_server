import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsNumber, IsString,} from "class-validator"

export class SignUpDTO {
    @ApiProperty({ type: String})
    @IsNotEmpty()
    @IsString()
    readonly wallet: string

    @ApiProperty({ type: String})
    @IsNotEmpty()
    @IsString()
    readonly password: string

    @ApiProperty({ type: String})
    @IsNotEmpty()
    @IsString()
    readonly recoverySentence: string
}
