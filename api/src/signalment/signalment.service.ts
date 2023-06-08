import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/interface/interface.user';
import { UserService } from 'src/user/user.service';
import { ProfileSignalmentDTO } from './dto/dto.profile_signalment';
import { ProfileSignalement } from './interface/interface.profile_signalment';
import { formatToProfileSignalmentDTO } from './response/response.profile_signalment';

@Injectable()
export class SignalmentService {
    constructor(@InjectModel('ProfileSignalment') private readonly profileSignalmentModel: Model<ProfileSignalement>,
    private readonly userService: UserService){}

    async formatSignalment(signalment: ProfileSignalement, user: User){
        const sig = await  this.profileSignalmentModel.populate(signalment, [{path: 'createdBy'}])
        return formatToProfileSignalmentDTO(sig, user)
    }

    async signal(data: ProfileSignalmentDTO, userSignaling: User){
        const model = await new this.profileSignalmentModel(data).save()
        return this.formatSignalment(model, userSignaling)
    }

    async deleteSignalment(id, user){
        if(!user.isAdmin){
            throw new NotAcceptableException('USER_IS_NOT_ADMIN')
        }

        const signalment = await this.profileSignalmentModel.findOneAndRemove({_id: id})

        if(!signalment){
            throw new NotFoundException('SIGNALMENT_DOES_NOT_EXIST')
        }
        return true

    }

    async banProfile(id: string, user: User){
        if(!user.isAdmin){
            throw new NotAcceptableException('USER_IS_NOT_ADMIN')
        }

        await this.profileSignalmentModel.deleteMany({userSignaled: id})
        return this.userService.banProfile(id, user)
    }

    async showSignalments(offset: number, user: User){
        const res = await this.profileSignalmentModel.find().sort({createdAt: 'descending'})
        .skip(offset * 12)
        .limit(12)
        return this.formatMultipleSignalments(res, user)
    }

    async formatMultipleSignalments(signalments: ProfileSignalement[], user: User){
        const data = []

        for(let it in signalments){
            const res = await this.formatSignalment(signalments[it], user)
            data.push(res)
        }

        return data
    }

}
