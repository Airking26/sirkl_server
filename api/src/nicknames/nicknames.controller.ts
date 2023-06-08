import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/passport/auth_guard";
import { NicknameCreationDTO } from "./dto/dto.nickname";
import { NicknamesService } from "./nicknames.service";

@ApiBearerAuth()
@ApiTags("Nicknames")
@UseGuards(JwtAuthGuard)
@Controller("nicknames")
export class NicknamesController{
    constructor(private readonly nicknamesService: NicknamesService){}

    @ApiOperation({summary: "retrieve nicknames"})
    @Get("retrieve")
    retrieveInboxes(@Req() request){
        return this.nicknamesService.retrieveNicknames(request.user)
    }

    @ApiOperation({summary : 'update nicknames'})
    @ApiParam({ name: "wallet", description: "wallet", allowEmptyValue: false })
    @ApiBody({ type: NicknameCreationDTO, required: true })
    @Put(":wallet")
    updateInbox(@Body() nicknameCreationDTO: NicknameCreationDTO, @Param('wallet') wallet: string, @Req() request){
        return this.nicknamesService.addNickname(request.user, wallet, nicknameCreationDTO.nickname)
    }

}