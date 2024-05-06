import { Request, Response, NextFunction } from "express";
import { PrismaClientProvider } from "../PrismaClient";
import { YearGroup as YearGroupType } from "@prisma/client";
import { APIError } from "../../utils/APIError";
import { StatusCodes } from "http-status-codes";
const prisma = PrismaClientProvider.getPrismaClient();
export class YearGroup{
  //@desc   Creating a New Year
  //@route  POST /api/v1/year-groups
  //@access  Private(Admin)
  static async createYearGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { name, acadamicYearId} = req.body as YearGroupType;
      const yearGroupFound =await prisma.yearGroup.findFirst({where:{name}})
      if (yearGroupFound){
        throw new APIError(
          "the year already exists",
          StatusCodes.BAD_REQUEST
        );
      }
      const YearGroupCreated = await prisma.yearGroup.create({
        data: {
          name,
          acadamicYear:{
          connect:{id:(acadamicYearId)as string}
         },
         admin:{
          connect:{id:req.user.id}
         },
        },
        include: { admin: true },
      });
      res
        .status(StatusCodes.CREATED)
        .json({ message: "The Year Group was created successfully", YearGroupCreated });
    } catch (error) {
      next(error);
    }
  }

  //@desc   retrieving existing Year Groups
  //@route  Get /api/v1/year-groups
  //@access  Private(Admin)

  static async fetchYearGroups(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const groups = await prisma.yearGroup.findMany({});

      if (!groups) {
        throw new APIError(
          "there is no Year Groups created yet",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "Year Groups successfully retrieved",
        groups,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   retrieving a specific, existing Year Group
  //@route  Get /api/v1/year-groups/:id
  //@access  Private(Admin)
  static async fetchAYearGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const group = await prisma.yearGroup.findFirst({
        where: { id: req.params.id },
      });

      if (!group) {
        throw new APIError(
          "there is no Year Group with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "A Year Group was retrieved successfully",
        group,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   updating a specific Year Group
  //@route  PUT /api/v1/year-groups/:id
  //@access  Private(Admin)
  static async updateAYearGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // check the name of the class if it exists
      if (req.body.name) {
        const groupFound = await prisma.yearGroup.findFirst({
          where: { name: req.body.name },
        });
        if (groupFound) {
          throw new APIError(
            "the name of the group is already exists try another combination of characters",
            StatusCodes.BAD_REQUEST
          );
        }
      }
      const group = await prisma.yearGroup.update({
        where: { id: req.params.id },
        data: {
          ...req.body as Partial<YearGroupType>,
          adminId: req.user.id as string,
        },
      });
      if (!group) {
        throw new APIError(
          "could not update the year group because there is no record with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res.status(StatusCodes.OK).json({
        message: "A Year Group was retrieved successfully",
        group,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }

  //@desc   Deleting a specific existing Year Group
  //@route  Delete /api/v1/year-groups/:id
  //@access  Private(Admin)
  static async deleteAYearGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const group = await prisma.yearGroup.delete({
        where: { id: req.params.id },
      });

      if (!group) {
        throw new APIError(
          "there is no Year Group with the specified id try again",
          StatusCodes.NOT_FOUND
        );
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "A Year group was successfully deleted" });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
}
