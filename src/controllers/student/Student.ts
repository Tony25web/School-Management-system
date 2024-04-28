import { Student as StudentType } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { PrismaClientProvider } from "../PrismaClient";
import { APIError } from "../../utils/APIError";
import { StatusCodes } from "http-status-codes";
import { Auth } from "../../middlewares/Authentication";
import { StudentExtension } from "../../Prisma Extensions/Student";
import { exclude } from "../../utils/Exclude";
const prisma = PrismaClientProvider.getPrismaClient();
interface studentPayload {
  name?: string;
  email?: string;
  password?: string;
}
//@desc   Admin Register a new Student
//@route  POST /api/v1/students/admin/register
//@access  Private
export class Student {
  static async adminRegisterStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, email, password } = req.body as Required<studentPayload>;
      const student = await prisma.student.findFirst({ where: { name } });
      if (student) {
        throw new APIError(
          "student already exists try another input combination",
          StatusCodes.BAD_REQUEST
        );
      }
      const hashedPassword = await Auth.hash(password);
      const studentCreated = await StudentExtension.student.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "student created successfully",
        data: studentCreated,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   login an existing student
  //@route  POST /api/v1/students/login
  //@access  Public
  static async loginStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as Required<
        Omit<studentPayload, "name">
      >;
      const student = await prisma.student.findFirst({ where: { email } });

      if (!student) {
        throw new APIError(`student were not found`, StatusCodes.NOT_FOUND);
      }
      const passwordMatched = await Auth.verify(password, student?.password);
      if (!passwordMatched) {
        throw new APIError(`password is invalid`, StatusCodes.BAD_REQUEST);
      }

      const token = Auth.generateJWT(student.id);
      return res.status(StatusCodes.OK).json({
        status: "success",
        message: "logged-in successfully",
        token,
      });
    } catch (error) {
      next(error);
    }
  }
  //@desc   Get Student's Profile
  //@route GET /api/v1/students/profile
  //@access  Private Student only
  static async getStudentProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const student = await prisma.student.findFirst({
        where: { id: req.user?.id },
      });
      if (!student) {
        throw new APIError(
          "there is no student profile to fetch",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "students were received successfully",
        student: exclude(student, [
          "password",
          "createdAt",
          "updatedAt",
          "passwordChangedAt",
        ]),
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }

  //@desc   Get All Students
  //@route GET /api/v1/students/admin
  //@access  Private Admin only
  static async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await prisma.student.findMany({});
      if (!students) {
        throw new APIError(
          "there is no students to fetch",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "students were received successfully",
        students,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   Get Single Student
  //@route GET /api/v1/students/:studentId/admin
  //@access  Private Admin only
  static async getSingleStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { studentId } = req.params;
      const student = await prisma.student.findFirst({
        where: { id: studentId },
      });
      if (!student) {
        throw new APIError(
          "there is no student to fetch",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "students were received successfully",
        student,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }

  //@desc   Update Student's Profile
  //@route PATCH /api/v1/students/profile/update
  //@access  Private Student only
  static async StudentUpdateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const student = await prisma.student.findFirst({
        where: { id: req.user.id },
      });

      if (!student) {
        throw new APIError(
          "there is no student with this email",
          StatusCodes.NOT_FOUND
        );
      }
      const updatedStudent = await prisma.student.update({
        where: { id: req.user.id },
        data: { ...req.body },
      });
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "student updated successfully",
        updatedStudent,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc  Admin updating Students eg:assigning classes,etc...
  //@route PATCH /api/v1/students/:studentId/update/admin
  //@access  Private Admin only
  static async adminUpdateStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        classLevelId,
        AcadamicYearId,
        programId,
        name,
        email,
        perfectName,
      } = req.body as StudentType;
      //find student by the id
      const student = await prisma.student.findFirst({
        where: { id: req.params.studentId },
      });
      if (!student) {
        throw new APIError("student not found", StatusCodes.NOT_FOUND);
      }
      const updatedStudent = await prisma.student.update({
        where: { id: req.params.studentId },
        data: {
          AcadamicYear: AcadamicYearId
            ? { connect: { id: AcadamicYearId } }
            : undefined,
          classLevel: classLevelId
            ? { connect: { id: classLevelId } }
            : undefined,
          program: programId ? { connect: { id: programId } } : undefined,
          name: name ? name : undefined,
          email: email ? email : undefined,
          perfectName: perfectName ? perfectName : undefined,
        },
      });
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "student updated successfully",
        updatedStudent,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc Student taking Exams
  //@route POST /api/v1/students/exams/:examId/write
  //@access  Private Student only
  static async WriteExam(req: Request, res: Response, next: NextFunction) {
    try {
      //retrieve the student who wants to write the answers for the questions
      const studentFound = await prisma.student.findFirst({
        where: { id: req.user.id },
      });
      if (!studentFound) {
        throw new APIError("student not found", StatusCodes.NOT_FOUND);
      }
      // retrieve the exam that the student wants to take
      const examFound = await prisma.exam.findFirst({
        where: { id: req.params.examId },
        include: { questions: true },
      });
      if (!examFound) {
        throw new APIError("exam not found", StatusCodes.NOT_FOUND);
      }
      // retrieve the questions
      const questions = examFound?.questions;
      // retrieve the answers of the student
      const answers = req.body.answers as string[];
      if (answers.length !== questions.length) {
        throw new APIError(
          "you didn't answer all of the required questions in the exam,please answer all the questions",
          StatusCodes.BAD_REQUEST
        );
      }
      // Build report Object
      let correctAnswers = 0,
        wrongAnswers = 0,
        totalQuestions = 0,
        grade = 0,
        score = 0,
        answeredQuestions = [] as Array<{name:string,correctAnswer:string,isCorrect:boolean}>;

      //  check for answers
      for (let i = 0; i < questions.length; i++) {
        //find the question
        const question = questions[i];
        //check if the answer is correct
        if (question.correctAnswer === answers[i]) {
          correctAnswers++;
          score++;
          question.isCorrect = true;
        } else {
          wrongAnswers++;
        }
        //calculate reports
        totalQuestions = questions.length;
        grade = (correctAnswers / totalQuestions) * 100;
        answeredQuestions = questions.map((question) => {
          return {
            name: question.questionName,
            correctAnswer: question.correctAnswer,
            isCorrect: question.isCorrect,
          };
        });
      }
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "student updated successfully",
        Result: {
          correctAnswers,
          wrongAnswers,
          score,
          totalQuestions,
          grade,
          answeredQuestions,
        },
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
}
