"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const AcademicYear_1 = require("../../controllers/Acadamic/AcademicYear");
const Authentication_1 = require("../../middlewares/Authentication");
const AcademicYear_2 = require("../../Prisma Extensions/AcademicYear");
const ValidateJwt_1 = require("../../middlewares/ValidateJwt");
const PrismaClient_1 = require("../../controllers/PrismaClient");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
// Explicitly type AcademicExtension.AcademicYear using the generic type
const academicYear = AcademicYear_2.AcademicYearExtension.acadamicYear;
class AcademicYear {
    router = express_1.default.Router();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(ValidateJwt_1.createValidateJwtMiddleware, (0, Authentication_1.authorizedTo)("admin"));
        this.router.route('/').post(AcademicYear_1.AcademicYear.createAcademicYear);
        this.router.route('/').get(AcademicYear_1.AcademicYear.fetchAcademicYears);
        this.router.route('/:id').get(AcademicYear_1.AcademicYear.fetchAnAcademicYear);
        this.router.route('/:id').put(AcademicYear_1.AcademicYear.updateAnAcademicYear);
        this.router.route('/:id').delete(AcademicYear_1.AcademicYear.deleteAnAcademicYear);
    }
}
exports.router = new AcademicYear().router;
