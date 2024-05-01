import { NFT } from "../interface/interface.nft";
export declare class NFTInfoDTO {
    readonly id: string;
    readonly title: string;
    readonly images: string[];
    readonly collectionImage: string;
    readonly contractAddress: string;
    readonly isFav: boolean;
}
export declare function formatToNFTInfoDTO(data: NFT): NFTInfoDTO;
export declare function formatMultipleNftInfoDTO(data: NFT[]): NFTInfoDTO[];
