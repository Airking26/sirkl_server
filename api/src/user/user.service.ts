import {
  BadRequestException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model} from "mongoose";
import { UpdateFcmDTO } from "./dto/dto.update_fcm";
import { UpdateUserInfoDTO } from "./dto/dto.update_user";
import { User } from "./interface/interface.user";
import { UserInfoDTO, formatLatestUserCountDTO, formatToUserDTO, formatToUsersCountDTO } from "./response/response.user";
import { ApnsService } from "src/apns/apns.service";
import { SignUpDTO } from "src/auth/dto/dto.sign-up";
import { Channel, StreamChat } from "stream-chat";
import { WalletConnectDTO } from "src/auth/dto/dto.wallet-connect";
import { RtcRole, RtcTokenBuilder, RtmRole, RtmTokenBuilder } from "agora-access-token";
import { JwtPayload } from "src/auth/passport/interface/auth.passport.interface.jwt_payload";
import { Follow } from "src/follow/interface/interface.follow";
import { Call } from "src/call/interface/interface.call";
import { Inbox } from "src/inbox/interface/interface.inbox";
import { Nicknames } from "src/nicknames/interface/interface.nicknames";
import { Notification } from "src/notifications/interface/interface.notification";
import { Story } from "src/story/interface/story.interface";
import { NFT } from "src/nfts/interface/interface.nft";
import hmacSHA512 from 'crypto-js/hmac-sha512';
import { request } from "https";
import { isLeafType } from "graphql";
import { io } from "socket.io-client";
import { FCMTokenPlatform } from "src/apns/interface/interface.fcm-tokens";
import { FollowService } from "src/follow/follow.service";
import { AdminUserGetStream } from "./dto/dto.admin";

@Injectable()
export class UserService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<User>,
    @InjectModel('Follow') private readonly followModel: Model<Follow>,
    @InjectModel('Call') private readonly callModel: Model<Call>,
    @InjectModel('Inbox') private readonly inboxModel: Model<Inbox>,
    @InjectModel('Nicknames') private readonly nicknamesModel: Model<Nicknames>,
    @InjectModel('Notification') private readonly notificationModel: Model<Notification>,
    @InjectModel('Story') private readonly storyModel: Model<Story>,
    @InjectModel('NFT') private readonly nftModel: Model<NFT>,
    private readonly followService : FollowService
        ) {}

  private readonly logger = new Logger("ALARM");

async createUserWithWallet(wallet: String, ens: String, platform: String) {
  var name;
  if(ens == undefined || ens == "0") name = ""
  else name = ens
  const walletCount = await this.userModel.count({wallet: wallet.toLowerCase(), userName: name});
  if (walletCount > 0) {
      throw new BadRequestException('WALLET_ALREADY_USED');
  }
  return new this.userModel({wallet : wallet.toLowerCase(), platformCreated: platform}).save();
}

  async get_user_by_wallet(wallet: string): Promise<User>{
    return this.userModel.findOne({wallet: wallet})
  }

  async find_user_by_wallet(user, wallet: string){
    const res = await this.userModel.findOne({wallet: wallet})
    if(!res) return null
    return formatToUserDTO(res, user);
  }

  async connectToWS(user){
    let socketMobile = null
    const api = "Xz8w4MK784c5p3sPjWY3HdQA87Z9TqCTB2jNzu34vsLhzk4cK5LG5x3a9R7uj8C8"
    const payload = JSON.stringify({"wallet": user.wallet, "user_id": user.id})
    const signature = hmacSHA512(payload, api)
    const options = {
      headers : {"X-Sirkl-Signature" : signature, 'Content-Type': 'application/json', 'Content-Length': payload.length},
      method: "POST",
      hostname: 'app.sirkl.io',
      path: "/api/socket/createToken",
      body: {"wallet": user.wallet, "user_id": user.id}
    }
    const req = request(options, (res) => {

    let data = ""

      res.on('data', (d) => {
        data += d
      });

      res.on("end", async () => {
        let token = JSON.parse(data).token;

        socketMobile = io('https://app.sirkl.io:21000/mobile', {
          transports: ["websocket"],
          rejectUnauthorized: false,
          auth: {
            token: token,
            wallet: user.wallet,
            user_id: user.id
        }})

        socketMobile.on('connect', function() { 
          const k = ""
          console.log("socketMobile > connected");
        });
        socketMobile.on('disconnect', function() { 
          const k = ""
          console.log("socketMobile > disconnect");
        });
        socketMobile.on('error', (error) =>{
          const j = error.message
          const k = error
          console.log("socketMobile > error")
        })

        socketMobile.on("ping", () => {
          const k = ""
          console.log("socketMobile > ping")
        });

        socketMobile.on("close", (event) =>{
          const k = event;
          console.log("socketMobile > close")
        })
      });

      

    })

    req.on('error', (e) => {
      console.error(e);
    });

    req.write(payload)
    req.end
  }

  async modifyPassword(wallet, newPassword, user: User){
    if(user.wallet === wallet){
    const userToFind = await this.get_user_by_wallet(wallet)
    if(!userToFind) throw new NotFoundException('USERS_NOT_FOUND')
    return await this.resetPassword(userToFind, newPassword)
    } else throw new BadRequestException("NOT_AUTHORIZED")
}

  async resetPassword(user, password) {
    const res = await this.userModel.findByIdAndUpdate(user.id, {password: password}, { new: true, useFindAndModify: false }).exec();
    if (!res) throw new BadRequestException('USER_NOT_FOUND');
    console.log(res)
    return formatToUserDTO(res, res)
}


  async get_user_by_id(idToSearch: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: idToSearch });
    if (user != null) {
      return await this.userModel.findOne({ _id: idToSearch });
    }
  }

  async update_refresh_token(refreshToken: string, user: User) {
    const res = await this.userModel
      .findByIdAndUpdate(
        user.id,
        { $addToSet: { refreshTokens: refreshToken } },
        { new: true, useFindAndModify: false }
      )
      .exec();
    if (!res) {
      throw new NotFoundException("USER_NOT_FOUND");
    }
    return res;
  }

  async deleteRefreshToken(user: User) {
    const res = await this.userModel
      .findByIdAndUpdate(
        user.id,
        { refreshTokens: [] },
        { new: true, useFindAndModify: false }
      )
      .exec();
    if (!res) {
      throw new NotFoundException("USER_NOT_FOUND");
    }
    return formatToUserDTO(res, res);
  }

  async showUser(id: string, user: User) {
    const res = await this.userModel.findById(id);
    if (!res) {
      throw new NotFoundException("USER_NOT_FOUND");
    }
    return formatToUserDTO(res, user);
  }

  async updateUserInfos(updateUserInfoDTO: UpdateUserInfoDTO, ref: User) {
    const user = await this.userModel.findById(ref.id);
    if (!user) {
      throw new NotFoundException("USER_NOT_FOUND");
    }

    user.description = updateUserInfoDTO.description;
    if (updateUserInfoDTO.userName) {
      user.userName = updateUserInfoDTO.userName;
    }
    if (updateUserInfoDTO.picture) {
      user.picture = updateUserInfoDTO.picture;
    }
    if(updateUserInfoDTO.nicknames){
      const j = updateUserInfoDTO.nicknames
      const js = Object.entries(j).forEach(entry => {
        const [key, value] = entry;
        user.nicknames.set(key, value);
      })
       const kk = Object.keys(updateUserInfoDTO.nicknames).forEach(element => console.log(element))
    }
    const res = await user.save();
    return formatToUserDTO(res, res);
  }

  async updateFCMToken(updateFcmDTO: UpdateFcmDTO, ref: User) {
    const user = await this.userModel.findOne({wallet: ref.wallet});
    const existingToken = user.fcmTokens.find((it) => it.token === updateFcmDTO.token);
    if (!existingToken) {
      user.fcmTokens = [{
        platform: updateFcmDTO.platform,
        token: updateFcmDTO.token,
      }]
      user.fcmToken = updateFcmDTO.token;
      user.platformUpdated = updateFcmDTO.platform == FCMTokenPlatform.android ? "android" : "iOS"
    }
      
    const res = await user.save();
    return formatToUserDTO(res, res);
  }

  async updateApnToken(token: string, ref: User){
    if(ref.apnToken !== token){
      const user = await this.userModel.findOne({wallet: ref.wallet})
      if(!user) throw new BadRequestException("USER_DONT_EXISTS")
      user.apnToken = token;
      const res = await user.save()
      return formatToUserDTO(res, res)
    }
    return formatToUserDTO(ref, ref)
  }

  async deleteUser(userID: string, user: User) {
    const apiKey = "mhgk84t9jfnt"
    const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd"
    const serverClient = StreamChat.getInstance(apiKey, secret)

    if (user.id == userID || user.isAdmin) {
    
    const res = await this.userModel.findById(userID);
    if (!res) {
        throw new BadRequestException('USER_NOT_FOUND');
    }

    await this.nftModel.deleteMany({ownedBy: res})
    await this.storyModel.deleteMany({createdBy: res})
    await this.notificationModel.deleteMany({$or : [{belongTo : userID}, {idData: userID}]})
    await this.nicknamesModel.deleteMany({ownedBy : res})
    await this.inboxModel.deleteMany({$or: [{createdBy: userID}, {wallets : res.wallet}]})
    await this.callModel.deleteMany({$or: [{ownedBy: res}, {called: res}]})
    await this.followModel.deleteMany({$or: [{requester: res}, {recipient: res}]})
    await this.userModel.updateMany({$or: [{following: res}]}, {$pull: {following: userID}})
    await serverClient.deleteUsers([userID], {user: 'hard', messages: 'hard', conversations: 'hard'})
    const channels = await serverClient.queryChannels({
      type: "try",
      [`${user.id}_favorite`]: {$eq: true},
    })
    for(const channel of channels){
      await channel.updatePartial({unset : [`${user.id}_favorite`]})
    }
    const deleteUser = await this.userModel.findByIdAndRemove(userID, {
      new: true,
      useFindAndModify: false,
    });
    return deleteUser;
  } else {
    throw new BadRequestException("USER_IS_NOT_ADMIN_OR_NOT_OWNER");
  }
  }

  async banProfile(id: string, user: User) {
    const profile = await this.userModel.findOneAndRemove({ _id: id });
    if (!profile) {
      throw new NotFoundException("PROFILE_DOEST_NOT_EXIST");
    }

    return formatToUserDTO(profile, profile);
  }

  generateStreamChatToken(user: User){
    const apiKey = "mhgk84t9jfnt"
    const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd"
    const serverClient = StreamChat.getInstance(apiKey, secret)
    const token = serverClient.createToken(user.id)
    return token
  }

  async connectToGetStream(user: User){
    const apiKey = "mhgk84t9jfnt"
    const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd"
    const serverClient = StreamChat.getInstance(apiKey, secret)
    return await serverClient.connectUser({id: user.id, name: user.userName ?? user.wallet, extraData: {'userDTO' : formatToUserDTO(user, user)}}, this.generateStreamChatToken(user))
  }

  async receiveWelcomeMessage(user: User){
    const apiKey = "mhgk84t9jfnt"
    const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd"
    const serverClient = StreamChat.getInstance(apiKey, secret)
    const channel = serverClient.channel("try", {members: [user.id, "63f78a6188f7d4001f68699a"], created_by_id: "63f78a6188f7d4001f68699a", isConv: true})
    await channel.watch();
    await channel.sendMessage({text: "Welcome to SIRKL", user_id: "63f78a6188f7d4001f68699a"})
  }

  async makeUserAdmin(adminDTO : AdminUserGetStream, user: User){
    const apiKey = "mhgk84t9jfnt"
    const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd"
    const serverClient = StreamChat.getInstance(apiKey, secret)
    var channels : Channel[] = await serverClient.queryChannels({ type: 'try', id: { $eq: adminDTO.idChannel } })
    var assign = await channels[0].assignRoles([{user_id: adminDTO.userToUpdate, channel_role: adminDTO.makeAdmin ? "channel_moderator" : "channel_member"}])
  }

  async generateAgoraTokenRTC(channel: string, roleReceived: string, tokenType: string, uid: string, req){
    const appID = "13d8acd177bf4c35a0d07bdd18c8e84e"
    const appCertificate = "31d5d34b33e64c87a498b2ecbc67c4b9"
    let role;
    if (roleReceived === 'publisher') {
      role = RtcRole.PUBLISHER;
    } else if (roleReceived === 'audience') {
      role = RtcRole.SUBSCRIBER
    }

    let i = req;

    let expireTime = req.query.expiry;
    if (!expireTime || expireTime === '') {
      expireTime = 3600;
    } else {
      expireTime = parseInt(expireTime, 10);
    }
    // calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    let token;
    if (tokenType === 'userAccount') {
      token = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channel, uid, role, privilegeExpireTime);
    } else if (tokenType === 'uid') {
      token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channel, Number("uid"), role, privilegeExpireTime);
    }
    
    // return the token
    return token

  }

  async getLatestActiveUsersBetweenDates(offset, from: Date, to: Date, param, user){

    if (!user.isAdmin) {
      throw new NotAcceptableException('USER_IS_NOT_ADMIN');
  }
    
    var sort
    var find 
    if(param == 1){
      sort = {updatedAt: -1}
      find = {updatedAt:  {$gte: from,$lt: to}}
    } else if(param == 2){ 
      sort = {updatedAt: 1}
      find = {updatedAt:  {$gte: from,$lt: to}}
    } else if(param == 3) {
      sort = {updatedAt: -1}
      find = {platformCreated: "android", updatedAt: {$gte: from,$lt: to}}
    } else if(param == 4){
      find = {platformCreated: "iOS", updatedAt: {$gte: from,$lt: to}}
      sort = {updatedAt: -1}
    } else if(param == 5){
      find = {platformCreated: "Web", updatedAt: {$gte: from,$lt: to}}
      sort = {updatedAt: -1}
    } else if(param == 6) {
      sort = {createdAt: 1}
      find = {platformCreated: "android", updatedAt: {$gte: from,$lt: to}}
    } else if(param == 7){
      find = {platformCreated: "iOS", updatedAt: {$gte: from,$lt: to}}
      sort = {createdAt: 1}
    } else if(param == 8){
      find = {platformCreated: "Web", updatedAt: {$gte: from,$lt: to}}
      sort = {createdAt: 1}
    }
    const r = await this.userModel.find(find).count()
    const res = await this.userModel.find(find)
        .sort(sort)
        .skip(offset * 50)
        .limit(50).exec();
    if (!res) throw new BadRequestException('USERS_NOT_FOUND');
    return formatToUsersCountDTO(r, res, user);
}

async getLatestUsersBetweenDates(offset, user, from: Date, to: Date, param, name) {
  var sort
  var adminParam
  var res

  if (!user.isAdmin) {
    throw new NotAcceptableException('USER_IS_NOT_ADMIN');
}
  
  if(name) adminParam = {
      $or: [{userName: {$regex: name, $options: 'i'}}, {givenName: {$regex: name, $options: 'i'}}],
      createdAt:  {$gte: from,$lt: to}}
  else adminParam = {createdAt:  {$gte: from,$lt: to}}

  if(param == 0) sort = {userName: 1}
  else if(param == 1) sort = {userName: -1}
  else if(param == 2) sort = {wallet: 1}
  else if(param == 3) sort = {wallet: -1}
  else if(param == 4) sort = {createdAt: 1}
  else if(param == 5) sort = {createdAt: -1}

  res = await this.userModel.find(adminParam)
      .sort(sort)
      .skip(offset * 50)
      .limit(50).exec();

  const r = await this.userModel.find(adminParam).count()
  if (!res) {
      throw new BadRequestException('USERS_NOT_FOUND');
  }

  return formatToUsersCountDTO(r, res, user);
}

async getLatestUsersCountBetweenDates(user, from: Date, to: Date) {
  if (!user.isAdmin) {
      throw new NotAcceptableException('USER_IS_NOT_ADMIN');
  }
  const res = await this.userModel.countDocuments({
      createdAt:  {
          $gte: from,
          $lt: to
      }});

  if (!res) {
      throw new BadRequestException('USERS_NOT_FOUND');
  }
  return formatLatestUserCountDTO(from, to, res);
}

async changeUpdatedAt(wallet): Promise<User> {
  return this.userModel.findOneAndUpdate({wallet: wallet}, {updatedAt: new Date(Date.now())}, { new: true, useFindAndModify: false })
}
}
