"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIError = void 0;
// @desc this class is to handle operational errors (error that can be predicated)
class APIError extends Error {
    message;
    statusCode;
    status;
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode || 400;
        this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    }
}
exports.APIError = APIError;
