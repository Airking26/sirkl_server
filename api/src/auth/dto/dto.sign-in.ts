import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsNumber, IsString,} from "class-validator"

export class SignInDTO {
    @ApiProperty({ type: String})
    @IsNotEmpty()
    @IsString()
    readonly wallet: string

    @ApiProperty({ type: String})
    @IsNotEmpty()
    @IsString()
    readonly password: string
}
