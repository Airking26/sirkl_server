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
exports.SignalmentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const interface_user_1 = require("../user/interface/interface.user");
const user_service_1 = require("../user/user.service");
const response_profile_signalment_1 = require("./response/response.profile_signalment");
let SignalmentService = class SignalmentService {
    constructor(profileSignalmentModel, userService) {
        this.profileSignalmentModel = profileSignalmentModel;
        this.userService = userService;
    }
    async formatSignalment(signalment, user) {
        const sig = await this.profileSignalmentModel.populate(signalment, [{ path: 'createdBy' }]);
        return (0, response_profile_signalment_1.formatToProfileSignalmentDTO)(sig, user);
    }
    async signal(data, userSignaling) {
        const model = await new this.profileSignalmentModel(data).save();
        return this.formatSignalment(model, userSignaling);
    }
    async deleteSignalment(id, user) {
        if (!user.isAdmin) {
            throw new common_1.NotAcceptableException('USER_IS_NOT_ADMIN');
        }
        const signalment = await this.profileSignalmentModel.findOneAndRemove({ _id: id });
        if (!signalment) {
            throw new common_1.NotFoundException('SIGNALMENT_DOES_NOT_EXIST');
        }
        return true;
    }
    async banProfile(id, user) {
        if (!user.isAdmin) {
            throw new common_1.NotAcceptableException('USER_IS_NOT_ADMIN');
        }
        await this.profileSignalmentModel.deleteMany({ userSignaled: id });
        return this.userService.banProfile(id, user);
    }
    async showSignalments(offset, user) {
        const res = await this.profileSignalmentModel.find().sort({ createdAt: 'descending' })
            .skip(offset * 12)
            .limit(12);
        return this.formatMultipleSignalments(res, user);
    }
    async formatMultipleSignalments(signalments, user) {
        const data = [];
        for (let it in signalments) {
            const res = await this.formatSignalment(signalments[it], user);
            data.push(res);
        }
        return data;
    }
};
SignalmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('ProfileSignalment')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService])
], SignalmentService);
exports.SignalmentService = SignalmentService;
//# sourceMappingURL=signalment.service.js.map