"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const AcademicTerm_1 = require("../../controllers/Acadamic/AcademicTerm");
const Authentication_1 = require("../../middlewares/Authentication");
const AcademicTerm_2 = require("../../Prisma Extensions/AcademicTerm");
const ValidateJwt_1 = require("../../middlewares/ValidateJwt");
const PrismaClient_1 = require("../../controllers/PrismaClient");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
// Explicitly type AcademicExtension.AcademicTerm using the generic type
const academicTerm = AcademicTerm_2.AcademicTermExtension.acadamicTerm;
class AcademicTerm {
    router = express_1.default.Router();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(ValidateJwt_1.createValidateJwtMiddleware, (0, Authentication_1.authorizedTo)("admin"));
        this.router.route('/').post(AcademicTerm_1.AcademicTerm.createAcademicTerm);
        this.router.route('/').get(AcademicTerm_1.AcademicTerm.fetchAcademicTerms);
        this.router.route('/:id').get(AcademicTerm_1.AcademicTerm.fetchAnAcademicTerm);
        this.router.route('/:id').put(AcademicTerm_1.AcademicTerm.updateAnAcademicTerm);
        this.router.route('/:id').delete(AcademicTerm_1.AcademicTerm.deleteAnAcademicTerm);
    }
}
exports.router = new AcademicTerm().router;
