import express from "express";
import { Student as StudentController } from "../../controllers/student/Student";
import { authorizedTo } from "../../middlewares/Authentication";
import { createValidateJwtMiddleware } from "../../middlewares/ValidateJwt";

class Student {
  router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/admin/register",
      createValidateJwtMiddleware,
      authorizedTo("admin"),
      StudentController.adminRegisterStudent
    );
    this.router.get(
      "/admin",
      createValidateJwtMiddleware,
      authorizedTo("admin"),
      StudentController.getAllStudents
    );
    this.router.get(
      "/:studentId/admin",
      createValidateJwtMiddleware,
      authorizedTo("admin"),
      StudentController.getAllStudents
    );
    this.router.post("/login", StudentController.loginStudent);
    this.router.patch(
      "/:studentId/update/admin",
      createValidateJwtMiddleware,
      authorizedTo("admin"),
      StudentController.adminUpdateStudent
    );
    this.router.get(
      "/profile",
      createValidateJwtMiddleware,
      authorizedTo("student"),
      StudentController.getStudentProfile
    );
    this.router.post(
      "/exams/:examId/write",
      createValidateJwtMiddleware,
      authorizedTo("student"),
      StudentController.WriteExam
    );
    this.router.patch(
      "/profile/update",
      createValidateJwtMiddleware,
      authorizedTo("student"),
      StudentController.StudentUpdateProfile
    );
  }
}
export const router = new Student().router;
