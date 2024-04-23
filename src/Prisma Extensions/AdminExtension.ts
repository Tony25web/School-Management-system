import * as dotenv from 'dotenv'
dotenv.config();
import { Request,Response,NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { APIError } from "../utils/APIError";
import { PrismaClientProvider } from "../controllers/PrismaClient";
import { Auth } from "../middlewares/Authentication";
import {JwtPayload} from "jsonwebtoken"
const prisma = PrismaClientProvider.getPrismaClient();
 export interface localJwtPayload extends JwtPayload{
  id:string;
  iat:number,
}
export const AdminExtension=prisma.$extends({
  model: {
   admin: {
    async validateJwt(req: Request, res: Response, next: NextFunction): Promise<void>{
      try {
        const authorizationHeader = req.headers['authorization'] as string;
if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
  throw new APIError(
    "please check if you are logged in and try again  ",
    StatusCodes.UNAUTHORIZED
  );
}
const token = authorizationHeader.split(" ")[1];
console.log(token)
// 2 - check if the token is valid(no change happened,expired token )
let decodedToken = Auth.verifyJWT(token) as localJwtPayload;
// 3 - check if user exists
const user = await prisma.admin.findFirst({where:{id:decodedToken.id}});
if (!user) {
  throw new APIError(
    "this account does not exist any more try to signup again"
  );
}
// 4- check if the user changed his password after the generation of the token
if (user!==null && user.passwordChangedAt) {
  /*we have in the payload that we received from verifying our 
  token a property called (iat) it has the expiration date 
  for the token so we gonna check it against our passwordChangeAt property */
  const passwordChangedTimeStamp = 
    user.passwordChangedAt.getTime() / 1000;
  if (passwordChangedTimeStamp > decodedToken.iat) {
    throw new APIError(
      "the password has been changed since the last login please login again",
      StatusCodes.UNAUTHORIZED
    );
  }
}
req.user = user;
next();
}
catch (error:Error|unknown) {
     next(error);      
}
}
   }
  },
})