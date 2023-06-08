import {ApiOkResponse, ApiParam, ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiBody } from "@nestjs/swagger";
import { GroupService } from "./group.service";
import { GroupDTO } from "./response/response.group";
import { JwtAuthGuard } from "src/auth/passport/auth_guard";
import {Body, Controller, Get, Param, Post, UseGuards} from "@nestjs/common";
import { GroupCreationDTO } from "./dto/dto.group";

@ApiBearerAuth()
@ApiTags("Group")
@UseGuards(JwtAuthGuard)
@Controller("group")
export class GroupController{
    constructor(private readonly groupService: GroupService){}

    @ApiCreatedResponse({type: GroupDTO, isArray: false})
    @ApiBody({type: GroupCreationDTO, required: true})
    @Post("create")
    createGroup(@Body() groupCreationDTO : GroupCreationDTO){
        return this.groupService.createGroup(groupCreationDTO)
    }

    @ApiOkResponse({type: GroupDTO, isArray: true})
    @Get("retrieve")
    retrieveGroups(){
        return this.groupService.retrieveGroups()
    }

}