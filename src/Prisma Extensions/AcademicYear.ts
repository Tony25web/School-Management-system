import { StatusCodes } from "http-status-codes";
import { APIError } from "../utils/APIError";
import { PrismaClientProvider } from "../controllers/PrismaClient";
import {localJwtPayload } from "./Admin";
import {Request,Response,NextFunction } from "express";
import { Auth } from "../middlewares/Authentication";
const prisma = PrismaClientProvider.getPrismaClient();
export const AcademicYearExtension=prisma.$extends({
    query: {
      acadamicYear: {
        async update({ model, operation, args, query }) {
          // process the fromYear field here
          if (args.data.fromYear) {
            args.data.fromYear =new Date(args.data.fromYear as Date);
          }
          if (args.data.toYear) {
            args.data.toYear =new Date(args.data.toYear as Date);
          }
          return query(args);
        },
      },
    },
  });