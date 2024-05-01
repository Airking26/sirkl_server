"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const apns_module_1 = require("../apns/apns.module");
const schema_call_1 = require("../call/schema/schema.call");
const schema_follow_1 = require("../follow/schema/schema.follow");
const schema_inbox_1 = require("../inbox/schema/schema.inbox");
const schema_nft_1 = require("../nfts/schema/schema.nft");
const schema_nicknames_1 = require("../nicknames/schema/schema.nicknames");
const schema_notification_1 = require("../notifications/schema/schema.notification");
const story_schema_1 = require("../story/schema/story.schema");
const schema_user_1 = require("./schema/schema.user");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const follow_module_1 = require("../follow/follow.module");
const follow_service_1 = require("../follow/follow.service");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'User', schema: schema_user_1.UserSchema },
                { name: 'Follow', schema: schema_follow_1.FollowSchema },
                { name: 'Call', schema: schema_call_1.CallSchema },
                { name: "Inbox", schema: schema_inbox_1.InboxSchema },
                { name: "Nicknames", schema: schema_nicknames_1.NicknamesSchema },
                { name: "Notification", schema: schema_notification_1.NotificationSchema },
                { name: 'Story', schema: story_schema_1.StorySchema },
                { name: 'NFT', schema: schema_nft_1.NFTSchema }
            ]),
            apns_module_1.APNsModule
        ],
        providers: [user_service_1.UserService, follow_service_1.FollowService],
        controllers: [user_controller_1.UserController],
        exports: [user_service_1.UserService]
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map