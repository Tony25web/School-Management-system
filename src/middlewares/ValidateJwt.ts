import { StatusCodes } from "http-status-codes";
import { APIError } from "../utils/APIError";
import { Auth } from "./Authentication";
import {Request,Response,NextFunction} from "express"
import { localJwtPayload } from "../Prisma Extensions/Admin";
import { Student,Admin,Teacher } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import { PrismaClientProvider } from "../controllers/PrismaClient";
const prisma=PrismaClientProvider.getPrismaClient();
export const createValidateJwtMiddleware =expressAsyncHandler(async (req: Request, res: Response, next: NextFunction)=> {
        const authorizationHeader = req.headers.authorization as string;
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            throw new APIError(
                "Please check if you are logged in and try again.",
                StatusCodes.UNAUTHORIZED
            );
        }
        const token = authorizationHeader.split(" ")[1];
        // Check if the token is valid (no change happened, expired token)
        const decodedToken = Auth.verifyJWT(token) as localJwtPayload;
      // Call the reusable function to find the user based on the decoded token
        let user=await Promise.all(
            [prisma.admin.findFirst({ where: { id: decodedToken.userId } }),
            prisma.student.findFirst({ where: { id: decodedToken.userId } }),
            prisma.teacher.findFirst({ where: { id: decodedToken.userId } })]
        ) 
        if (user.every(value=>value===null)) {
            throw new APIError( "This account does not exist anymore. Please try to sign up again.",StatusCodes.NOT_FOUND)
        }
        let UserFound=user.filter(value=>value!==null).at(0)!;
        // Check if the user changed his password after the generation of the token
        // if (UserFound.passwordChangedAt as Date) {
        //     console.log(UserFound.passwordChangedAt as Date)
        //     const passwordChangedTimeStamp =
        //     (UserFound.passwordChangedAt as Date).getTime() / 1000;
        //     console.log(passwordChangedTimeStamp)
        //     console.log(decodedToken.iat)
        //     if (passwordChangedTimeStamp > decodedToken.iat) {
        //         throw new APIError(
        //             "The password has been changed since the last login. Please login again.",
        //             StatusCodes.UNAUTHORIZED
        //         );
        //     }
        // }
        req.user = UserFound;
        next();

  })