import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/interface/interface.user";
import { formatToUserDTO, UserInfoDTO } from "src/user/response/response.user";
import { ProfileSignalement } from "../interface/interface.profile_signalment";

export class ProfileSignalmentInfoDTO{

    @ApiProperty({type: String})
    readonly id: string;

    @ApiProperty({type: UserInfoDTO, description: 'User signaling the profile'})
    readonly createdBy: UserInfoDTO

    @ApiProperty({type: String, description: 'Id signaled'})
    readonly idSignaled: string

    @ApiProperty({type: Number, description : "Type (0 = conversation or profile, 1 = group, 2 = community)"})
    readonly type: number

    @ApiProperty({type: String, description: 'Signalment description'})
    readonly description: string

    @ApiProperty({type: Date, description: 'Creation date'})
    readonly createdAt: Date
}

export function formatToProfileSignalmentDTO(data: ProfileSignalement, user: User): ProfileSignalmentInfoDTO{
    return {id: data.id, idSignaled: data.idSignaled, createdBy: formatToUserDTO(user, user), description: data.description, createdAt: data.createdAt, type: data.type}
}