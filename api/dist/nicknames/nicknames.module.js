"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NicknamesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const nicknames_controller_1 = require("./nicknames.controller");
const nicknames_service_1 = require("./nicknames.service");
const schema_nicknames_1 = require("./schema/schema.nicknames");
let NicknamesModule = class NicknamesModule {
};
NicknamesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: "Nicknames", schema: schema_nicknames_1.NicknamesSchema }])],
        providers: [nicknames_service_1.NicknamesService],
        controllers: [nicknames_controller_1.NicknamesController],
        exports: [nicknames_service_1.NicknamesService]
    })
], NicknamesModule);
exports.NicknamesModule = NicknamesModule;
//# sourceMappingURL=nicknames.module.js.map