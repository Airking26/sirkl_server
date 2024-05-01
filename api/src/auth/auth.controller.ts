import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserInfoDTO } from 'src/user/response/response.user';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/dto.sign-in';
import { SignInSeedPhraseDTO } from './dto/dto.sign-in-seed-phrase';
import { SignUpDTO } from './dto/dto.sign-up';
import { WalletConnectDTO } from './dto/dto.wallet-connect';
import JwtRefreshGuard from './passport/auth_guard';
import { RefreshTokenDTO, SignInSuccessDTO } from './response/response.sign_in';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @ApiOperation({summary: 'Pass refresh token in order to get a new access token'})
    @ApiCreatedResponse({type: RefreshTokenDTO})
    @ApiConflictResponse({description: 'Unanthorized, user must log back in'})
    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refreshAccessToken(@Req() request){
        return this.authService.handleRefreshToken(request.user)
    }

    @Get('createUAW')
    createUAW(){
      return this.authService.createUAW()
    }

    @ApiOperation({summary: 'Log user out'})
    @ApiCreatedResponse({type: UserInfoDTO})
    @ApiNotFoundResponse({description: 'User not found'})
    @UseGuards(JwtRefreshGuard)
    @Post('logout')
    logOut(@Req() request){
        return this.authService.signUserOut(request.user)
    }


  @ApiOperation({summary: "verify signature"})
  @Post("verifySignature")
  @ApiBody({type: WalletConnectDTO})
  verifySignature(@Body() walletConnectDTO: WalletConnectDTO){
    return this.authService.verifySignature(walletConnectDTO);
  }

  @ApiOperation({summary : "create wallet"})
  @Get("create")
  @ApiCreatedResponse({type: SignInSuccessDTO})
  createWalletOnTheFly(){
    return this.authService.createWalletOnTheFly()
  }

}
