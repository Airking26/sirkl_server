import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/interface/interface.user";
import { UserService } from "src/user/user.service";
import { Channel, StreamChat } from "stream-chat";
import { InboxCreationDTO } from "./dto/dto.inbox";
import { Inbox } from "./interface/interface.inbox";
import { gql, request } from 'graphql-request'
import { GraphQLResponse } from "graphql-request/build/esm/types";
import { InboxExtensionDTO } from "./dto/dto.inbox_extension";


@Injectable()
export class InboxService{
    constructor(@InjectModel("Inbox") private readonly inboxModel: Model<Inbox>, private readonly userService: UserService){}

    /*async sendMessageWithExtension(inboxExtension : InboxExtensionDTO){
      const senderID = await this.userService.returnIdBasedOnWallet(inboxExtension.sender);
      const receiverID = await this.userService.returnIdBasedOnWallet(inboxExtension.receiver);
      const apiKey = process.env.STREAM_API_KEY
      const secret = process.env.STREAM_SECRET
      const serverClient = StreamChat.getInstance(apiKey, secret)
      var channel = serverClient.channel("try", {members: [senderID, receiverID], isConv: true})
      await channel.watch()
      await channel.sendMessage({text: inboxExtension.message, user_id: senderID})
    }*/

    async createChannel(inboxCreationDTO : InboxCreationDTO, user){
        const apiKey = process.env.STREAM_API_KEY
        const secret = process.env.STREAM_SECRET
        const serverClient = StreamChat.getInstance(apiKey, secret)
        var idChannel;
        if(inboxCreationDTO.members){
            var channel : Channel
            if(!inboxCreationDTO.isConv){
              if(inboxCreationDTO.picOfGroup){
                channel = serverClient.channel("try", inboxCreationDTO.idChannel, {members: inboxCreationDTO.members, created_by_id: inboxCreationDTO.createdBy, isConv: inboxCreationDTO.isConv, nameOfGroup: inboxCreationDTO.nameOfGroup, picOfGroup: inboxCreationDTO.picOfGroup, isGroupPrivate: inboxCreationDTO.isGroupPrivate, isGroupVisible: inboxCreationDTO.isGroupVisible})
              } else channel = serverClient.channel("try", inboxCreationDTO.idChannel, {members: inboxCreationDTO.members, created_by_id: inboxCreationDTO.createdBy, isConv: inboxCreationDTO.isConv, nameOfGroup: inboxCreationDTO.nameOfGroup, isGroupPrivate: inboxCreationDTO.isGroupPrivate, isGroupVisible: inboxCreationDTO.isGroupVisible})
            } else channel = serverClient.channel("try", {members: inboxCreationDTO.members, created_by_id: inboxCreationDTO.createdBy, isConv: inboxCreationDTO.isConv})
            await channel.watch()
            if(inboxCreationDTO.message) await channel.sendMessage({text: inboxCreationDTO.message, user_id: inboxCreationDTO.createdBy})
            idChannel = channel.id;
        } 
        else{
          if(inboxCreationDTO.isGroupPaying){
            if(inboxCreationDTO.picOfGroup){
              channel = serverClient.channel("try", inboxCreationDTO.idChannel, {created_by_id: inboxCreationDTO.createdBy, isConv: false, nameOfGroup: inboxCreationDTO.nameOfGroup, picOfGroup: inboxCreationDTO.picOfGroup, isGroupPrivate: inboxCreationDTO.isGroupPrivate, isGroupVisible: inboxCreationDTO.isGroupVisible, isGroupPaying: true, price: inboxCreationDTO.price, tokenAccepted: inboxCreationDTO.tokenAccepted, idGroupBlockChain: inboxCreationDTO.idGroupBlockchain})
            } else channel = serverClient.channel("try", inboxCreationDTO.idChannel, {created_by_id: inboxCreationDTO.createdBy, isConv: false, nameOfGroup: inboxCreationDTO.nameOfGroup, isGroupPrivate: inboxCreationDTO.isGroupPrivate, isGroupVisible: inboxCreationDTO.isGroupVisible, isGroupPaying: true, price: inboxCreationDTO.price, tokenAccepted: inboxCreationDTO.tokenAccepted, idGroupBlockChain: inboxCreationDTO.idGroupBlockchain})
            await channel.watch()
            await channel.addModerators([inboxCreationDTO.createdBy])
            idChannel = channel.id;
          }  else {
            const exists = await this.inboxModel.find({wallets: inboxCreationDTO.wallets})
        if(exists.length > 0) {
            if(inboxCreationDTO.message) await this.inboxModel.findOneAndUpdate({wallets: inboxCreationDTO.wallets}, {$addToSet: {messages: inboxCreationDTO.message}}, {new: true, useFindAndModify: false})
            const channel = await serverClient.queryChannels({type: 'try', id: exists[0].idChannel}, {}, {limit: 1})
            if(inboxCreationDTO.message) await channel[0].sendMessage({text: inboxCreationDTO.message, user_id: inboxCreationDTO.createdBy})
            idChannel = channel[0].id;
        } else { 
            if(inboxCreationDTO.message) await new this.inboxModel({idChannel: inboxCreationDTO.idChannel, wallets: inboxCreationDTO.wallets, createdBy: inboxCreationDTO.createdBy, messages: [inboxCreationDTO.message]}).save()
            const channel = serverClient.channel("try", inboxCreationDTO.idChannel, {created_by_id: inboxCreationDTO.createdBy, ens: inboxCreationDTO.nameEth,  wallet: inboxCreationDTO.wallets.filter((e) => e != user.wallet)[0], isConv: true})
            await channel.watch()
            if(inboxCreationDTO.message) await channel.sendMessage({text: inboxCreationDTO.message, user_id: inboxCreationDTO.createdBy})
            idChannel = channel.id;
        
        } 
        }
      }
        return idChannel;
    }

    async updateChannel(user: User){
      const apiKey = process.env.STREAM_API_KEY
      const secret = process.env.STREAM_SECRET
        const serverClient = StreamChat.getInstance(apiKey, secret)
        const inboxs = await this.inboxModel.find({wallets: user.wallet})
        for(let item of inboxs){
            let inbox = item;
            if(inbox.createdBy !== user.id){
            const channel = await serverClient.queryChannels({type: 'try', id: inbox.idChannel}, {}, {limit: 1})
            const messages = item.messages;
            const channelToCreate = serverClient.channel("try", {members: [inbox.createdBy, user.id], created_by_id: inbox.createdBy, isConv: true})
            await channelToCreate.create()
            for(let message of messages){
                await channelToCreate.sendMessage({text: message, user_id: inbox.createdBy})
            }
            await channel[0].delete();
            await this.inboxModel.deleteOne({idChannel: inbox.idChannel})
            }
        }
    }

    async deleteChannels(){
      const apiKey = process.env.STREAM_API_KEY
      const secret = process.env.STREAM_SECRET
      const serverClient = StreamChat.getInstance(apiKey, secret)
      const channels = await serverClient.queryChannels({isGroupPaying: {$eq: true}},{},{limit: 1000});
      const size = channels.length
      //await serverClient.deleteChannels(channels.map(e => e.cid), {hard_delete: true})
    }

    async deleteInbox(id: string, user: User){
      await this.inboxModel.findOneAndDelete({idChannel : id})
    }

    getQueryENSForETHAddress(ensAddress: string) {
        return gql`
    {
      domains(first: 1, where:{name:"${ensAddress.toLowerCase()}"}) {
        name
        labelName
        owner {
          id
          domains {
            id
          }
        }
      }
    }`
      }

      getQueryETHAddressForENS(wallet: string){
        return gql`{
          domains(first: 1, where:{owner:"${wallet.toLowerCase()}"}) {
            name
          }
        }`
      }

      async queryENSforETHaddress(ensAddress: string){
        if (!ensAddress || !ensAddress.toLowerCase().includes('.eth')) return '0'
        const result: GraphQLResponse = await request(process.env.THE_GRAPH_API, this.getQueryENSForETHAddress(ensAddress))
        return result?.domains  ? result?.domains[0].owner.id.toLowerCase() : "0";
      }

      async queryEthAddressforENS(wallet: string){
        const result : GraphQLResponse = await request(process.env.THE_GRAPH_API, this.getQueryETHAddressForENS(wallet))
        return result?.domains ? result?.domains[0] != undefined ? result?.domains[0].name : "0" : "0";
      }

}