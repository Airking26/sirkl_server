"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schema_user_1 = require("../user/schema/schema.user");
const story_schema_1 = require("./schema/story.schema");
const story_controller_1 = require("./story.controller");
const story_service_1 = require("./story.service");
let StoryModule = class StoryModule {
};
StoryModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: "Story", schema: story_schema_1.StorySchema }]), mongoose_1.MongooseModule.forFeature([{ name: 'User', schema: schema_user_1.UserSchema }])],
        providers: [story_service_1.StoryService],
        controllers: [story_controller_1.StoryController],
        exports: [story_service_1.StoryService]
    })
], StoryModule);
exports.StoryModule = StoryModule;
//# sourceMappingURL=story.module.js.map