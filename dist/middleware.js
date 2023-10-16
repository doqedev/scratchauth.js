"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuth = exports.authUrl = void 0;
const axios_1 = __importDefault(require("axios"));
function authUrl(url, authName) {
    return (req, res, next) => {
        let redirectLocation = Buffer.from(url).toString('base64');
        let convertedAuthName = encodeURIComponent(authName);
        let authUrl = `https://auth.itinerary.eu.org/auth/?redirect=${redirectLocation}&name=${convertedAuthName}`;
        res.redirect(authUrl);
    };
}
exports.authUrl = authUrl;
function validateAuth(config) {
    const onFail = config.onFail || function (req, res, next) {
        res.status(401).json({ code: 401, message: "Unauthorized" });
    };
    return (req, res, next) => {
        if (!req.query.privateCode)
            return res.status(400).json({ code: 400, message: "Bad request (missing private code)" });
        axios_1.default.get(`https://auth.itinerary.eu.org/api/auth/verifyToken?privateCode=${req.query.privateCode}`).then((resp) => {
            if (resp.data.username === null)
                return onFail(req, res, next);
            if (config.redirectUrl && resp.data.redirect !== config.redirectUrl)
                return onFail(req, res, next);
            req.scratch = {
                redirectUrl: resp.data.redirect,
                username: resp.data.username
            };
            next();
        }).catch((err) => {
            if (!axios_1.default.isAxiosError(err))
                throw err;
            if (!err.response)
                throw err;
            if (!err.response.data.valid)
                return onFail(req, res, next);
            throw err;
        });
    };
}
exports.validateAuth = validateAuth;
