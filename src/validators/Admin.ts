import {z} from "zod";
import { Request,Response,NextFunction } from "express";
import {StatusCodes} from  "http-status-codes";
import { SignUpCredentials } from "../controllers/staff/Admin";
import { APIError } from "../utils/APIError";
const AdminSchema=z.object({
name:z.string(),
email:z.string(),
password:z.string(),
})
export const checkAdminRegistration=(req:Request,res:Response,next:NextFunction)=>{
const check=AdminSchema.safeParse(req.body as SignUpCredentials);
if(check.success){
return next()
}
throw new APIError("there is a missing fields within the input , provide them in full",StatusCodes.BAD_REQUEST)
}