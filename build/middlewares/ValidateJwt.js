"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidateJwtMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const APIError_1 = require("../utils/APIError");
const Authentication_1 = require("./Authentication");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const PrismaClient_1 = require("../controllers/PrismaClient");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
exports.createValidateJwtMiddleware = (0, express_async_handler_1.default)(async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        throw new APIError_1.APIError("Please check if you are logged in and try again.", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    const token = authorizationHeader.split(" ")[1];
    // Check if the token is valid (no change happened, expired token)
    const decodedToken = Authentication_1.Auth.verifyJWT(token);
    // Call the reusable function to find the user based on the decoded token
    let user = await Promise.all([prisma.admin.findFirst({ where: { id: decodedToken.userId } }),
        prisma.student.findFirst({ where: { id: decodedToken.userId } }),
        prisma.teacher.findFirst({ where: { id: decodedToken.userId } })]);
    if (user.every(value => value === null)) {
        throw new APIError_1.APIError("This account does not exist anymore. Please try to sign up again.", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    let UserFound = user.filter(value => value !== null).at(0);
    console.log(UserFound);
    // Check if the user changed his password after the generation of the token
    // if (UserFound.passwordChangedAt as Date) {
    //     console.log(UserFound.passwordChangedAt as Date)
    //     const passwordChangedTimeStamp =
    //     (UserFound.passwordChangedAt as Date).getTime() / 1000;
    //     console.log(passwordChangedTimeStamp)
    //     console.log(decodedToken.iat)
    //     if (passwordChangedTimeStamp > decodedToken.iat) {
    //         throw new APIError(
    //             "The password has been changed since the last login. Please login again.",
    //             StatusCodes.UNAUTHORIZED
    //         );
    //     }
    // }
    req.user = UserFound;
    next();
});
