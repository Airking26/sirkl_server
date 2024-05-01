import { NFTModificationDTO } from "./dto/dto.nft_creation";
import { NFTService } from "./nft.service";
import { NFTInfoDTO } from "./response/response.nft";
export declare class NFTController {
    private nftService;
    constructor(nftService: NFTService);
    getAllNfts(request: any): Promise<void>;
    updateAllNfts(request: any): Promise<void>;
    retrieveFavNft(id: string, favorite: boolean, offset: string, request: any): Promise<NFTInfoDTO[]>;
    updateUser(request: any, data: NFTModificationDTO): Promise<NFTInfoDTO>;
}
