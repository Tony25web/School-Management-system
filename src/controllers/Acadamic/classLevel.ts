import { Request, Response, NextFunction } from "express";
import { PrismaClientProvider } from "../PrismaClient";
import { ClassLevel as ClassLevelType } from "@prisma/client";
import { APIError } from "../../utils/APIError";
import { StatusCodes } from "http-status-codes";
const prisma = PrismaClientProvider.getPrismaClient();
export class ClassLevel {
  //@desc   Creating a New Class Level
  //@route  POST /api/v1/class-levels
  //@access  Private(Admin)
  static async createClassLevel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { name, description } = req.body as ClassLevelType;
      const classLevel =await prisma.classLevel.findFirst({where:{name}})
      if (classLevel){
        throw new APIError(
          "the class Level is already created",
          StatusCodes.BAD_REQUEST
        );
      }
      const classLevelCreated = await prisma.classLevel.create({
        data: {
          name,
          description,
          admin: {
            connect: { id: req.user.id as string },
          },
        },
        include: { admin: true },
      });
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Class Level was created successfully", classLevelCreated });
    } catch (error) {
      next(error);
    }
  }

  //@desc   retrieving existing Class Levels
  //@route  Get /api/v1/class-levels
  //@access  Private(Admin)

  static async fetchClassLevels(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const classLevels = await prisma.classLevel.findMany({
        where: { adminId: req.user?.id } || {},
      });

      if (!classLevels) {
        throw new APIError(
          "there is no Class Level created yet",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "Class Level successfully retrieved",
        classLevels,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   retrieving a specific existing academic Term
  //@route  Get /api/v1/class-levels/:id
  //@access  Private(Admin)
  static async fetchAClasslevel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const classLevel = await prisma.classLevel.findFirst({
        where: { id: req.params.id },
      });

      if (!classLevel) {
        throw new APIError(
          "there is no Class Level with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "A Class was successfully retrieved",
        classLevel,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   updating a specific existing academic Term
  //@route  PUT /api/v1/class-levels/:id
  //@access  Private(Admin)
  static async updateAClassLevel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // check the name of the class if it exists
      if (req.body.name) {
        const ClassExists = await prisma.classLevel.findFirst({
          where: { name: req.body.name },
        });
        if (ClassExists) {
          throw new APIError(
            "the name of the class is already exists try another combination of characters",
            StatusCodes.BAD_REQUEST
          );
        }
      }
      const classLevel = await prisma.classLevel.update({
        where: { id: req.params.id },
        data: {
          ...req.body as Partial<ClassLevelType>,
          adminId: req.user.id as string,
        },
      });
      if (!classLevel) {
        throw new APIError(
          "could not update the Class because there is no record with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "A Class was successfully retrieved",
        classLevel,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }

  //@desc   Deleting a specific existing academic Term
  //@route  Delete /api/v1/class-levels/:id
  //@access  Private(Admin)
  static async deleteAClassLevel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const classLevel = await prisma.classLevel.delete({
        where: { id: req.params.id },
      });

      if (!classLevel) {
        throw new APIError(
          "there is no Class with the specified id try again",
          StatusCodes.NOT_FOUND
        );
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "The Class was successfully deleted" });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
}
