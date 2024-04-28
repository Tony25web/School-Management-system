import express from "express";
import { Question as QuestionController } from "../../controllers/Acadamic/Question";
import { authorizedTo } from "../../middlewares/Authentication";
import { createValidateJwtMiddleware } from "../../middlewares/ValidateJwt";
class Question {
  router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router
      .route("/")
      .get(
        createValidateJwtMiddleware,
        authorizedTo("teacher"),
        QuestionController.getAllQuestions
      );

    this.router
      .route("/:questionId")
      .get(
        createValidateJwtMiddleware,
        authorizedTo("teacher"),
        QuestionController.getSingleQuestion
      )
      .patch(
        createValidateJwtMiddleware,
        authorizedTo("teacher"),
        QuestionController.updateAQuestion
      );

    this.router
      .route("/:examId")
      .post(
        createValidateJwtMiddleware,
        authorizedTo("teacher"),
        QuestionController.createQuestion
      );
  }
}
export const router = new Question().router;
