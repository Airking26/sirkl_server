"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const apns_module_1 = require("../apns/apns.module");
const schema_notification_1 = require("../notifications/schema/schema.notification");
const schema_user_1 = require("../user/schema/schema.user");
const request_controller_1 = require("./request.controller");
const request_service_1 = require("./request.service");
const schema_request_1 = require("./schema/schema.request");
let JoinModule = class JoinModule {
};
JoinModule = __decorate([
    (0, common_1.Module)({
        imports: [
            apns_module_1.APNsModule,
            mongoose_1.MongooseModule.forFeature([
                { name: 'Join', schema: schema_request_1.JoinSchema },
                { name: 'User', schema: schema_user_1.UserSchema },
                { name: 'Notification', schema: schema_notification_1.NotificationSchema }
            ])
        ],
        controllers: [request_controller_1.JoinController],
        providers: [request_service_1.JoinService]
    })
], JoinModule);
exports.JoinModule = JoinModule;
//# sourceMappingURL=request.module.js.map