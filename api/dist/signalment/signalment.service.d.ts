import { Model } from 'mongoose';
import { User } from 'src/user/interface/interface.user';
import { UserService } from 'src/user/user.service';
import { ProfileSignalmentDTO } from './dto/dto.profile_signalment';
import { ProfileSignalement } from './interface/interface.profile_signalment';
export declare class SignalmentService {
    private readonly profileSignalmentModel;
    private readonly userService;
    constructor(profileSignalmentModel: Model<ProfileSignalement>, userService: UserService);
    formatSignalment(signalment: ProfileSignalement, user: User): Promise<import("./response/response.profile_signalment").ProfileSignalmentInfoDTO>;
    signal(data: ProfileSignalmentDTO, userSignaling: User): Promise<import("./response/response.profile_signalment").ProfileSignalmentInfoDTO>;
    deleteSignalment(id: any, user: any): Promise<boolean>;
    banProfile(id: string, user: User): Promise<import("../user/response/response.user").UserInfoDTO>;
    showSignalments(offset: number, user: User): Promise<any[]>;
    formatMultipleSignalments(signalments: ProfileSignalement[], user: User): Promise<any[]>;
}
