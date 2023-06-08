import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ApnsService } from "src/apns/apns.service";
import { FCMTokenPlatform } from "src/apns/interface/interface.fcm-tokens";
import { Nicknames } from "src/nicknames/interface/interface.nicknames";
import { User } from "src/user/interface/interface.user";
import { CallCreationDTO, CallModificationDTO } from "./dto/dto.call";
import { Call } from "./interface/interface.call";
import { formatMultipleCallDTO, formatToCallDTO } from "./response/response.call";

@Injectable()
export class CallService{
    constructor(@InjectModel("Call") private readonly callModel: Model<Call>, 
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Nicknames') private readonly nicknamesModel: Model<Nicknames>,
    private readonly apnsService: ApnsService){}

    async sendCallInvitationNotification(user, channel, userID, callId){
        const userToLocate = await this.userModel.findById(userID);
        if(userToLocate.fcmTokens.length > 0){
        if(userToLocate.fcmTokens[userToLocate.fcmTokens ? userToLocate.fcmTokens.length - 1 : 0].platform.toString() === "android") 
        this.apnsService.callInvitationAndroid(user, channel, userToLocate.fcmTokens.map(it => it.token), userID, callId)
        else { 
            this.apnsService.callInvitationApn(user, channel, userToLocate.apnToken, userID, callId)
        }
    }
        return userToLocate
    }

    async retrieveCalls(user: User, offset){
        const res = await this.callModel.find({ownedBy: user}).populate('ownedBy').populate('called').sort({updatedAt: "descending"}).skip(offset * 12).limit(12).exec();
        if (!res) throw new BadRequestException('CANT_RETRIEVE_FOLLOWING_USERS');
        return formatMultipleCallDTO(res, user)
    }

    async createCall(data: CallCreationDTO, user: User){
        const call = await new this.callModel({ownedBy: user.id, called: data.called, status: 0, updatedAt: data.updatedAt}).save()
        const callReceived = await new this.callModel({ownedBy: data.called, called: user.id, status: 1, updatedAt: data.updatedAt}).save()
        const userToLocate = await this.sendCallInvitationNotification(user, data.channel, data.called, callReceived.id)
        call.called = userToLocate
        return formatToCallDTO(call, user)
    }

    async updateCallStatus(data: CallModificationDTO, user: User){
        const call = await this.callModel.findById(data.id).populate('ownedBy').populate('called')
        call.status = data.status
        call.updatedAt = data.updatedAt
        await call.save()
        return formatToCallDTO(call, user)
    }

    async missedCall(userId: String, user: User){
        const userToLocate = await this.userModel.findById(userId);
        if(userToLocate.fcmTokens.length > 0){
        if(userToLocate.fcmTokens[userToLocate.fcmTokens ? userToLocate.fcmTokens.length - 1 : 0].platform.toString() === "android")
        this.apnsService.missedCallAndroid(user, userToLocate.fcmTokens.map(it => it.token))
        else this.apnsService.missedCallIOS(user, userToLocate.fcmTokens.map(it => it.token))
        }
    }

    async endACall(channelId: String, user: User, userID: String){
        const userToLocate = await this.userModel.findById(userID);
        if(userToLocate.fcmTokens.length > 0){
        if(userToLocate.fcmTokens[userToLocate.fcmTokens ? userToLocate.fcmTokens.length - 1 : 0].platform.toString() === "android")
        this.apnsService.declineCallAndroid(channelId, userToLocate.fcmTokens.map(it => it.token))
        else this.apnsService.declineCallIOS(channelId, userToLocate.fcmTokens.map(it => it.token))
        }

    }

    async searchCalls(substring: string, user: User){
        const calls = await this.callModel.find({ownedBy: user}).populate('ownedBy').populate('called').sort({updatedAt: "descending"}).exec();
        const userToLocate = await this.userModel.findById(user.id)
        const wallet = this.getByValue(new Map(userToLocate.nicknames), substring)
        let results
        if(wallet) {
        results = calls.filter((el) => { 
            return el.called.userName.toLowerCase().startsWith(substring.toLowerCase()) ||
             el.called.wallet.toLowerCase().startsWith(substring.toLowerCase()) ||
             el.called.wallet.toLowerCase().startsWith(wallet.toString().toLowerCase())
        }) } else {results = calls.filter((el) => { 
            return el.called.userName.toLowerCase().startsWith(substring.toLowerCase()) ||
             el.called.wallet.toLowerCase().startsWith(substring.toLowerCase())
        }) 
    }
        return formatMultipleCallDTO(results, user)
    }

     getByValue(map: Map<String, String>, searchValue: string) {
        for (let [key, value] of map) {
          if (value.toLowerCase() === searchValue.toLowerCase())
            return key.toString();
        }
      }
}