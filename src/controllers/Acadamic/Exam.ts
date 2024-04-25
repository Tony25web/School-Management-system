import { APIError } from "../../utils/APIError";
import { StatusCodes } from "http-status-codes";
import { Exam as ExamType } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { PrismaClientProvider } from "../PrismaClient";
const prisma = PrismaClientProvider.getPrismaClient();
export class Exam {
  //@desc   Creating a New Exam
  //@route  POST /api/v1/exams
  //@access  Private(Teacher)
  static async createExam(req: Request, res: Response): Promise<void> {
    const {
      name,
      description,
      subjectId,
      programId,
      academicTerm,
      duration,
      examDate,
      examTime,
      examType,
      academicYear,
      classLevelId
    } = req.body as ExamType;
    // find teacher
    const teacherFound= await prisma.teacher.findFirst({where:{id:req.user.id}})
    if(!teacherFound) {
      throw new APIError(`there is no teacher found try again or signup as a teacher`,StatusCodes.NOT_FOUND)
    }
    const examExist=await prisma.exam.findFirst({where:{name}})
    if(examExist){
      throw new APIError("the exam name already exists",StatusCodes.BAD_REQUEST)
    }
    const examCreated=await prisma.exam.create({data:{
      name,
      description,
      program:{connect:{id:programId}},
      subject:{connect:{id:subjectId}},
      AcademicTerm:{connect:{id:academicTerm}},
      duration,
      examDate,
      examTime,
      examType,
      teacher:{connect:{id:req.user.id}},
      AcademicYear:{connect:{id:academicYear}},
      classLevel:{connect:{id:classLevelId}}
    }})
    if(!examCreated){
      throw new APIError("the exam couldn't be created",StatusCodes.INTERNAL_SERVER_ERROR)
    }
    res.status(StatusCodes.CREATED).json({status:'success',message:"Exam was created successfully",exam:examCreated})
  }
    //@desc   retrieve All existing Exams
  //@route  Get /api/v1/exams
  //@access  Private(Teacher)

  static async fetchExams(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const Exams = await prisma.exam.findMany({});

      if (!Exams) {
        throw new APIError(
          "there is no Exams created yet",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "Exams successfully retrieved",
        Exams,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
    //@desc   retrieve an existing Exam
  //@route  Get /api/v1/exams/:id
  //@access  Private(Teacher)

  static async fetchExam(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const Exam = await prisma.exam.findFirst({where:{id: req.params.id}});

      if (!Exam) {
        throw new APIError(
          "there is no Exam with the given details about it try again",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "Exams successfully retrieved",
        Exam,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
    //@desc   updating a specific Exam
  //@route  Patch /api/v1/exams/:id
  //@access  Private(Teacher)
  static async updateAnExam(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // check the name of the class if it exists
      if (req.body.name) {
        const exam = await prisma.exam.findFirst({
          where: { name: req.body.name },
        });
        if (exam) {
          throw new APIError(
            "the name of the exam is already exists try another combination of characters",
            StatusCodes.BAD_REQUEST
          );
        }
      }
      const exam = await prisma.exam.update({
        where: { id: req.params.id },
        data: {
          ...req.body as Partial<ExamType>,
        },
      });
      if (!exam) {
        throw new APIError(
          "could not update the exam because there is no record with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "A exam successfully retrieved",
        exam,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }

}
