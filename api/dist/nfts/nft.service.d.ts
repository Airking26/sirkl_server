import { Model } from "mongoose";
import { User } from "src/user/interface/interface.user";
import { NFTCreationDTO, NFTModificationDTO } from "./dto/dto.nft_creation";
import { NFT } from "./interface/interface.nft";
import { NFTInfoDTO } from "./response/response.nft";
export declare class NFTService {
    private readonly nftModel;
    private readonly userModel;
    constructor(nftModel: Model<NFT>, userModel: Model<User>);
    createMultipleCollections(data: NFTCreationDTO[], user: User): Promise<NFTInfoDTO[]>;
    createCollection(data: NFTCreationDTO, user: User): Promise<NFTInfoDTO>;
    retrieveNFT(user: User, id: string, offset: number, fav: boolean): Promise<NFTInfoDTO[]>;
    updateNFT(user: User): Promise<void>;
    updateNFTStatus(data: NFTModificationDTO, user: User): Promise<NFTInfoDTO>;
    getAllNFTs(user: User): Promise<void>;
}
