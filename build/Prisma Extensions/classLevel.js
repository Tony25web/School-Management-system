"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassLevelExtension = void 0;
const http_status_codes_1 = require("http-status-codes");
const APIError_1 = require("../utils/APIError");
const PrismaClient_1 = require("../controllers/PrismaClient");
const Authentication_1 = require("../middlewares/Authentication");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
exports.ClassLevelExtension = prisma.$extends({
    model: {
        classLevel: {
            async validateJwt(req, res, next) {
                try {
                    const authorizationHeader = req.headers['authorization'];
                    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
                        throw new APIError_1.APIError("please check if you are logged in and try again  ", http_status_codes_1.StatusCodes.UNAUTHORIZED);
                    }
                    const token = authorizationHeader.split(" ")[1];
                    // 2 - check if the token is valid(no change happened,expired token )
                    let decodedToken = Authentication_1.Auth.verifyJWT(token);
                    // 3 - check if user exists
                    const user = await prisma.admin.findFirst({ where: { id: decodedToken.id } });
                    if (!user) {
                        throw new APIError_1.APIError("this account does not exist any more try to signup again");
                    }
                    // 4- check if the user changed his password after the generation of the token
                    if (user !== null && user.passwordChangedAt) {
                        /*we have in the payload that we received from verifying our
                        token a property called (iat) it has the expiration date
                        for the token so we gonna check it against our passwordChangeAt property */
                        const passwordChangedTimeStamp = user.passwordChangedAt.getTime() / 1000;
                        if (passwordChangedTimeStamp > decodedToken.iat) {
                            throw new APIError_1.APIError("the password has been changed since the last login please login again", http_status_codes_1.StatusCodes.UNAUTHORIZED);
                        }
                    }
                    req.user = user;
                    next();
                }
                catch (error) {
                    next(error);
                }
            }
        }
    }
});
