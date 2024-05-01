import { ProfileSignalmentDTO } from './dto/dto.profile_signalment';
import { ProfileSignalmentInfoDTO } from './response/response.profile_signalment';
import { SignalmentService } from './signalment.service';
export declare class SignalmentController {
    private signalmentService;
    constructor(signalmentService: SignalmentService);
    signalProfile(data: ProfileSignalmentDTO, request: any): Promise<ProfileSignalmentInfoDTO>;
    deleteSignalment(id: any, request: any): Promise<boolean>;
    getProfileSignalments(offset: string, request: any): Promise<any[]>;
}
