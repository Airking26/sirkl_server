"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalmentModule = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
const user_module_1 = require("../user/user.module");
const schema_profile_signalment_1 = require("./schema/schema.profile_signalment");
const signalment_controller_1 = require("./signalment.controller");
const signalment_service_1 = require("./signalment.service");
let SignalmentModule = class SignalmentModule {
};
SignalmentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            mongoose_1.MongooseModule.forFeature([{ name: 'ProfileSignalment', schema: schema_profile_signalment_1.ProfileSignalmentSchema }])
        ],
        controllers: [signalment_controller_1.SignalmentController],
        providers: [signalment_service_1.SignalmentService]
    })
], SignalmentModule);
exports.SignalmentModule = SignalmentModule;
//# sourceMappingURL=signalment.module.js.map