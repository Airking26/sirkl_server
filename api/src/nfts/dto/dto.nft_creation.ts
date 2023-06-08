import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, IsBoolean, IsNumber } from "class-validator";


export class NFTCreationDTO{
    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly ownedBy: string;

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @ApiProperty({type: String, isArray: true})
    @IsNotEmpty()
    @IsString({each: true})
    @IsArray()
    readonly images: string[];

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly collectionImage: string;

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly contractAddress: string;

    @ApiProperty({type: Number})
    @IsNotEmpty()
    @IsNumber()
    readonly floorPrice: number
}

export class NFTModificationDTO{

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly contractAddress: string;

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    readonly id: string;

    @ApiProperty({type: Boolean})
    @IsNotEmpty()
    @IsBoolean()
    readonly isFav: boolean
}