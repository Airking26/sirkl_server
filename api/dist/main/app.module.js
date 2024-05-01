"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const platform_express_1 = require("@nestjs/platform-express");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const signalment_module_1 = require("../signalment/signalment.module");
const nft_module_1 = require("../nfts/nft.module");
const search_module_1 = require("../search/search.module");
const follow_controller_1 = require("../follow/follow.controller");
const follow_module_1 = require("../follow/follow.module");
const notification_module_1 = require("../notifications/notification.module");
const call_module_1 = require("../call/call.module");
const inbox_module_1 = require("../inbox/inbox.module");
const group_module_1 = require("../group/group.module");
const story_module_1 = require("../story/story.module");
const nicknames_module_1 = require("../nicknames/nicknames.module");
const apns_module_1 = require("../apns/apns.module");
const request_module_1 = require("../requests/request.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            platform_express_1.MulterModule.register({
                dest: './uploads'
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_DB_URI, { useNewUrlParser: true, useCreateIndex: true }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            signalment_module_1.SignalmentModule,
            nft_module_1.NFTModule,
            search_module_1.SearchModule,
            follow_module_1.FollowModule,
            notification_module_1.NotificationModule,
            call_module_1.CallModule,
            inbox_module_1.InboxModule,
            group_module_1.GroupModule,
            story_module_1.StoryModule,
            nicknames_module_1.NicknamesModule,
            apns_module_1.APNsModule,
            request_module_1.JoinModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map