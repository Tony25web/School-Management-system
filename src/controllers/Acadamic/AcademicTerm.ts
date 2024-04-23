import { Request, Response, NextFunction } from "express";
import { PrismaClientProvider } from "../PrismaClient";
import { AcadamicTerm as AcademicTermType } from "@prisma/client";
import { APIError } from "../../utils/APIError";
import { StatusCodes } from "http-status-codes";
const prisma = PrismaClientProvider.getPrismaClient();
export class AcademicTerm {
  //@desc   Creating a New academic Term
  //@route  POST /api/v1/academic-terms
  //@access  Private(Admin)
  static async createAcademicTerm(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { name, description,duration } = req.body as AcademicTermType;
      const academicTerm = await prisma.acadamicTerm.findFirst({
        where: { name },
      });

      if (academicTerm) {
        throw new APIError(
          "the Academic Term is already created",
          StatusCodes.BAD_REQUEST
        );
      }
      const academicTermCreated = await prisma.acadamicTerm.create({
        data: {
          name,
          description,
          duration,
          admin: {
            connect: { id: req.user.id as string },
          },
        },
        include: { admin: true },
      });
      res
        .status(StatusCodes.CREATED)
        .json({ message: "academic Term created", academicTermCreated });
    } catch (error) {
      next(error);
    }
  }

  //@desc   retrieving existing academic Terms
  //@route  Get /api/v1/academic-terms
  //@access  Private(Admin)

  static async fetchAcademicTerms(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const academicTerms = await prisma.acadamicTerm.findMany({
        where: { adminId: req.user?.id } || {},
      });

      if (!academicTerms) {
        throw new APIError(
          "there is no academic Terms created yet",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "academic Terms successfully retrieved",
        academicTerms,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   retrieving a specific existing academic Term
  //@route  Get /api/v1/academic-terms/:id
  //@access  Private(Admin)
  static async fetchAnAcademicTerm(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const academicTerm = await prisma.acadamicTerm.findFirst({
        where: { id: req.params.id },
      });

      if (!academicTerm) {
        throw new APIError(
          "there is no Academic Term with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "An Academic Term successfully retrieved",
        academicTerm,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   updating a specific existing academic Term
  //@route  PUT /api/v1/academic-terms/:id
  //@access  Private(Admin)
  static async updateAnAcademicTerm(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // check the name of the Term if it exists
      if (req.body.name) {
        const TermExists = await prisma.acadamicTerm.findFirst({
          where: { name: req.body.name },
        });
        if (TermExists) {
          throw new APIError(
            "the name of the term is already exists try another combination of characters",
            StatusCodes.BAD_REQUEST
          );
        }
      }
      const academicTerm = await prisma.acadamicTerm.update({
        where: { id: req.params.id },
        data: {
          ...req.body as AcademicTermType,
          adminId: req.user.id as string,
        },
      });
      if (!academicTerm) {
        throw new APIError(
          "could not update the Term because there is no record with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "An academic Term successfully retrieved",
        academicTerm,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }

  //@desc   Deleting a specific existing academic Term
  //@route  Delete /api/v1/academic-terms/:id
  //@access  Private(Admin)
  static async deleteAnAcademicTerm(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const academicTerm = await prisma.acadamicTerm.delete({
        where: { id: req.params.id },
      });

      if (!academicTerm) {
        throw new APIError(
          "there is no academic Term with the specified id try again",
          StatusCodes.NOT_FOUND
        );
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "An Academic Term successfully deleted" });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
}
