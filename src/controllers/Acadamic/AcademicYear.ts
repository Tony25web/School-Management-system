import { Request, Response, NextFunction } from "express";
import { PrismaClientProvider } from "../PrismaClient";
import { AcadamicYear as AcademicYearType } from "@prisma/client";
import { APIError } from "../../utils/APIError";
import { StatusCodes } from "http-status-codes";
import { AcademicYearExtension } from "../../Prisma Extensions/AcademicYear";
const prisma = PrismaClientProvider.getPrismaClient();
export class AcademicYear {
  //@desc   Creating a New academic Year
  //@route  POST /api/v1/academic-years
  //@access  Private(Admin)
  static async createAcademicYear(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { name, fromYear, toYear } = req.body as AcademicYearType;
      const academicYear = await prisma.acadamicYear.findFirst({
        where: { name },
      });

      if (academicYear) {
        throw new APIError(
          "the AcademicYear is already created",
          StatusCodes.BAD_REQUEST
        );
      }
      const academicYearCreated = await prisma.acadamicYear.create({
        data: {
          name,
          fromYear: new Date(fromYear),
          toYear: new Date(toYear),
          admin:{
            connect:{id: req.user.id}
          }
        },
        include:{admin:true}
      });
      res
        .status(StatusCodes.CREATED)
        .json({ message: "academic year created", academicYearCreated });
    } catch (error) {
      next(error);
    }
  }

  //@desc   retrieving an existing academic Years
  //@route  Get /api/v1/academic-years
  //@access  Private(Admin)

  static async fetchAcademicYears(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const academicYears = await prisma.acadamicYear.findMany({where:{createdBy: req.user?.id}||{}});

      if (!academicYears) {
        throw new APIError(
          "there is no academic years created yet",
          StatusCodes.NOT_FOUND
        );
      }
      res
        .status(StatusCodes.OK)
        .json({
          message: "academic Years successfully retrieved",
          academicYears,
        });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   retrieving a specific existing academic Year
  //@route  Get /api/v1/academic-years/:id
  //@access  Private(Admin)
  static async fetchAnAcademicYear(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const academicYear = await prisma.acadamicYear.findFirst({
        where: { id: req.params.id },
      });

      if (!academicYear) {
        throw new APIError(
          "there is no academic year with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res
        .status(StatusCodes.OK)
        .json({
          message: "An academic Year successfully retrieved",
          academicYear,
        });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   updating a specific existing academic Year
  //@route  PUT /api/v1/academic-years/:id
  //@access  Private(Admin)
  static async updateAnAcademicYear(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // check the name of the year if it exists
      if(req.body.name)
      {const yearExists=await prisma.acadamicYear.findFirst({where:{name:req.body.name}})
      if(yearExists){
        throw new APIError("the name already exists try another combination of characters",StatusCodes.BAD_REQUEST)
      }}
      const academicYear = await AcademicYearExtension.acadamicYear.update({
        where: { id: req.params.id },
        data: {  
         ...req.body,
            createdBy: req.user.id,
        },
      });
      if (!academicYear) {
        throw new APIError(
          "could not update the year because there is no record with the specified id found ",
          StatusCodes.NOT_FOUND
        );
      }
      res
        .status(StatusCodes.OK)
        .json({
          message: "An academic Year successfully retrieved",
          academicYear,
        });
    } catch (error: Error | unknown) {
      next(error);
    }
  }

  //@desc   Deleting a specific existing academic Year
  //@route  Delete /api/v1/academic-years/:id
  //@access  Private(Admin)
  static async deleteAnAcademicYear(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const academicYear = await prisma.acadamicYear.delete({
        where: { id: req.params.id },
      });

      if (!academicYear) {
        throw new APIError(
          "there is no academic year with the specified id try again",
          StatusCodes.NOT_FOUND
        );
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "An academic Year successfully deleted" });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
}
