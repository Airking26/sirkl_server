import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/passport/auth_guard";
import { InboxCreationDTO } from "./dto/dto.inbox";
import { InboxService } from "./inbox.service";

@ApiBearerAuth()
@ApiTags("Inbox")
@UseGuards(JwtAuthGuard)
@Controller("inbox")
export class InboxController{
    constructor(private readonly inboxService: InboxService){}

    @ApiOperation({summary: "create an inbox"})
    @ApiBody({type: InboxCreationDTO, required: true})
    @ApiOkResponse({type: String})
    @Post("create")
    createInbox(@Body() inboxCreationDTO: InboxCreationDTO, @Req() request){
        return this.inboxService.createChannel(inboxCreationDTO, request.user)
    }

    @ApiOperation({summary: "update inboxes"})
    @Get("update")
    updateInbox(@Req() request){
        return this.inboxService.updateChannel(request.user)
    }

    @ApiOperation({summary: "retrieve ETH address from ENS"})
    @ApiParam({name : 'ens'})
    @Get("eth_from_ens/:ens")
    getEthFromEns(@Param("ens") ens: string, @Req() request){
        return this.inboxService.queryENSforETHaddress(ens)
    }

    @ApiOperation({summary: "retrieve ENS address from Wallet"})
    @ApiParam({name : 'wallet'})
    @Get("ens_from_eth/:wallet")
    getEnsFromEth(@Param("wallet") wallet: string, @Req() request){
        return this.inboxService.queryEthAddressforENS(wallet)
    }

    @ApiOperation({summary : "Delete inbox"})
    @ApiParam({name: "id", description: "Id channel"})
    @Delete('delete/:id')
    deleteInbox(@Param("id") id: string, @Req() request){
        return this.inboxService.deleteInbox(id, request.user)
    }

    @ApiOperation({summary: 'delete channels'})
    @Delete("deleteChannels")
    deleteChannels(@Req() request){
        return this.inboxService.deleteChannels()
    }

    /*@ApiOperation({summary: "retrieve inboxes"})
    @ApiParam({ name: "offset", description: "offset", allowEmptyValue: false })
    @ApiOkResponse({type: InboxDTO, isArray: true})
    @Get("retrieve/:offset")
    retrieveInboxes(@Param('offset') offset, @Req() request){
        return this.inboxService.retrieveInbox(request.user, Number(offset))
    }

    @ApiOperation({summary : 'modify inbox'})
    @ApiBody({type: InboxModificationDTO, required: true})
    @ApiOkResponse({type: InboxDTO, isArray: false})
    @Patch(":id")
    updateInbox(@Param('id') id: string, @Body() data: InboxModificationDTO, @Req() request){
        return this.inboxService.updateInbox(id, data, request.user)
    }

    @ApiOperation({summary : 'clear unread messages'})
    @ApiOkResponse({type: InboxDTO, isArray: false})
    @Patch("clear/:id")
    clearUnreadMessages(@Param('id') id: string, @Req() request){
        return this.inboxService.clearMessagesUnread(id, request.user)
    }

    @ApiOperation({summary: "Search user by username or wallet"})
    @ApiParam({name: 'name', description: 'Searched substring'})
    @ApiOkResponse({type: InboxDTO, isArray: true})
    @Get("search/:name")
    searchUser(@Param('name') name, @Req() request){
        return this.inboxService.searchInbox(name, request.user)
    }

    @ApiOperation({summary: "Send peer message to multiple users"})
    @ApiBody({type: InboxCreationDTO, required: true, isArray: true})
    @ApiOkResponse({type: InboxDTO, isArray: true})
    @Post("bulk")
    bulkPeerMessageToMultipleUsers(@Body() data: InboxCreationDTO[], @Req() request){
        return this.inboxService.bulkInboxes(data, request.user)
    }*/
    
}