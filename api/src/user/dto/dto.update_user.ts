import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, isArray, IsBoolean, IsDate, isDate, IsDateString, IsNumber, IsOptional, isString, IsString, ValidateNested } from "class-validator";

export class UpdateUserInfoDTO{

    @ApiPropertyOptional({type: String})
    @IsString()
    @IsOptional()
    readonly userName?: string

    @ApiPropertyOptional({type: String})
    @IsString()
    @IsOptional()
    readonly picture?: string

    @ApiPropertyOptional({type: String})
    @IsString()
    @IsOptional()
    readonly description?: string

    @ApiPropertyOptional({type: Boolean})
    @IsBoolean()
    @IsOptional()
    readonly hasSBT?: boolean

    @ApiPropertyOptional({type: Map})
    @IsOptional()
    readonly nicknames?: Map<String, String>
}