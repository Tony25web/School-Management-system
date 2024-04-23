import {JwtPayload} from "jsonwebtoken"
export interface localJwtPayload extends JwtPayload{
    id:string;
    iat:number,
  }