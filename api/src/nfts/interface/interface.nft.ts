import { User } from "src/user/interface/interface.user"

export interface NFT{
    id: string,
    ownedBy: User,
    title: string,
    images: string[]
    collectionImage: string,
    contractAddress: string,
    isFav: boolean,
    floorPrice: number,
    isNft: boolean,
    subtitle?: string,
    chain: string
}