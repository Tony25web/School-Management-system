import { Request,Response,NextFunction } from "express";
import {StatusCodes} from  "http-status-codes";  
import {APIError} from "../utils/APIError"
export const errorHandler = (error:APIError, req:Request, res:Response, next:NextFunction) => {
    error.statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR as number;
    error.status = error.status || "error";
    if (process.env.NODE_ENV == "development") {
      return sendErrorForDev(error, res);
    } else {
      if (error.name === "JsonWebTokenError")
        error = JWTErrorHandler("JsonWebTokenError");
      if (error.name === "TokenExpiredError")
        error = JWTErrorHandler("TokenExpiredError");
      sendErrorForProduction(error, res);
    }
  };
  const JWTErrorHandler = (name:string):APIError => {
    if (name === "JsonWebTokenError") {
      return new APIError("invalid token format try login again", StatusCodes.UNAUTHORIZED);
    } else {
      return new APIError("token date is expired login again ", StatusCodes.UNAUTHORIZED);
    }
  };
  const sendErrorForDev = (error:APIError, res:Response) => {
    return res.status(error.statusCode as number).json({
      status: error.status,
      message: error.message,
      error: error,
      stack: error.stack, // where did the error happen
    });
  };
  const sendErrorForProduction = (error:APIError, res:Response) => {
    return res.status(error.statusCode as number).json({
      status: error.status,
      message: error.message,
    });
  };
