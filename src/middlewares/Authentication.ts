import bcrypt from "bcryptjs";
import jwt,{Secret} from "jsonwebtoken"
import * as dotenv from 'dotenv'
import { APIError } from "../utils/APIError";
import { NextFunction,Response,Request } from "express";
import expressAsyncHandler from "express-async-handler"
import { StatusCodes } from "http-status-codes";
dotenv.config()
export class Auth {
    static async hash(password: string) {
        const salt =await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);
        return hash;
      }
      static generateJWT(user_id:string){
        return jwt.sign({ userId:user_id}, process.env.JWT_SECRET as Secret , {
          expiresIn: process.env.JWT_EXPIRE_TIME,
        });
      }
      static verifyJWT(password:string){
        return jwt.verify(password, (process.env.JWT_SECRET) as Secret );
      }
      static async verify(enteredPassword: string,userPassword:string) {
        return await bcrypt.compare(enteredPassword,userPassword)
    }
}
export const authorizedTo = (...roles:string[]) =>
  expressAsyncHandler(async (req:Request, res:Response, next:NextFunction) => {
    // 1- access routes
    // 2 - access registered users (req.user.role)
    console.log(req.user.role)
    if (!roles.includes(req.user.role)) {
      throw new APIError("you are not allowed to access this route", StatusCodes.FORBIDDEN);
    }
    next();
  });