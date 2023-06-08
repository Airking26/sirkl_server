import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/passport/auth_guard";
import { UserInfoDTO } from "src/user/response/response.user";
import { StoryCreationDTO, StoryModificationDTO } from "./dto/story.dto";
import { StoryDTO } from "./response/story.response";
import { StoryService } from "./story.service";


@ApiBearerAuth()
@ApiTags("Story")
@UseGuards(JwtAuthGuard)
@Controller("story")
export class StoryController{

    constructor(private readonly storyService: StoryService){}

    @ApiOperation({summary: "create a story"})
    @ApiBody({type: StoryCreationDTO, required: true})
    @ApiOkResponse({type: StoryDTO, isArray: false})
    @Post("create")
    createStory(@Body() storyCreationDTO: StoryCreationDTO, @Req() request){
        return this.storyService.createStory(storyCreationDTO, request.user)
    }

    @ApiOperation({summary: "update a story"})
    @ApiBody({type: StoryModificationDTO, required: true})
    @Patch("modify")
    @ApiOkResponse({type: StoryDTO, isArray: false})
    updateStory(@Body() storyModificationDTO: StoryModificationDTO, @Req() request){
        return this.storyService.modifyStory(storyModificationDTO, request.user)
    }

    @ApiOperation({summary: "retrieve stories"})
    @ApiParam({name : 'offset'})
    @Get("others/:offset")
    retrieveStories(@Param("offset") offset, @Req() request){
        return this.storyService.retrieveStories(Number(offset), request.user)
    }

    @ApiOperation({summary: "retrieve my stories"})
    @ApiOkResponse({type: StoryDTO, isArray: true})
    @Get("mine")
    retrieveMyStories(@Req() request){
        return this.storyService.retrieveMyStories(request.user)
    }

    @ApiOperation({summary: "retrieve readers for story"})
    @ApiOkResponse({type: UserInfoDTO, isArray: true})
    @ApiParam({name : 'id'})
    @Get("readers/:id")
    retrieveReadersForStory(@Param("id") id, @Req() request){
        return this.storyService.retrieveReadersForStory(id, request.user)
    }

    @ApiOperation({summary: "delete story"})
    @ApiOkResponse({type: StoryDTO, isArray: false})
    @ApiParam({name: "createdBy"})
    @ApiParam({name : 'id'})
    @Delete("mine/:createdBy/:id")
    deleteStory(@Param("createdBy") createdBy: string, @Param("id") id: string,  @Req() request){
        return this.storyService.deleteStory(createdBy, id, request.user)
    }

}