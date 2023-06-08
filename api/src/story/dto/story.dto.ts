import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class StoryCreationDTO{
    @ApiProperty({type: String})
    @IsNotEmpty()
    readonly url: string

    @ApiProperty({type: Number})
    @IsNotEmpty()
    readonly type: number
}
 
export class StoryModificationDTO{   

    @ApiProperty({type: String})
    @IsNotEmpty()
    readonly id: string

    @ApiPropertyOptional({type: String, isArray: true})
    @IsArray()
    @IsOptional()
    @IsString({each: true})
    readonly readers: string[]
}