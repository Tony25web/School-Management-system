export {};
import * as express from "express";
declare global {
  namespace Express {
    export interface Request {
      user?: any;
      headers:{
        authorization?: string;
      }
    }
  }
}   
