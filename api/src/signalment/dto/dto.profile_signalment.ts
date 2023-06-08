import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, IsNumber} from "class-validator";

export class ProfileSignalmentDTO{

    @ApiProperty({type: String, description: 'User ID creating the signalment'})
    @IsNotEmpty()
    @IsString()
    readonly createdBy: string;

    @ApiProperty({type: String, description: 'ID to signal'})
    @IsNotEmpty()
    @IsString()
    readonly idSignaled: string;

    @ApiProperty({type: String, description: 'Signalment description'})
    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @ApiProperty({type: Number, description: 'Type (0 = conversation or profile, 1 = group, 2 = community)'})
    @IsNotEmpty()
    @IsNumber()
    readonly type: number;
}