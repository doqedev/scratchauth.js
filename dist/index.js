"use strict";
/// <reference path="./customTypes.d.ts" />
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = exports.validateAuthToken = exports.makeAuthUrl = void 0;
const buffer_1 = require("buffer");
const axios_1 = __importDefault(require("axios"));
function makeAuthUrl(url, authName) {
    let redirectLocation = buffer_1.Buffer.from(url).toString('base64');
    let convertedAuthName = encodeURIComponent(authName);
    let authUrl = `https://auth.itinerary.eu.org/auth/?redirect=${redirectLocation}&name=${convertedAuthName}`;
    return authUrl;
}
exports.makeAuthUrl = makeAuthUrl;
async function validateAuthToken(privateCode) {
    return new Promise((res, rej) => {
        axios_1.default.get(`https://auth.itinerary.eu.org/api/auth/verifyToken?privateCode=${privateCode}`).then((resp) => {
            res(resp.data);
        }).catch((err) => {
            if (!axios_1.default.isAxiosError(err))
                return rej(err);
            if (!err.response)
                return rej(err);
            if (!err.response.data.valid)
                return res({
                    valid: false,
                    username: null,
                    redirect: null
                });
            rej(err);
        });
    });
}
exports.validateAuthToken = validateAuthToken;
exports.middleware = __importStar(require("./middleware"));
