"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const interface_user_1 = require("../user/interface/interface.user");
const user_service_1 = require("../user/user.service");
const stream_chat_1 = require("stream-chat");
const graphql_request_1 = require("graphql-request");
let InboxService = class InboxService {
    constructor(inboxModel, userService) {
        this.inboxModel = inboxModel;
        this.userService = userService;
    }
    async createChannel(inboxCreationDTO, user) {
        const apiKey = "mhgk84t9jfnt";
        const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd";
        const serverClient = stream_chat_1.StreamChat.getInstance(apiKey, secret);
        var idChannel;
        if (inboxCreationDTO.members) {
            var channel;
            if (!inboxCreationDTO.isConv) {
                if (inboxCreationDTO.picOfGroup) {
                    channel = serverClient.channel("try", inboxCreationDTO.idChannel, { members: inboxCreationDTO.members, created_by_id: inboxCreationDTO.createdBy, isConv: inboxCreationDTO.isConv, nameOfGroup: inboxCreationDTO.nameOfGroup, picOfGroup: inboxCreationDTO.picOfGroup, isGroupPrivate: inboxCreationDTO.isGroupPrivate, isGroupVisible: inboxCreationDTO.isGroupVisible });
                }
                else
                    channel = serverClient.channel("try", inboxCreationDTO.idChannel, { members: inboxCreationDTO.members, created_by_id: inboxCreationDTO.createdBy, isConv: inboxCreationDTO.isConv, nameOfGroup: inboxCreationDTO.nameOfGroup, isGroupPrivate: inboxCreationDTO.isGroupPrivate, isGroupVisible: inboxCreationDTO.isGroupVisible });
            }
            else
                channel = serverClient.channel("try", { members: inboxCreationDTO.members, created_by_id: inboxCreationDTO.createdBy, isConv: inboxCreationDTO.isConv });
            await channel.watch();
            if (inboxCreationDTO.message)
                await channel.sendMessage({ text: inboxCreationDTO.message, user_id: inboxCreationDTO.createdBy });
            idChannel = channel.id;
        }
        else {
            if (inboxCreationDTO.isGroupPaying) {
                if (inboxCreationDTO.picOfGroup) {
                    channel = serverClient.channel("try", inboxCreationDTO.idChannel, { created_by_id: inboxCreationDTO.createdBy, isConv: false, nameOfGroup: inboxCreationDTO.nameOfGroup, picOfGroup: inboxCreationDTO.picOfGroup, isGroupPrivate: inboxCreationDTO.isGroupPrivate, isGroupVisible: inboxCreationDTO.isGroupVisible, isGroupPaying: true, price: inboxCreationDTO.price, tokenAccepted: inboxCreationDTO.tokenAccepted, idGroupBlockChain: inboxCreationDTO.idGroupBlockchain });
                }
                else
                    channel = serverClient.channel("try", inboxCreationDTO.idChannel, { created_by_id: inboxCreationDTO.createdBy, isConv: false, nameOfGroup: inboxCreationDTO.nameOfGroup, isGroupPrivate: inboxCreationDTO.isGroupPrivate, isGroupVisible: inboxCreationDTO.isGroupVisible, isGroupPaying: true, price: inboxCreationDTO.price, tokenAccepted: inboxCreationDTO.tokenAccepted, idGroupBlockChain: inboxCreationDTO.idGroupBlockchain });
                await channel.watch();
                await channel.addModerators([inboxCreationDTO.createdBy]);
                idChannel = channel.id;
            }
            else {
                const exists = await this.inboxModel.find({ wallets: inboxCreationDTO.wallets });
                if (exists.length > 0) {
                    if (inboxCreationDTO.message)
                        await this.inboxModel.findOneAndUpdate({ wallets: inboxCreationDTO.wallets }, { $addToSet: { messages: inboxCreationDTO.message } }, { new: true, useFindAndModify: false });
                    const channel = await serverClient.queryChannels({ type: 'try', id: exists[0].idChannel }, {}, { limit: 1 });
                    if (inboxCreationDTO.message)
                        await channel[0].sendMessage({ text: inboxCreationDTO.message, user_id: inboxCreationDTO.createdBy });
                    idChannel = channel[0].id;
                }
                else {
                    if (inboxCreationDTO.message)
                        await new this.inboxModel({ idChannel: inboxCreationDTO.idChannel, wallets: inboxCreationDTO.wallets, createdBy: inboxCreationDTO.createdBy, messages: [inboxCreationDTO.message] }).save();
                    const channel = serverClient.channel("try", inboxCreationDTO.idChannel, { created_by_id: inboxCreationDTO.createdBy, ens: inboxCreationDTO.nameEth, wallet: inboxCreationDTO.wallets.filter((e) => e != user.wallet)[0], isConv: true });
                    await channel.watch();
                    if (inboxCreationDTO.message)
                        await channel.sendMessage({ text: inboxCreationDTO.message, user_id: inboxCreationDTO.createdBy });
                    idChannel = channel.id;
                }
            }
        }
        return idChannel;
    }
    async updateChannel(user) {
        const apiKey = "mhgk84t9jfnt";
        const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd";
        const serverClient = stream_chat_1.StreamChat.getInstance(apiKey, secret);
        const inboxs = await this.inboxModel.find({ wallets: user.wallet });
        for (let item of inboxs) {
            let inbox = item;
            if (inbox.createdBy !== user.id) {
                const channel = await serverClient.queryChannels({ type: 'try', id: inbox.idChannel }, {}, { limit: 1 });
                const messages = item.messages;
                const channelToCreate = serverClient.channel("try", { members: [inbox.createdBy, user.id], created_by_id: inbox.createdBy, isConv: true });
                await channelToCreate.create();
                for (let message of messages) {
                    await channelToCreate.sendMessage({ text: message, user_id: inbox.createdBy });
                }
                await channel[0].delete();
                await this.inboxModel.deleteOne({ idChannel: inbox.idChannel });
            }
        }
    }
    async deleteChannels() {
        const apiKey = "mhgk84t9jfnt";
        const secret = "gnru55ab95pahvtrczw6sk2segwa7gyzskm3xs5pw9hfk6hpkqfwaatd64q7svbd";
        const serverClient = stream_chat_1.StreamChat.getInstance(apiKey, secret);
        const channels = await serverClient.queryChannels({ isGroupPaying: { $eq: true } }, {}, { limit: 1000 });
        const size = channels.length;
    }
    async deleteInbox(id, user) {
        await this.inboxModel.findOneAndDelete({ idChannel: id });
    }
    getQueryENSForETHAddress(ensAddress) {
        return (0, graphql_request_1.gql) `
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
    }`;
    }
    getQueryETHAddressForENS(wallet) {
        return (0, graphql_request_1.gql) `{
          domains(first: 1, where:{owner:"${wallet.toLowerCase()}"}) {
            name
          }
        }`;
    }
    async queryENSforETHaddress(ensAddress) {
        if (!ensAddress || !ensAddress.toLowerCase().includes('.eth'))
            return '0';
        const result = await (0, graphql_request_1.request)('https://api.thegraph.com/subgraphs/name/ensdomains/ens', this.getQueryENSForETHAddress(ensAddress));
        return (result === null || result === void 0 ? void 0 : result.domains) ? result === null || result === void 0 ? void 0 : result.domains[0].owner.id.toLowerCase() : "0";
    }
    async queryEthAddressforENS(wallet) {
        const result = await (0, graphql_request_1.request)('https://api.thegraph.com/subgraphs/name/ensdomains/ens', this.getQueryETHAddressForENS(wallet));
        return (result === null || result === void 0 ? void 0 : result.domains) ? (result === null || result === void 0 ? void 0 : result.domains[0]) != undefined ? result === null || result === void 0 ? void 0 : result.domains[0].name : "0" : "0";
    }
};
InboxService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)("Inbox")),
    __metadata("design:paramtypes", [mongoose_2.Model, user_service_1.UserService])
], InboxService);
exports.InboxService = InboxService;
//# sourceMappingURL=inbox.service.js.map