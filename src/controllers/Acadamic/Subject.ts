import { Request, Response, NextFunction } from "express";
import { PrismaClientProvider } from "../PrismaClient";
import { Subject as SubjectType } from "@prisma/client";
import { APIError } from "../../utils/APIError";
import { StatusCodes } from "http-status-codes";
const prisma = PrismaClientProvider.getPrismaClient();
export class Subject {
  //@desc   Creating a New Subject
  //@route  POST /api/v1/subjects/:programId
  //@access  Private(Admin)
  static async createSubject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { name, description,acadamicTermId } = req.body as SubjectType;
      const programFound =await prisma.program.findFirst({where:{id:req.params.programId}})
      if (!programFound){
        throw new APIError(
          "there is no program found with the given id",
          StatusCodes.NOT_FOUND
        );
      }
      const subjectFound =await prisma.program.findFirst({where:{name}})
      console.log(subjectFound)
      if (subjectFound){
        throw new APIError(
          "the Subject already exists",
          StatusCodes.BAD_REQUEST
        );
      }
      const SubjectCreated = await prisma.subject.create({
        data: {
          name,
          description,
         acadamic:{
          connect:{id:acadamicTermId}
         },
         program:{
          connect:{id:req.params.programId}
         },
         admin:{
          connect:{id:req.user.id}
         },
        },
        include: { admin: true },
      });
      res
        .status(StatusCodes.CREATED)
        .json({ message: "The Subject was created successfully", SubjectCreated });
    } catch (error) {
      next(error);
    }
  }

  //@desc   retrieving existing Subjects
  //@route  Get /api/v1/subjects
  //@access  Private(Admin)

  static async fetchSubjects(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const Subjects = await prisma.subject.findMany({
        where: { adminId: req.user?.id } || {},
      });

      if (!Subjects) {
        throw new APIError(
          "there is no Subjects created yet",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "Subjects successfully retrieved",
        Subjects,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   retrieving a specific, existing Subject
  //@route  Get /api/v1/subjects/:id
  //@access  Private(Admin)
  static async fetchASubject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const Subject = await prisma.subject.findFirst({
        where: { id: req.params.id },
      });

      if (!Subject) {
        throw new APIError(
          "there is no Subject with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "A Program successfully retrieved",
        Subject,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   updating a specific Subject
  //@route  PUT /api/v1/subjects/:id
  //@access  Private(Admin)
  static async updateASubject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // check the name of the class if it exists
      if (req.body.name) {
        const Subject = await prisma.subject.findFirst({
          where: { name: req.body.name },
        });
        if (Subject) {
          throw new APIError(
            "the name of the Subject is already exists try another combination of characters",
            StatusCodes.BAD_REQUEST
          );
        }
      }
      const subject = await prisma.subject.update({
        where: { id: req.params.id },
        data: {
          ...req.body as Partial<SubjectType>,
          adminId: req.user.id as string,
        },
      });
      if (!subject) {
        throw new APIError(
          "could not update the subject because there is no record with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "A subject successfully retrieved",
        subject,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }

  //@desc   Deleting a specific existing subject
  //@route  Delete /api/v1/subjects/:id
  //@access  Private(Admin)
  static async deleteASubject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const subject = await prisma.subject.delete({
        where: { id: req.params.id },
      });

      if (!subject) {
        throw new APIError(
          "there is no subject with the specified id try again",
          StatusCodes.NOT_FOUND
        );
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "A subject was successfully deleted" });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
}
