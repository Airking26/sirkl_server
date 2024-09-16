import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { request } from "express";
import { JwtAuthGuard } from "src/auth/passport/auth_guard";
import { UpdateFcmDTO } from "./dto/dto.update_fcm";
import { UpdateUserInfoDTO } from "./dto/dto.update_user";
import { LatestUserDTO, UserInfoDTO, UsersCountDTO } from "./response/response.user";
import { UserService } from "./user.service";
import { AdminUserGetStream } from "./dto/dto.admin";
import { WalletSearchDTO } from "./dto/dto.wallet_search";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get user infos" })
  @ApiCreatedResponse({ type: UserInfoDTO, isArray: false })
  @Get("me")
  getCurrentUser(@Req() request) {
    return this.userService.showUser(request.user.id, request.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Modify User infos" })
  @ApiBody({ type: UpdateUserInfoDTO, required: true })
  @ApiCreatedResponse({ type: UserInfoDTO, isArray: false })
  @Patch("me")
  updateUser(@Req() request, @Body() data: UpdateUserInfoDTO) {
    return this.userService.updateUserInfos(data, request.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary : "Connect to WS"})
  @Post("connect_to_ws")
  connecToWS(@Req() request){
    return this.userService.connectToWS(request.user)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete user" })
  @Delete(":id")
  deleteUser(@Param("id") id: string, @Req() request) {
    return this.userService.deleteUser(id, request.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({ name: "id", description: "User id", allowEmptyValue: false })
  @ApiOkResponse({ type: UserInfoDTO, isArray: false })
  @Get(":id")
  getUser(@Param("id") id: string, @Req() request) {
    return this.userService.showUser(id, request.user);
  }
  

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Upload an FCM Token" })
  @ApiBody({ type: UpdateFcmDTO, required: true })
  @ApiCreatedResponse({ type: UserInfoDTO, isArray: false })
  @Put("me/fcm")
  updateFCMToken(@Req() request, @Body() data: UpdateFcmDTO) {
    return this.userService.updateFCMToken(data, request.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Upload an APN Token" })
  @ApiOkResponse({ type: UserInfoDTO, isArray: false })
  @ApiParam({name: "apn", description: "APN Token", allowEmptyValue: false})
  @Put("me/apn/:apn")
  updateAPNToken(@Req() request, @Param("apn") apn: string) {
    return this.userService.updateApnToken(apn, request.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "retrieve user by wallet"})
  @ApiParam({ name: "wallet", description: "User wallet", allowEmptyValue: false })
  @ApiOkResponse({type: UserInfoDTO})
  @Get("search/:wallet")
  retrieveUserByWallet(@Param("wallet") wallet: string, @Req() request){
    return this.userService.find_user_by_wallet(request.user, wallet)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "retrieve token to streamchat"})
  @ApiOkResponse({type: String})
  @Get("me/tokenStreamChat")
  retrieveStreamChatToken(@Req() request){
    return this.userService.generateStreamChatToken(request.user)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "connect to getstream"})
  @Get("me/connect_to_get_stream")
  connectToGetStream(@Req() request){
    return this.userService.connectToGetStream(request.user)
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "make user admin or remove admin role"})
  @ApiBody({type: AdminUserGetStream, required: true})
  @Post("admin_role")
  changeAdminRole(@Body() adminUserGetStream: AdminUserGetStream, @Req() request){
    return this.userService.makeUserAdmin(adminUserGetStream, request.user)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "Add user to Sirkl Club"})
  @ApiParam({ name: "id", description: "User id", allowEmptyValue: false })
  @Get("add_user_to_sirkl_club/:id")
  addUserToSirklClub(@Param("id") id: string, @Req() request){
    return this.userService.addToSirklClub(request.user)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "receive welcome message"})
  @Get("me/welcome_message")
  getWelcomingMessage(@Req() request){
    return this.userService.receiveWelcomeMessage(request.user)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "retrieve agora token"})
  @ApiOkResponse({type: String})
  @Header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  @Header('Expires', '-1')
  @Header('Pragma', 'no-cache')
  @ApiParam({name: 'channel', allowEmptyValue: false})
  @ApiParam({name: 'role', allowEmptyValue: false})
  @ApiParam({name: 'tokenType', allowEmptyValue: false})
  @ApiParam({name: 'uid', allowEmptyValue: false})
  @Get("me/tokenAgoraRTC/:channel/:role/:tokenType/:uid")
  retrieveAgoraTokenRTC(@Req() request, @Param('channel') channel: string, @Param('role') role: string, @Param('tokenType') tokenType: string, @Param('uid') uid: string){
    return this.userService.generateAgoraTokenRTC(channel, role, tokenType, uid, request)
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get latest users signed up between 2 dates - Requires to be Admin. Param : 0 = username asc, 1 = username desc, 2 = wallet asc, 3 = wallet desc, 4 = date asc, 5 = date desc'})
  @ApiParam({name: 'offset', description: 'Pass 0 to start, then increment in order to get 50 more users', allowEmptyValue: false})
  @ApiBody( {type: LatestUserDTO, isArray: false })
  @ApiCreatedResponse({type: UsersCountDTO, isArray: false})
  @Get('newUsers/date/:offset')
  getNewUsersBetweenDates(@Param('offset') offset: string, @Body() body: LatestUserDTO, @Req() request) {
      return this.userService.getLatestUsersBetweenDates(offset, request.user, body.from, body.to, body.param, body.name);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get latest users signed up between 2 dates - Requires to be Admin. Param : 2 = updatedAt asc, 1 = updatedAt desc, 3 = android + last updated, 4 = ios + last udpated, 5 = web + last updated, 6 = android + first connection, 7 = ios + first connection, 8 = web + first connection'})
  @ApiParam({name: 'offset', description: 'Pass 0 to start, then increment in order to get 50 more users', allowEmptyValue: false})
  @ApiBody( {type: LatestUserDTO, isArray: false })
  @ApiCreatedResponse({type: UsersCountDTO, isArray: false})
  @Get('active/date/:offset')
  getActiveUsersBetweenDates(@Param('offset') offset: string, @Body() body: LatestUserDTO, @Req() request) {
      return this.userService.getLatestActiveUsersBetweenDates(offset, body.from, body.to, body.param, request.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get latest users count who signed up between 2 dates - Requires to be Admin'})
  @ApiBody( {type: LatestUserDTO, isArray: false })
  @ApiCreatedResponse({type: UsersCountDTO, isArray: false})
  @Get('newUsersCount/date/')
  getNewUsersCountBetweenDates(@Body() body: LatestUserDTO, @Req() request) {
      return this.userService.getLatestUsersCountBetweenDates(request.user, body.from, body.to);
  }

  @ApiOperation({summary: "Check if username is free"})
  @ApiParam({name: 'value', description: 'value to check', allowEmptyValue: false})
  @ApiOkResponse({type: Boolean})
  @Get('check_username_free/:value')
  checkWalletIsUser(@Param('value') value: string, @Req() request) {
    return this.userService.isUsernameValid(value);
  }

  /*@ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({name: 'value', description: 'value to check', allowEmptyValue: false})
  @Get("test/:value")
  test(@Param('value') value: string){
    return this.userService.test(value);
  }

  /*@ApiOperation({summary: 'Return an array of wallets existing based on a given array of wallets'})
  @Post('check-wallets')
  @ApiBody({type: WalletSearchDTO, isArray: false})
  @ApiOkResponse({type: WalletSearchDTO, isArray: false})
  async checkWallets(@Body() body: WalletSearchDTO, @Req() request) {
    return this.userService.findExistingWallets(body.wallets);
  }*/

}
