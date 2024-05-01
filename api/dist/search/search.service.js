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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const interface_user_1 = require("../user/interface/interface.user");
const response_user_1 = require("../user/response/response.user");
let SearchService = class SearchService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async showMatchingUser(substring, offset, user) {
        var l = user.isAdmin ? 50 : 12;
        const users = await this.userModel.find({ $or: [
                { userName: { $regex: substring.replace(' ', ''), $options: 'i' } },
                { userName: { $regex: substring, $options: 'i' } },
                { wallet: { $regex: substring.replace(' ', ''), $options: 'i' } },
                { wallet: { $regex: substring, $options: 'i' } },
            ] })
            .sort({ "wallet": -1 })
            .skip(offset * l).limit(l);
        return (0, response_user_1.formatMultipleUsersDTO)(users, user);
    }
};
SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)("User")),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map