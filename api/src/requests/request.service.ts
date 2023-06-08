import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Mongoose} from 'mongoose';
import {User} from "../user/interface/interface.user";
import { ApnsService } from 'src/apns/apns.service';
import { Join } from './interface/interface.request';
import { formatMultipleUsersDTO } from 'src/user/response/response.user';
import { StreamChat } from 'stream-chat';

@Injectable()
export class JoinService{
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Join') private readonly requestModel: Model<Join>,
    @InjectModel('Notification') private readonly notificationModel: Model<Notification>,
    private readonly apnsService: ApnsService) {}

    async createRequestToJoinPrivateGroup(data, user){
        const exists = await this.requestModel.findOne({requester: data.requester, receiver : data.receiver, channelId : data.channelId})
        if(exists) throw new BadRequestException("REQUEST_ALREADY_SENT")
        const him = await this.userModel.findById(data.receiver)
     const request = await new this.requestModel({requester: data.requester, receiver: data.receiver, channelId: data.channelId, channelName: data.channelName}).save()
     if (!request) throw new BadRequestException('CANT_SAVE_REQUEST')
     const body = user.userName != "" ? user.userName + " has requested to join " + data.channelName : (user.wallet.substring(0, 6) + "..." + (user.wallet.substring(user.wallet.length - 4))) + " has requested to join " + data.channelName;
     new this.notificationModel({channelId: data.channelId, channelName: data.channelName, requester: data.requester, hasBeenRead: false, type: 7, idData: user.id, picture: user.picture, belongTo: data.receiver, username: user.userName != "" ? user.userName :  user.wallet, message : body}).save()     
     if(him.fcmTokens.length > 0){
        if(him.fcmTokens[him.fcmTokens ? him.fcmTokens.length - 1 : 0].platform.toString() === "android") this.apnsService.receiveRequestToJoinGroupAndroid(user, him.fcmTokens.map(it => it.token), data.channelName)
        else this.apnsService.receiveRequestToJoinGroupIOS(user, him.fcmTokens.map(it => it.token), data.channelName);
        }
     return request
    }

    async retrieveRequests(channelId, user){
        const res = await this.requestModel.find({channelId: channelId});
        if (!res) {
            throw new BadRequestException('CANT_RETRIEVE_FOLLOWING_USERS');
        }
        const recipients = await this.requestModel.populate(res, {path: 'requester'});
        return formatMultipleUsersDTO(recipients.map(it => it.requester), user);
    }

    async acceptDeclineRequest(data, me){
        if(data.accept){
        const apiKey = "mhgk84t9jfnt"
        const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd"
        const serverClient = StreamChat.getInstance(apiKey, secret)
        const channels = await serverClient.queryChannels({type: 'try', id: data.channelId}, {}, {limit: 1})
        await channels[0].addMembers([data.requester])
        const body = me.userName != "" ? me.userName + " added you in group " + data.channelName : (me.wallet.substring(0, 6) + "..." + (me.wallet.substring(me.wallet.length - 4))) + " added you in group " + data.channelName;
        const him = await this.userModel.findById(data.requester)
        new this.notificationModel({hasBeenRead: false, type: 5, idData: me.id, picture: me.picture, belongTo: data.requester, username: me.userName != "" ? me.userName :  me.wallet, message: body}).save()     
        if(him.fcmTokens.length > 0){
            if(him.fcmTokens[him.fcmTokens ? him.fcmTokens.length - 1 : 0].platform.toString() === "android") this.apnsService.userAddedInGroupAndroid(me, him.fcmTokens.map(it => it.token), data.channelName, data.channelId)
            else this.apnsService.userAddedInGroupIOS(me, him.fcmTokens.map(it => it.token), data.channelName,data.channelId)
            }
        await this.requestModel.findOneAndDelete({requester: data.requester, receiver: data.receiver})
        await this.notificationModel.findOneAndDelete({requester: data.requester, channelId: data.channelId, belongTo: me.id})
        } else {
            await this.requestModel.findOneAndDelete({requester: data.requester, receiver: data.receiver})
            await this.notificationModel.findOneAndDelete({requester: data.requester, channelId: data.channelId, belongTo: me.id})
        }
    }
}