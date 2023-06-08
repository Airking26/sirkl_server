import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/interface/interface.user";
import { formatToUserDTO, UserInfoDTO } from "src/user/response/response.user";
import { NFT } from "../interface/interface.nft";

export class NFTInfoDTO{

    @ApiProperty({type: String})
    readonly id: string

    @ApiProperty({type: String})
    readonly title: string

    @ApiProperty({type: String, isArray: true})
    readonly images: string[]

    @ApiProperty({type: String})
    readonly collectionImage: string

    @ApiProperty({type: String})
    readonly contractAddress: string

    @ApiProperty({type: Boolean})
    readonly isFav: boolean
}

export function formatToNFTInfoDTO(data: NFT): NFTInfoDTO{
    const {id, title, images, collectionImage, contractAddress, isFav} = data
    return{
        id,
        title,
        images,
        collectionImage,
        contractAddress,
        isFav
    }
}

export function formatMultipleNftInfoDTO(data: NFT[]){
    return data.map(it => formatToNFTInfoDTO(it))
}