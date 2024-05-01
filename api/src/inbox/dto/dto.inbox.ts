import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { isBoolean } from "lodash";

export class InboxCreationDTO{
    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly idChannel: string;

    @ApiProperty({type: String, isArray: true})
    @IsArray()
    @IsString({each: true})
    readonly wallets: string[];

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly createdBy: string;

    @ApiPropertyOptional({type: String})
    @IsOptional()
    @IsString()
    readonly message: string

    @ApiPropertyOptional({type: String, isArray: true})
    @IsArray()
    @IsOptional()
    @IsString({each: true})
    readonly members: string[]

    @ApiProperty({type: Boolean})
    @IsBoolean()
    readonly isConv: boolean

    @ApiPropertyOptional({type: String})
    @IsOptional()
    @IsString()
    readonly nameOfGroup: string

    @ApiPropertyOptional({type: String})
    @IsOptional()
    @IsString()
    readonly picOfGroup: string

    @ApiPropertyOptional({type: Boolean})
    @IsOptional()
    @IsBoolean()
    readonly isGroupPrivate: boolean

    @ApiPropertyOptional({type: Boolean})
    @IsOptional()
    @IsBoolean()
    readonly isGroupVisible: boolean

    @ApiPropertyOptional({type: Boolean})
    @IsOptional()
    @IsBoolean()
    readonly isGroupPaying: boolean

}