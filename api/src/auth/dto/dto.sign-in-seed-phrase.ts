import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsNumber, IsString,} from "class-validator"

export class SignInSeedPhraseDTO {
    @ApiProperty({ type: String})
    @IsNotEmpty()
    @IsString()
    readonly wallet: string

    @ApiProperty({ type: String})
    @IsNotEmpty()
    @IsString()
    readonly seedPhrase: string
}
