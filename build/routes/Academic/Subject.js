"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const Subject_1 = require("../../controllers/Acadamic/Subject");
const Authentication_1 = require("../../middlewares/Authentication");
const Subject_2 = require("../../Prisma Extensions/Subject");
const ValidateJwt_1 = require("../../middlewares/ValidateJwt");
const PrismaClient_1 = require("../../controllers/PrismaClient");
// Define a generic type for the dynamic methods attached to the model
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
// Explicitly type AcademicExtension.AcademicYear using the generic type
const subject = Subject_2.SubjectExtension.subject;
class Subject {
    router = express_1.default.Router();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(ValidateJwt_1.createValidateJwtMiddleware, (0, Authentication_1.authorizedTo)("admin"));
        this.router.route('/:programId').post(Subject_1.Subject.createSubject);
        this.router.route('/').get(Subject_1.Subject.fetchSubjects);
        this.router.route('/:id').get(Subject_1.Subject.fetchASubject);
        this.router.route('/:id').put(Subject_1.Subject.updateASubject);
        this.router.route('/:id').delete(Subject_1.Subject.deleteASubject);
    }
}
exports.router = new Subject().router;
