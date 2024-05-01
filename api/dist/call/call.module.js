"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallModule = void 0;
const common_1 = require("@nestjs/common");
const call_controller_1 = require("./call.controller");
const call_service_1 = require("./call.service");
const mongoose_1 = require("@nestjs/mongoose");
const schema_call_1 = require("./schema/schema.call");
const schema_notification_1 = require("../notifications/schema/schema.notification");
const schema_user_1 = require("../user/schema/schema.user");
const apns_module_1 = require("../apns/apns.module");
const schema_nicknames_1 = require("../nicknames/schema/schema.nicknames");
let CallModule = class CallModule {
};
CallModule = __decorate([
    (0, common_1.Module)({
        imports: [apns_module_1.APNsModule, mongoose_1.MongooseModule.forFeature([{ name: "Call", schema: schema_call_1.CallSchema }, { name: 'User', schema: schema_user_1.UserSchema }, { name: 'Notification', schema: schema_notification_1.NotificationSchema }, { name: "Nicknames", schema: schema_nicknames_1.NicknamesSchema }])],
        controllers: [call_controller_1.CallController],
        providers: [call_service_1.CallService]
    })
], CallModule);
exports.CallModule = CallModule;
//# sourceMappingURL=call.module.js.map