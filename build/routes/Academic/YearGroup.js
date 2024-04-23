"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const YearGroup_1 = require("../../controllers/Acadamic/YearGroup");
const Authentication_1 = require("../../middlewares/Authentication");
const ValidateJwt_1 = require("../../middlewares/ValidateJwt");
const PrismaClient_1 = require("../../controllers/PrismaClient");
// Define a generic type for the dynamic methods attached to the model
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
class YearGroup {
    router = express_1.default.Router();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(ValidateJwt_1.createValidateJwtMiddleware, (0, Authentication_1.authorizedTo)("admin"));
        this.router.route('/')
            .post(YearGroup_1.YearGroup.createYearGroup)
            .get(YearGroup_1.YearGroup.fetchYearGroups);
        this.router.route('/:id')
            .get(YearGroup_1.YearGroup.fetchAYearGroup)
            .put(YearGroup_1.YearGroup.updateAYearGroup)
            .delete(YearGroup_1.YearGroup.deleteAYearGroup);
    }
}
exports.router = new YearGroup().router;
