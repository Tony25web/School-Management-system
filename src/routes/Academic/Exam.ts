import express from "express";
import { Exam as ExamController } from "../../controllers/Acadamic/Exam";
import { authorizedTo } from "../../middlewares/Authentication";
import { createValidateJwtMiddleware } from "../../middlewares/ValidateJwt";
class Exam {
  router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(createValidateJwtMiddleware, authorizedTo("teacher"));
    this.router
      .route("/")
      .post(ExamController.createExam)
      .get(ExamController.fetchExams);
    this.router
      .route("/:id")
      .get(ExamController.fetchExam)
      .patch(ExamController.updateAnExam);
  }
}
export const router = new Exam().router;
