"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const APIError_1 = require("../utils/APIError");
const errorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    error.status = error.status || "error";
    if (process.env.NODE_ENV == "development") {
        return sendErrorForDev(error, res);
    }
    else {
        if (error.name === "JsonWebTokenError")
            error = JWTErrorHandler("JsonWebTokenError");
        if (error.name === "TokenExpiredError")
            error = JWTErrorHandler("TokenExpiredError");
        sendErrorForProduction(error, res);
    }
};
exports.errorHandler = errorHandler;
const JWTErrorHandler = (name) => {
    if (name === "JsonWebTokenError") {
        return new APIError_1.APIError("invalid token format try login again", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    else {
        return new APIError_1.APIError("token date is expired login again ", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
};
const sendErrorForDev = (error, res) => {
    return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        error: error,
        stack: error.stack, // where did the error happen
    });
};
const sendErrorForProduction = (error, res) => {
    return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    });
};
