"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schema_user_1 = require("../user/schema/schema.user");
const nft_controller_1 = require("./nft.controller");
const nft_service_1 = require("./nft.service");
const schema_nft_1 = require("./schema/schema.nft");
let NFTModule = class NFTModule {
};
NFTModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: "NFT", schema: schema_nft_1.NFTSchema }, { name: 'User', schema: schema_user_1.UserSchema },
            ])],
        providers: [nft_service_1.NFTService],
        controllers: [nft_controller_1.NFTController],
        exports: [nft_service_1.NFTService]
    })
], NFTModule);
exports.NFTModule = NFTModule;
//# sourceMappingURL=nft.module.js.map