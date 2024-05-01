export declare class NFTCreationDTO {
    readonly ownedBy: string;
    readonly title: string;
    readonly images: string[];
    readonly collectionImage: string;
    readonly contractAddress: string;
    readonly floorPrice: number;
}
export declare class NFTModificationDTO {
    readonly contractAddress: string;
    readonly id: string;
    readonly isFav: boolean;
}
