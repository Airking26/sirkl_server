import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { time } from 'cron';
import { off } from 'process';
import { identity } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/passport/auth_guard';
import { UserInfoDTO } from 'src/user/response/response.user';
import { ProfileSignalmentDTO } from './dto/dto.profile_signalment';
import { ProfileSignalmentInfoDTO } from './response/response.profile_signalment';
import { SignalmentService } from './signalment.service';

@ApiBearerAuth()
@ApiTags('Signalment')
@UseGuards(JwtAuthGuard)
@Controller('signalment')
export class SignalmentController {

    constructor(private signalmentService: SignalmentService){}

    @ApiOperation({summary: 'Report'})
    @ApiBody({type: ProfileSignalmentDTO, required: true})
    @ApiOkResponse({type: ProfileSignalmentInfoDTO, isArray: false})
    @Post('report')
    signalProfile(@Body() data: ProfileSignalmentDTO, @Req() request){
        return this.signalmentService.signal(data, request.user)
    }

    @ApiOperation({summary: 'Delete Signalment - Admin Required'})
    @ApiParam({name: 'id', description: 'Signalment ID', allowEmptyValue: false})
    @ApiOkResponse({type: UserInfoDTO, isArray: false})
    @Delete(':id')
    deleteSignalment(@Param('id') id, @Req() request){
        return this.signalmentService.deleteSignalment(id, request.user)
    }

    /*@ApiOperation({summary: 'Ban an existing Profile and delete profile signalments - Admin Required'})
    @ApiParam({name: 'id', description: 'profile id', allowEmptyValue: false})
    @ApiOkResponse({type: UserInfoDTO, isArray: false})
    @Delete('profile/:id')
    banProfile(@Param('id') id, @Req() request){
        return this.signalmentService.banProfile(id, request.user)
    }*/

    @ApiOperation({summary: 'Get profile signalments'})
    @ApiParam({name: 'offset', description: 'Pass 0 to start, then increment in order to get 12 more ', allowEmptyValue: false})
    @ApiResponse({type: ProfileSignalmentInfoDTO, isArray: true})
    @Get('profile/all/:offset')
    getProfileSignalments(@Param('offset') offset: string, @Req() request){
        return this.signalmentService.showSignalments(Number(offset), request.user)
    }
}
