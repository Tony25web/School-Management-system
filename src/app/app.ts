import express from "express";
import { errorHandler } from "../middlewares/ErrorMiddleware";
import morgan from "morgan";
import bodyParser from "body-parser";
import { router as AdminRouter } from "../routes/staff/Admin";
import { router as AcademicYearRouter } from "../routes/Academic/AcademicYear";
import { router as AcademicTermRouter } from "../routes/Academic/AcademicTerm";
import { router as ProgramRouter } from "../routes/Academic/Program";
import { router as ClassLevelRouter } from "../routes/Academic/classLevel";
import { router as SubjectRouter } from "../routes/Academic/Subject";
import { router as YearGroupRouter } from "../routes/Academic/YearGroup";
import { router as TeacherRouter } from "../routes/staff/Teacher";
import { APIError } from "../utils/APIError";
export const app= express();
app.use(bodyParser.json()); 
app.use("/api/v1/admin",AdminRouter)
app.use("/api/v1/academic-years",AcademicYearRouter)
app.use("/api/v1/academic-terms",AcademicTermRouter)
app.use("/api/v1/class-levels",ClassLevelRouter)
app.use("/api/v1/subjects",SubjectRouter)
app.use("/api/v1/programs",ProgramRouter)
app.use("/api/v1/year-groups",YearGroupRouter)
app.use("/api/v1/teachers",TeacherRouter)
app.use(morgan("dev"));
app.use(errorHandler)
app.all("*",(req, res, next) =>{
throw new APIError("sorry we couldn't find the route that you are looking for",404)
})
