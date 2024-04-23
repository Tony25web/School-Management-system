"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const teacher_1 = require("../../controllers/staff/teacher");
const Authentication_1 = require("../../middlewares/Authentication");
const ValidateJwt_1 = require("../../middlewares/ValidateJwt");
const PrismaClient_1 = require("../../controllers/PrismaClient");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
// Explicitly type AdminExtension.admin using the generic type
// const teacher = TeacherExtension.teacher as ModelMethods<typeof TeacherExtension.teacher>;
class Teacher {
    router = express_1.default.Router();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/login", teacher_1.Teacher.loginTeacher);
        this.router.get("/profile", ValidateJwt_1.createValidateJwtMiddleware, (0, Authentication_1.authorizedTo)("teacher"), teacher_1.Teacher.getTeacherProfile);
        this.router.patch("/profile/update", ValidateJwt_1.createValidateJwtMiddleware, (0, Authentication_1.authorizedTo)("teacher"), teacher_1.Teacher.TeacherUpdateProfile);
        this.router.get("/admin", ValidateJwt_1.createValidateJwtMiddleware, (0, Authentication_1.authorizedTo)("admin"), teacher_1.Teacher.getAllTeachers);
        this.router.get("/:teacherId/admin", ValidateJwt_1.createValidateJwtMiddleware, (0, Authentication_1.authorizedTo)("admin"), teacher_1.Teacher.getSingleTeacher);
        this.router.patch("/:teacherId/admin/profile", ValidateJwt_1.createValidateJwtMiddleware, (0, Authentication_1.authorizedTo)("admin"), teacher_1.Teacher.AdminUpdateTeacherProfile);
        this.router.post("/admin/register", ValidateJwt_1.createValidateJwtMiddleware, (0, Authentication_1.authorizedTo)("admin"), teacher_1.Teacher.adminRegisterTeacher);
    }
}
exports.router = new Teacher().router;
