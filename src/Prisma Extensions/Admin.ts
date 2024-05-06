import * as dotenv from 'dotenv'
dotenv.config();
import { PrismaClientProvider } from "../controllers/PrismaClient";
import { Auth } from "../middlewares/Authentication";
import {JwtPayload} from "jsonwebtoken"
const prisma = PrismaClientProvider.getPrismaClient();
 export interface localJwtPayload extends JwtPayload{
  id:string;
  iat:number,
}
export const AdminExtension=prisma.$extends({
  query:{
    admin:{
      async update({ model, operation, args, query }) {
        if(args.data.password){
          args.data.password=await Auth.hash(args.data.password as string)
        }
            return query(args)
      },
    }
  }
})