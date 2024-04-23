import express from 'express';
import { Teacher as TeacherController } from '../../controllers/staff/teacher';
import { authorizedTo } from '../../middlewares/Authentication';
import { createValidateJwtMiddleware } from '../../middlewares/ValidateJwt';
import { TeacherExtension } from '../../Prisma Extensions/Teacher';
import { PrismaClientProvider } from '../../controllers/PrismaClient';
const prisma=PrismaClientProvider.getPrismaClient()
// Define a generic type for the dynamic methods attached to the model
type ModelMethods<T> = {
  [K in keyof T]: T[K] extends (arg:any) => any ? T[K] : never;
};

// Explicitly type AdminExtension.admin using the generic type
// const teacher = TeacherExtension.teacher as ModelMethods<typeof TeacherExtension.teacher>;

class Teacher{
    router = express.Router();

  constructor() {
    this.initializeRoutes();
  }
  
  initializeRoutes() {
    this.router.post("/login",TeacherController.loginTeacher)
    this.router.get("/profile",createValidateJwtMiddleware,authorizedTo("teacher"),TeacherController.getTeacherProfile)
    this.router.patch("/profile/update",createValidateJwtMiddleware,authorizedTo("teacher"),TeacherController.TeacherUpdateProfile)
    this.router.get("/admin", createValidateJwtMiddleware,authorizedTo("admin"),TeacherController.getAllTeachers)
    this.router.get("/:teacherId/admin",createValidateJwtMiddleware,authorizedTo("admin"),TeacherController.getSingleTeacher)
    this.router.patch("/:teacherId/admin/profile",createValidateJwtMiddleware,authorizedTo("admin"),TeacherController.AdminUpdateTeacherProfile)
    this.router.post("/admin/register",createValidateJwtMiddleware,authorizedTo("admin"),TeacherController.adminRegisterTeacher)
  }
}
export const router= new Teacher().router