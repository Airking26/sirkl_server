import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {Model, mongo} from 'mongoose';
import { use } from "passport";
import { User } from "src/user/interface/interface.user";
import { formatToUserDTO } from "src/user/response/response.user";
import { Notification } from "./interface/interface.notification";
import { formatMulitpleNotificationInfoDTO, formatToNotificationInfoDTO } from "./response/response.notification";
import { ApnsService } from "src/apns/apns.service";
import { StreamChat } from "stream-chat";

@Injectable()
export class NotificationService{
    constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly apnsService: ApnsService){}

    async showNotifications(belongTo: string, user: User, offset){
        const res = await this.notificationModel.find({belongTo: belongTo}).sort({createdAt: 'descending'}).skip(offset * 12)
        .limit(12).exec();

        if (!res) {
            throw new BadRequestException('CANT_RETRIEVE_NOTIFICATIONS');
        }
        await this.notificationModel.updateMany({belongTo: belongTo},{hasBeenRead: true}, {new: true, useFindAndModify: false, multi: true}).exec()
        return formatMulitpleNotificationInfoDTO(res, user)
    }

    async removeNotification(idNotification: string){
        const res = await this.notificationModel.findByIdAndDelete(idNotification)
        if(!res){
            throw new BadRequestException('CANT_RETRIEVE_NOTIFICATION')
        }
        return res
    }

    async hasNotifUnread(belongTo: string, user: User){
        const res = await this.notificationModel.find({belongTo: belongTo, hasBeenRead: false}).exec()
        if(res.length > 0) return true 
        else return false
    }

    async registerNotification(user, data){
        const res = await new this.notificationModel({hasBeenRead: false, type: 4, idData: "63f78a6188f7d4001f68699a", picture: "https://sirkl-bucket.s3.eu-central-1.amazonaws.com/app_icon_rounded.png", belongTo: user.id, username: "SIRKL.io", message: data.message}).save()     
        return
    }

    async notifyUserAddedInGroup(me, data){
        const body = me.userName != "" ? me.userName + " added you in group " + data.channelName : (me.wallet.substring(0, 6) + "..." + (me.wallet.substring(me.wallet.length - 4))) + " added you in group " + data.channelName;
        const him = await this.userModel.findById(data.idUser)
        new this.notificationModel({hasBeenRead: false, type: 5, idData: me.id, picture: me.picture, belongTo: data.idUser, username: me.userName != "" ? me.userName :  me.wallet, message: body, channelId: data.idChannel}).save()     
        if(him.fcmTokens.length > 0){
            if(him.fcmTokens[him.fcmTokens ? him.fcmTokens.length - 1 : 0].platform.toString() === "android") this.apnsService.userAddedInGroupAndroid(me, him.fcmTokens.map(it => it.token), data.idChannel, body)
            else this.apnsService.userAddedInGroupIOS(me, him.fcmTokens.map(it => it.token), data.idChannel, body)
            }
    }

    async notifyUserAsAdmin(me, data){
        const body = me.userName != "" ? me.userName + " upgraded you as admin in group " + data.channelName : (me.wallet.substring(0, 6) + "..." + (me.wallet.substring(me.wallet.length - 4))) + " upgraded you as admin in group " + data.channelName;
        const him = await this.userModel.findById(data.idUser)
        new this.notificationModel({hasBeenRead: false, type: 6, idData: me.id, picture: me.picture, belongTo: data.idUser, username: me.userName != "" ? me.userName :  me.wallet, message : body}).save()     
        if(him.fcmTokens.length > 0){
            if(him.fcmTokens[him.fcmTokens ? him.fcmTokens.length - 1 : 0].platform.toString() === "android") this.apnsService.userAddedAsAdminAndroid(me, him.fcmTokens.map(it => it.token), data.channelName, data.idChannel)
            else this.apnsService.userAddedAsAdminIOS(me, him.fcmTokens.map(it => it.token),data.channelName, data.idChannel)
            }
    } 

    async notifyUserInvitedToJoinGroup(me, data){
        const body = me.userName != "" ? me.userName  + " has invited you to join group " + data.channelName + " for " + data.channelPrice + "ETH" : (me.wallet.substring(0, 6) + "..." + (me.wallet.substring(me.wallet.length - 4))) + " has invited you to join group " + data.channelName + " for " + data.channelPrice + "ETH"
        const him = await this.userModel.findById(data.idUser)
        if(data.paying){
            const apiKey = "mhgk84t9jfnt"
            const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd"
            const serverClient = StreamChat.getInstance(apiKey, secret)
            const channels = await serverClient.queryChannels({type: 'try', id: data.channelId}, {}, {limit: 1})
            let usersAwaiting: string[] | unknown = null
            usersAwaiting = channels[0].data.usersAwaiting
            if(usersAwaiting instanceof Array){
                if(!usersAwaiting.includes(data.requester)){
                    usersAwaiting.push(data.requester)
                }
            } else {
                usersAwaiting = [data.requester]
            }
            await channels[0].updatePartial({set:{"users_awaiting": usersAwaiting}})
        }
        new this.notificationModel({hasBeenRead: false, type: 8, idData: me.id, picture : me.picture, belongTo: data.idUser, username: me.userName != "" ? me.userName : me.wallet, message: body, channelId: data.idChannel, inviteId: data.inviteId, channelPrice: data.channelPrice}).save()
        if(him.fcmTokens.length > 0){
            this.apnsService.userInvitedToJoinGroup(me, him.fcmTokens.map(it => it.token), body, data.idChannel)
        }
    }
}