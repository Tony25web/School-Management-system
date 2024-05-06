import {
  ExamResultStatus,
  Remarks,
  Student as StudentType,
} from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { PrismaClientProvider } from "../PrismaClient";
import { APIError } from "../../utils/APIError";
import { StatusCodes } from "http-status-codes";
import { Auth } from "../../middlewares/Authentication";
import { StudentExtension } from "../../Prisma Extensions/Student";
import { exclude } from "../../utils/Exclude";
const prisma = PrismaClientProvider.getPrismaClient();
const CLASS_LEVEL_DIFFERENCE=100;
const CLASS_LEVEL_LIMIT=400
type queryString = {
  classLevel?: boolean;
  AcadamicYear?: boolean;
  program?: boolean;
};
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
  static async getAllStudents(
    req: Request<{}, {}, {}, queryString>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { AcadamicYear, classLevel, program } = req.query;
      console.log(typeof AcadamicYear);
      const students = await prisma.student.findMany({
        include: {
          AcadamicYear: !!AcadamicYear,
          classLevel: !!classLevel,
          program: !!program,
        },
      });
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
      const updatedStudent = await StudentExtension.student.update({
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
        include: { questions: true, AcademicTerm: true },
      });
      if (!examFound) {
        throw new APIError("exam not found", StatusCodes.NOT_FOUND);
      }
      //check if the student already has taken the exam
      const studentFoundInExamResult = await prisma.examResults.findFirst({
        where: { studentId: studentFound.id },
      });
      if (studentFoundInExamResult) {
        throw new APIError(
          "student has already taken this exam",
          StatusCodes.BAD_REQUEST
        );
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
        totalQuestions,
        grade = 0,
        score = 0,
        answeredQuestions = [] as Array<{
          name: string;
          correctAnswer: string;
          isCorrect: boolean;
        }>,
        status: ExamResultStatus | undefined,
        remarks: Remarks | undefined;

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
      // status of the student
      status = grade > 50 ? ExamResultStatus.passed : ExamResultStatus.failed;
      //Remarks
      if (grade >= 80) {
        remarks = Remarks.Excellent;
      } else if (grade >= 70) {
        remarks = Remarks.Excellent;
      } else if (grade >= 60) {
        remarks = Remarks.good;
      } else if (grade >= 50) {
        remarks = Remarks.fair;
      } else {
        remarks = Remarks.poor;
      }
      await prisma.examResults.create({
        data: {
          Student: { connect: { id: req.user.id } },
          exam: { connect: { id: examFound.id } },
          subject: { connect: { id: examFound.subjectId } },
          acadamicYear: { connect: { id: examFound.academicYear as string } },
          classLevel: { connect: { id: examFound.classLevelId as string } },
          academicTerm: { connect: { id: examFound.academicTerm as string } },
          grade,
          score,
          status,
          remarks,
        },
      });
      //promoting student
  
      let newlyUpdatedStudent;
      if (
        examFound.AcademicTerm?.name === "3rd Term" &&
        status === ExamResultStatus.passed
      ) {
        //check if the student is in the last level in order to change his status to graduated
        if(studentFound.currentClassLevel===CLASS_LEVEL_LIMIT){
          const yearGraduated=new Date().toISOString()
          newlyUpdatedStudent=await prisma.student.update({where:{id:studentFound.id},data:{isGraduated:true,yearGraduated}})
        }
        //promote student to the next level
        let newStudentClassLevel = await prisma.classLevel.findFirst({
          where: {
            name:studentFound.currentClassLevel+CLASS_LEVEL_DIFFERENCE,
            
          },
        });
        if (newStudentClassLevel) {
          newlyUpdatedStudent = await prisma.student.update({
            where: { id: studentFound.id },
            data: {
              currentClassLevel: newStudentClassLevel?.name,
              classLevel: { connect: { id: newStudentClassLevel.id } },
            },
          });
        }
      }
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "you have successfully submitted the exam ,check later for the results",
      
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
}
