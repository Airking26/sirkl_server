import { Body, Controller, Get, Param, Patch, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/passport/auth_guard";
import { NFTCreationDTO, NFTModificationDTO } from "./dto/dto.nft_creation";
import { NFTService } from "./nft.service";
import { NFTInfoDTO } from "./response/response.nft";
import { GroupCreationDTO } from "src/group/dto/dto.group";

@ApiBearerAuth()
@ApiTags("NFT")
@UseGuards(JwtAuthGuard)
@Controller("nft")
export class NFTController{

    constructor(private nftService: NFTService){}

    /*@ApiOperation({summary : "Create multiple nft collections"})
    @ApiBody({type: NFTCreationDTO, isArray: true})
    @ApiOkResponse({type: NFTInfoDTO, isArray: true})
    @Put("bulk")
    createMultipleNFTCollections(@Body() data: NFTCreationDTO[], @Req() request){
        return this.nftService.createMultipleCollections(data, request.user)
    }

    @ApiOperation({summary : "Create multiple nft collections"})
    @ApiBody({type: NFTCreationDTO})
    @ApiOkResponse({type: NFTInfoDTO})
    @Post()
    createNFTCollection(@Body() data: NFTCreationDTO, @Req() request){
        return this.nftService.createCollection(data, request.user)
    }*/

    @ApiOperation({summary: "Get all nfts"})
    @Get('retrieveAll')
    getAllNfts(@Req() request){
        return this.nftService.getAllAssets(request.user);
    }

    @ApiOperation({summary: "Update all nfts"})
    @Get('updateAll')
    updateAllNfts(@Req() request){
        return this.nftService.updateAssets(request.user);
    }

    @ApiOperation({summary: "Get nfts with offset"})
    @ApiParam({name: "id"})
    @ApiParam({name: "favorite"})
    @ApiParam({name: "offset"})
    @ApiOkResponse({type: NFTInfoDTO, isArray: true})
    @Get('retrieve/:id/:favorite/:offset')
    retrieveFavNft(@Param("id") id: string, @Param("favorite") favorite : boolean, @Param("offset") offset: string, @Req() request){
        return this.nftService.retrieveAssets(request.user, id, Number(offset), favorite);
    }

    @ApiOperation({ summary: "Modify NFT infos" })
    @ApiBody({ type: NFTModificationDTO, required: true })
    @ApiOkResponse({ type: NFTInfoDTO, isArray: false })
    @Patch("update")
    updateUser(@Req() request, @Body() data: NFTModificationDTO) {
        return this.nftService.updateAssetStatus(data, request.user);
    }

    @ApiOperation({ summary: "Retrieve contract addresses"})
    @ApiOkResponse({ type: [String] })
    @Get('retrieve_contract_address')
    retrieveContractAddress(@Req() req){
        return this.nftService.retrieveContractAddresses(req.user)
    }

    @ApiOperation({summary : "Retrieve group that can be created"})
    @ApiParam({name: "offset"})
    @ApiOkResponse({type: GroupCreationDTO, isArray: true})
    @Get('retrieve/group_to_create/:offset')
    retrieveGroupToCreate(@Param("offset") offset: string, @Req() request){
        return this.nftService.retrieveAssetToCreateNewGroup(request.user, Number(offset))
    }

}