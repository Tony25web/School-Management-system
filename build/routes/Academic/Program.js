"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const Program_1 = require("../../controllers/Acadamic/Program");
const Authentication_1 = require("../../middlewares/Authentication");
const Program_2 = require("../../Prisma Extensions/Program");
const ValidateJwt_1 = require("../../middlewares/ValidateJwt");
const PrismaClient_1 = require("../../controllers/PrismaClient");
// Define a generic type for the dynamic methods attached to the model
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
// Explicitly type AcademicExtension.AcademicYear using the generic type
const program = Program_2.ProgramExtension.program;
class Program {
    router = express_1.default.Router();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(ValidateJwt_1.createValidateJwtMiddleware, (0, Authentication_1.authorizedTo)("admin"));
        this.router.route('/').post(Program_1.Program.createProgram);
        this.router.route('/').get(Program_1.Program.fetchPrograms);
        this.router.route('/:id').get(Program_1.Program.fetchAProgram);
        this.router.route('/:id').put(Program_1.Program.updateAProgram);
        this.router.route('/:id').delete(Program_1.Program.deleteAProgram);
    }
}
exports.router = new Program().router;
