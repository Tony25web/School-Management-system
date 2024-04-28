import { Question as QuestionType } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { PrismaClientProvider } from "../PrismaClient";
import { APIError } from "../../utils/APIError";
import { StatusCodes } from "http-status-codes";
const prisma = PrismaClientProvider.getPrismaClient();
export class Question {
  //@desc   Creating a New Question for the Exam
  //@route  POST /api/v1/questions/:examId
  //@access  Private(Teacher)

  static async createQuestion(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const {
        questionName,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
      } = req.body as QuestionType;
      const examFound = await prisma.exam.findFirst({
        where: { id: req.params.examId },
      });
      if (!examFound) {
        throw new APIError(
          "no exam were found to add the question to,make sure you are trying to add to an existing exam",
          StatusCodes.NOT_FOUND
        );
      }
      const questionFound = await prisma.question.findFirst({
        where: { questionName },
      });
      if (questionFound) {
        throw new APIError(
          "the question already exists try another combination of characters",
          StatusCodes.BAD_REQUEST
        );
      }
      const questionCreated = await prisma.question.create({
        data: {
          questionName,
          optionA,
          optionB,
          optionC,
          optionD,
          correctAnswer,
          teacher: { connect: { id: req.user.id } },
          Exam: { connect: { id: examFound.id } },
        },
      });
      if (!questionCreated) {
        throw new APIError(
          "Error creating question please try again",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "Question was created successfully",
        questionCreated,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   Retrieving an existing questions
  //@route  GET /api/v1/questions/
  //@access  Private(Teacher)
  static async getAllQuestions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const questions = await prisma.question.findMany({});
      if (!questions) {
        throw new APIError(
          "there is no questions to fetch",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "questions were received successfully",
        questions,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   Get Single Question
  //@route GET /api/v1/questions/:questionId
  //@access  Private Teacher only
  static async getSingleQuestion(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { questionId } = req.params;
      const question = await prisma.question.findFirst({
        where: { id: questionId },
      });
      if (!question) {
        throw new APIError(
          "there is no question to fetch",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "questions were received successfully",
        question,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   updating a specific Question
  //@route  Patch /api/v1/questions/:questionId
  //@access  Private(Teacher)
  static async updateAQuestion(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const question = await prisma.question.update({
        where: { id: req.params.questionId },
        data: {
          ...(req.body as Partial<QuestionType>),
        },
      });
      if (!question) {
        throw new APIError(
          "could not update the question because there is no record with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "A question successfully retrieved",
        question,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
}
