"use strict";
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
exports.authorizedTo = exports.Auth = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const APIError_1 = require("../utils/APIError");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_status_codes_1 = require("http-status-codes");
dotenv.config();
class Auth {
    static async hash(password) {
        const salt = await bcryptjs_1.default.genSalt(12);
        const hash = await bcryptjs_1.default.hash(password, salt);
        return hash;
    }
    static generateJWT(user_id) {
        return jsonwebtoken_1.default.sign({ userId: user_id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE_TIME,
        });
    }
    static verifyJWT(password) {
        return jsonwebtoken_1.default.verify(password, (process.env.JWT_SECRET));
    }
    static async verify(enteredPassword, userPassword) {
        return await bcryptjs_1.default.compare(enteredPassword, userPassword);
    }
}
exports.Auth = Auth;
const authorizedTo = (...roles) => (0, express_async_handler_1.default)(async (req, res, next) => {
    // 1- access routes
    // 2 - access registered users (req.user.role)
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
        throw new APIError_1.APIError("you are not allowed to access this route", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    next();
});
exports.authorizedTo = authorizedTo;
