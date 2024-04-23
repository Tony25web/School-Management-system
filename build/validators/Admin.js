"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdminRegistration = void 0;
const zod_1 = require("zod");
const http_status_codes_1 = require("http-status-codes");
const APIError_1 = require("../utils/APIError");
const AdminSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    password: zod_1.z.string(),
});
const checkAdminRegistration = (req, res, next) => {
    const check = AdminSchema.safeParse(req.body);
    if (check.success) {
        return next();
    }
    throw new APIError_1.APIError("there is a missing fields within the input , provide them in full", http_status_codes_1.StatusCodes.BAD_REQUEST);
};
exports.checkAdminRegistration = checkAdminRegistration;
