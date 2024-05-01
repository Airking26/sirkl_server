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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const interface_user_1 = require("../user/interface/interface.user");
const user_service_1 = require("../user/user.service");
const response_sign_in_1 = require("./response/response.sign_in");
const web3_1 = __importDefault(require("web3"));
const graphql_request_1 = require("graphql-request");
const abi_json_1 = __importDefault(require("../contract/abi.json"));
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async verifySignature(walletConnectDTO) {
        var private_key = process.env.PRIVATE_KEY;
        var contractAddress = "0x944a7A6833074122E9c2a7A5882392224C345807";
        var wallet_to_send = walletConnectDTO.wallet;
        const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider("https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague"));
        const accountRecovered = web3.eth.accounts.recover(walletConnectDTO.message, walletConnectDTO.signature);
        if (walletConnectDTO.wallet.toLowerCase() == accountRecovered.toLowerCase()) {
            const user = await this.userService.get_user_by_wallet(walletConnectDTO.wallet);
            if (!user) {
                try {
                    const ownerAccount = web3.eth.accounts.privateKeyToAccount(private_key);
                    web3.eth.accounts.wallet.add(ownerAccount);
                    const contract = new web3.eth.Contract(abi_json_1.default, contractAddress);
                    const functionData = await contract.methods.whitelist(wallet_to_send).encodeABI();
                    const txObject = {
                        from: ownerAccount.address,
                        to: contractAddress,
                        gas: 100000,
                        data: functionData,
                    };
                    web3.eth.sendTransaction(txObject);
                }
                catch (error) {
                    var y = error;
                }
                const ens = await this.queryEthAddressforENS(walletConnectDTO.wallet);
                const user = await this.userService.createUserWithWallet(walletConnectDTO.wallet, ens, walletConnectDTO.platform);
                const accessToken = await this.generate_jwt_token(user.wallet);
                const refreshToken = await this.generate_refresh_token(user.wallet);
                const res = await this.userService.update_refresh_token(refreshToken, user);
                return (0, response_sign_in_1.formatToSignInSuccessDTO)(accessToken, refreshToken, res);
            }
            else {
                const accessToken = await this.generate_jwt_token(user.wallet);
                const refreshToken = await this.generate_refresh_token(user.wallet);
                const res = await this.userService.update_refresh_token(refreshToken, user);
                return (0, response_sign_in_1.formatToSignInSuccessDTO)(accessToken, refreshToken, res);
            }
        }
    }
    async createUAW() {
        var private_key = process.env.PRIVATE_KEY;
        var contractAddress = "0x944a7A6833074122E9c2a7A5882392224C345807";
        const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider("https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague"));
        for (let i = 0; i <= 2; i++) {
            try {
                await this.waitRandomSeconds(3, 15);
                const newWallet = web3.eth.accounts.create();
                await this.userService.createUserWithWallet(newWallet.address, undefined, "android");
                const ownerAccount = web3.eth.accounts.privateKeyToAccount(private_key);
                web3.eth.accounts.wallet.add(ownerAccount);
                const contract = new web3.eth.Contract(abi_json_1.default, contractAddress);
                const functionData = await contract.methods.whitelist(newWallet.address).encodeABI();
                const txObject = {
                    from: ownerAccount.address,
                    to: contractAddress,
                    gas: 100000,
                    data: functionData,
                };
                await web3.eth.sendTransaction(txObject);
                try {
                    web3.eth.accounts.wallet.add(newWallet);
                    const mint = await contract.methods.mint().encodeABI();
                    const txObject = {
                        from: newWallet.address,
                        to: contractAddress,
                        gas: 100000,
                        mint
                    };
                    await web3.eth.sendTransaction(txObject);
                }
                catch (error) {
                    var y = error;
                }
            }
            catch (error) {
                var y = error;
            }
        }
    }
    waitRandomSeconds(minSeconds, maxSeconds) {
        const min = Math.ceil(minSeconds);
        const max = Math.floor(maxSeconds);
        const timeToWait = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, timeToWait);
        });
    }
    async queryEthAddressforENS(wallet) {
        var _a;
        let result = await (0, graphql_request_1.request)('https://api.thegraph.com/subgraphs/name/ensdomains/ens', this.getQueryETHAddressForENS(wallet));
        return (result === null || result === void 0 ? void 0 : result.domains) ? (_a = result === null || result === void 0 ? void 0 : result.domains[0]) === null || _a === void 0 ? void 0 : _a.name : "0";
    }
    getQueryETHAddressForENS(wallet) {
        return (0, graphql_request_1.gql) `{
          domains(first: 1, where:{owner:"${wallet.toLowerCase()}"}) {
            name
          }
        }`;
    }
    async createWalletOnTheFly() {
        const web3 = new web3_1.default(web3_1.default.givenProvider);
        console.log("");
    }
    async validateUser(payload) {
        return await this.userService.get_user_by_wallet(payload.wallet);
    }
    async isUserExists(wallet) {
        const user = await this.userService.get_user_by_wallet(wallet);
        return !user;
    }
    static compareHash(password, hash) {
        return password === hash;
    }
    async signUserOut(user) {
        return this.userService.deleteRefreshToken(user);
    }
    async generate_jwt_token(wallet) {
        const payload = { wallet };
        return this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION, secret: process.env.JWT_AUTH_KEY });
    }
    async generate_refresh_token(wallet) {
        const payload = { wallet };
        return this.jwtService.sign(payload, { expiresIn: process.env.JWT_REFRESH, secret: process.env.JWT_REFRESH_KEY });
    }
    async handleRefreshToken(user) {
        await this.userService.changeUpdatedAt(user.wallet);
        const accessToken = await this.generate_jwt_token(user.wallet);
        return (0, response_sign_in_1.formatToRefreshTokenDTO)(accessToken);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map