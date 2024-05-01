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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const alchemy_sdk_1 = require("alchemy-sdk");
const lodash_1 = __importDefault(require("lodash"));
const mongoose_2 = require("mongoose");
const interface_user_1 = require("../user/interface/interface.user");
const response_nft_1 = require("./response/response.nft");
let NFTService = class NFTService {
    constructor(nftModel, userModel) {
        this.nftModel = nftModel;
        this.userModel = userModel;
    }
    async createMultipleCollections(data, user) {
        const res = await Promise.all(data.map(it => this.createCollection(it, user)));
        if (!res)
            throw new common_1.NotAcceptableException("ERROR_CREATING_MULTIPLE_NFT_COLLECTION");
        return res;
    }
    async createCollection(data, user) {
        const exists = await this.nftModel.findOne({ ownedBy: user, contractAddress: data.contractAddress });
        if (!exists) {
            const nft = new this.nftModel({ ownedBy: user.id, title: data.title, images: data.images, collectionImage: data.collectionImage, contractAddress: data.contractAddress, isFav: false, floorPrice: data.floorPrice });
            const res = await nft.save();
            await this.nftModel.populate(res, "ownedBy");
            return (0, response_nft_1.formatToNFTInfoDTO)(res);
        }
    }
    async retrieveNFT(user, id, offset, fav) {
        let res;
        let userToId;
        if (id === user.id)
            userToId = user;
        else
            userToId = await this.userModel.findById(id);
        if (fav)
            res = await this.nftModel.find({ ownedBy: userToId, isFav: true }).sort({ floorPrice: "descending" }).skip(offset * 12).limit(12).exec();
        else
            res = await this.nftModel.find({ ownedBy: userToId }).sort({ floorPrice: "descending" }).skip(offset * 12).limit(12).exec();
        return (0, response_nft_1.formatMultipleNftInfoDTO)(res);
    }
    async updateNFT(user) {
        var _a;
        const res = await this.nftModel.find({ ownedBy: user });
        const settings = {
            apiKey: 'ELrNU9K6I9RNfXbIkJqq6H6NeoXNbF10',
            network: alchemy_sdk_1.Network.ETH_MAINNET
        };
        var nfts = [];
        var nftsFinals = [];
        const alchemy = new alchemy_sdk_1.Alchemy(settings);
        var pageKey;
        do {
            var nftsIter = await alchemy.nft.getNftsForOwner(user.wallet, { excludeFilters: [],
                omitMetadata: false,
                orderBy: alchemy_sdk_1.NftOrdering.TRANSFERTIME, pageKey: pageKey });
            for (const nft of nftsIter.ownedNfts) {
                if (nft.title.length && nft.contract.openSea && nft.contract.openSea.collectionName && nft.contract.openSea.imageUrl && nft.tokenType != alchemy_sdk_1.NftTokenType.UNKNOWN && (nft.tokenType != alchemy_sdk_1.NftTokenType.ERC1155 ||
                    nft.tokenType == alchemy_sdk_1.NftTokenType.ERC1155 && (nft.contract.openSea.safelistRequestStatus == alchemy_sdk_1.OpenSeaSafelistRequestStatus.VERIFIED || nft.contract.openSea.safelistRequestStatus == alchemy_sdk_1.OpenSeaSafelistRequestStatus.APPROVED))) {
                    nfts.push(nft);
                }
            }
            if (nftsIter.pageKey)
                pageKey = nftsIter.pageKey;
            else
                pageKey = undefined;
        } while (pageKey);
        var groupedBy = lodash_1.default.groupBy(nfts, "contract.address");
        for (const key in groupedBy) {
            nftsFinals.push({ ownedBy: user.id, title: groupedBy[key][0].contract.openSea.collectionName, images: groupedBy[key].map(e => { var _a; return (_a = e.media[0].thumbnail) !== null && _a !== void 0 ? _a : e.media[0].gateway; }), collectionImage: groupedBy[key][0].contract.openSea.imageUrl, contractAddress: key, floorPrice: (_a = groupedBy[key][0].contract.openSea.floorPrice) !== null && _a !== void 0 ? _a : 0 });
        }
        var toUpdate = nftsFinals.filter(e => res.some(({ contractAddress, images }) => e.contractAddress == contractAddress && e.images.length != images.length));
        var toRemove = lodash_1.default.difference(res.map(e => e.contractAddress), nftsFinals.map(e => e.contractAddress));
        var toAdd = lodash_1.default.difference(nftsFinals.map(e => e.contractAddress), res.map(e => e.contractAddress));
        if (toUpdate.length > 0) {
            for (const elementToUpdate of toUpdate) {
                await this.nftModel.findOneAndUpdate({ contractAddress: elementToUpdate.contractAddress }, { images: elementToUpdate.images }, { new: true, useFindAndModify: false });
            }
        }
        if (toRemove.length > 0) {
            for (const elementToRemove of toRemove) {
                await this.nftModel.findOneAndDelete({ contractAddress: elementToRemove });
            }
        }
        if (toAdd.length > 0) {
            for (const elementToAdd of toAdd) {
                const nftToAdd = nftsFinals.filter(e => e.contractAddress === elementToAdd)[0];
                await new this.nftModel({ ownedBy: nftToAdd.ownedBy, title: nftToAdd.title, images: nftToAdd.images, collectionImage: nftToAdd.collectionImage, contractAddress: nftToAdd.contractAddress, isFav: false, floorPrice: nftToAdd.floorPrice }).save();
            }
        }
    }
    async updateNFTStatus(data, user) {
        let userToId;
        if (data.id === user.id)
            userToId = user;
        else
            userToId = await this.userModel.findById(data.id);
        const nft = await this.nftModel.findOne({ ownedBy: userToId, contractAddress: data.contractAddress });
        nft.isFav = data.isFav;
        await nft.save();
        return (0, response_nft_1.formatToNFTInfoDTO)(nft);
    }
    async getAllNFTs(user) {
        var _a;
        const settings = {
            apiKey: 'ELrNU9K6I9RNfXbIkJqq6H6NeoXNbF10',
            network: alchemy_sdk_1.Network.ETH_MAINNET
        };
        var nfts = [];
        var nftsFinals = [];
        const alchemy = new alchemy_sdk_1.Alchemy(settings);
        var pageKey;
        do {
            var nftsIter = await alchemy.nft.getNftsForOwner(user.wallet, { excludeFilters: [],
                omitMetadata: false,
                orderBy: alchemy_sdk_1.NftOrdering.TRANSFERTIME, pageKey: pageKey });
            for (const nft of nftsIter.ownedNfts) {
                if (nft.title.length && nft.contract.openSea && nft.contract.openSea.collectionName && nft.contract.openSea.imageUrl && nft.tokenType != alchemy_sdk_1.NftTokenType.UNKNOWN && (nft.tokenType != alchemy_sdk_1.NftTokenType.ERC1155 ||
                    nft.tokenType == alchemy_sdk_1.NftTokenType.ERC1155 && (nft.contract.openSea.safelistRequestStatus == alchemy_sdk_1.OpenSeaSafelistRequestStatus.VERIFIED || nft.contract.openSea.safelistRequestStatus == alchemy_sdk_1.OpenSeaSafelistRequestStatus.APPROVED))) {
                    nfts.push(nft);
                }
            }
            if (nftsIter.pageKey)
                pageKey = nftsIter.pageKey;
            else
                pageKey = undefined;
        } while (pageKey);
        var groupedBy = lodash_1.default.groupBy(nfts, "contract.address");
        for (const key in groupedBy) {
            nftsFinals.push({ ownedBy: user.id, title: groupedBy[key][0].contract.openSea.collectionName, images: groupedBy[key].map(e => { var _a; return (_a = e.media[0].thumbnail) !== null && _a !== void 0 ? _a : e.media[0].gateway; }), collectionImage: groupedBy[key][0].contract.openSea.imageUrl, contractAddress: key, floorPrice: (_a = groupedBy[key][0].contract.openSea.floorPrice) !== null && _a !== void 0 ? _a : 0, isFav: false });
        }
        await this.createMultipleCollections(nftsFinals, user);
    }
};
NFTService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('NFT')),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model, mongoose_2.Model])
], NFTService);
exports.NFTService = NFTService;
//# sourceMappingURL=nft.service.js.map