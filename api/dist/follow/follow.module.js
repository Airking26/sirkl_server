"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const apns_module_1 = require("../apns/apns.module");
const schema_notification_1 = require("../notifications/schema/schema.notification");
const schema_user_1 = require("../user/schema/schema.user");
const follow_controller_1 = require("./follow.controller");
const follow_service_1 = require("./follow.service");
const schema_follow_1 = require("./schema/schema.follow");
let FollowModule = class FollowModule {
};
FollowModule = __decorate([
    (0, common_1.Module)({
        imports: [
            apns_module_1.APNsModule,
            mongoose_1.MongooseModule.forFeature([
                { name: 'User', schema: schema_user_1.UserSchema },
                { name: 'Follow', schema: schema_follow_1.FollowSchema },
                { name: 'Notification', schema: schema_notification_1.NotificationSchema }
            ])
        ],
        controllers: [follow_controller_1.FollowController],
        providers: [follow_service_1.FollowService]
    })
], FollowModule);
exports.FollowModule = FollowModule;
//# sourceMappingURL=follow.module.js.map