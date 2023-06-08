import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/interface/interface.user";
import { formatToUserDTO, UserInfoDTO } from "src/user/response/response.user";
import { Story } from "../interface/story.interface";

export class StoryDTO{

    @ApiProperty({type: String})
    readonly id: string

    @ApiProperty({type: String, isArray: true})
    readonly url: string[]

    @ApiProperty({type: UserInfoDTO})
    readonly createdBy: UserInfoDTO

    @ApiProperty({type: String, isArray: true})
    readonly readers: string[]

    @ApiProperty({type: Date})
    readonly createdAt: Date

    @ApiProperty({type: Number})
    readonly type: number
}

export function formatToStoryDTO(data: Story, user: User){
    const {_id, createdBy, readers, url, createdAt, type} = data;
    return{
        id: _id,
        createdBy : formatToUserDTO(createdBy, user),
        readers,
        url,
        createdAt,
        type
    }
}

export function formatMultipleStoryDTO(data: Story[][], user: User){
    return data.map(it => it.map(e => formatToStoryDTO(e, user)))
}

export function formatMyStories(data: Story[], user: User){
    return data.map(it => formatToStoryDTO(it, user))
}