import { Request, Response, NextFunction } from "express";
import { PrismaClientProvider } from "../PrismaClient";
import { Program as ProgramType } from "@prisma/client";
import { APIError } from "../../utils/APIError";
import { StatusCodes } from "http-status-codes";
import { ProgramExtension } from "../../Prisma Extensions/Program";
const prisma = PrismaClientProvider.getPrismaClient();
export class Program {
  //@desc   Creating a New Program
  //@route  POST /api/v1/programs
  //@access  Private(Admin)
  static async createProgram(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { name, description } = req.body as ProgramType;
      const programExists =await prisma.program.findFirst({where:{name}})
      if (programExists){
        throw new APIError(
          "the Program is already created",
          StatusCodes.BAD_REQUEST
        );
      }
      const programCreated = await ProgramExtension.program.create({
        data: {
          name,
          description,
          adminId: {
            connect: { id: req.user.id as string },
          },
        },
        include: { adminId: true },
      });
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Program created successfully", programCreated });
    } catch (error) {
      next(error);
    }
  }

  //@desc   retrieving existing Programs
  //@route  Get /api/v1/programs
  //@access  Private(Admin)

  static async fetchPrograms(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const subjects=!!req.query.subjects;// parsing the incoming query string parameter into boolean using !!
      const Programs = await prisma.program.findMany({
        where: { createdBy: req.user?.id } || {},include:{Subjects:subjects}
      });

      if (!Programs) {
        throw new APIError(
          "there is no Programs created yet",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "The Subjects was  successfully retrieved",
        Programs,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   retrieving a specific, existing Program
  //@route  Get /api/v1/programs/:id
  //@access  Private(Admin)
  static async fetchAProgram(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const program = await prisma.program.findFirst({
        where: { id: req.params.id },
      });

      if (!program) {
        throw new APIError(
          "there is no Program with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "A Program successfully retrieved",
        program,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   updating a specific Program
  //@route  PUT /api/v1/programs/:id
  //@access  Private(Admin)
  static async updateAProgram(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // check the name of the class if it exists
      if (req.body.name) {
        const Program = await prisma.program.findFirst({
          where: { name: req.body.name },
        });
        if (Program) {
          throw new APIError(
            "the name of the Program is already exists try another combination of characters",
            StatusCodes.BAD_REQUEST
          );
        }
      }
      const program = await prisma.program.update({
        where: { id: req.params.id },
        data: {
          ...req.body as Partial<ProgramType>,
          createdBy: req.user.id as string,
        },
      });
      if (!program) {
        throw new APIError(
          "could not update the Program because there is no record with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "A Program successfully retrieved",
        program,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }

  //@desc   Deleting a specific existing Program
  //@route  Delete /api/v1/programs/:id
  //@access  Private(Admin)
  static async deleteAProgram(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const program = await prisma.program.delete({
        where: { id: req.params.id },
      });

      if (!program) {
        throw new APIError(
          "there is no program with the specified id try again",
          StatusCodes.NOT_FOUND
        );
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "A Program was successfully deleted" });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
}
