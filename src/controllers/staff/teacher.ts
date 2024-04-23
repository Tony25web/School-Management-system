import { Request, Response, NextFunction } from "express";
import { Teacher as TeacherType } from "@prisma/client";
import { PrismaClientProvider } from "../PrismaClient";
import { APIError } from "../../utils/APIError";
import { TeacherExtension } from "../../Prisma Extensions/Teacher";
import { Auth } from "../../middlewares/Authentication";
import { StatusCodes } from "http-status-codes";
const prisma = PrismaClientProvider.getPrismaClient();
export class Teacher {
  //@desc   Admin Register a new Teacher
  //@route  POST /api/v1/teachers/admin/register
  //@access  Private
  static async adminRegisterTeacher(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, email, password } = req.body as TeacherType;
      const teacher = await prisma.teacher.findFirst({ where: { name } });
      if (teacher) {
        throw new APIError(
          "teacher already exists try another input combination",
          StatusCodes.BAD_REQUEST
        );
      }
      const hashedPassword = await Auth.hash(password);
      const teacherCreated = await TeacherExtension.teacher.create({
        data: {
          email,
          password: hashedPassword,
          name,
          createdId: { connect: { id: req.user.id } },
        },
      });
      res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "Teacher created successfully",
        data: teacherCreated,
      });
    } catch (error: Error | unknown) {
      next(error);
    }
  }
  //@desc   login an existing Teacher
  //@route  POST /api/v1/teachers/login
  //@access  Public
  static async loginTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as TeacherType;
      const teacher = await prisma.teacher.findFirst({ where: { email } });

      if (!teacher) {
        throw new APIError(`Teacher were not found`, StatusCodes.NOT_FOUND);
      }
      const passwordMatched = await Auth.verify(password, teacher?.password);
      if (!passwordMatched) {
        throw new APIError(`password is invalid`, StatusCodes.BAD_REQUEST);
      }

      const token = Auth.generateJWT(teacher.id);
      return res.status(StatusCodes.OK).json({
        status: "success",
        message: "logged-in successfully",
        token,
      });
    } catch (error) {
      next(error);
    }
  }
  //@desc   Get All Teachers
  //@route GET /api/v1/admin/teachers
  //@access  Private Admin only
  static async getAllTeachers(req: Request, res: Response, next: NextFunction) {
    const teachers = await prisma.teacher.findMany({});
    if (!teachers) {
      throw new APIError(
        "there is no teachers to fetch",
        StatusCodes.NOT_FOUND
      );
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "teachers were received successfully",
      teachers,
    });
  }
  //@desc   Get Single Teacher
  //@route GET /api/v1/teachers/:teacherId/admin
  //@access  Private Admin only
  static async getSingleTeacher(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { teacherId } = req.params;
    const teacher = await prisma.teacher.findFirst({
      where: { id: teacherId },
    });
    if (!teacher) {
      throw new APIError("there is no teacher to fetch", StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "teachers were received successfully",
      teacher,
    });
  }
  //@desc   Get Teacher's Profile
  //@route GET /api/v1/teachers/profile
  //@access  Private Teacher only
  static async getTeacherProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const teacher = await prisma.teacher.findFirst({
      where: { id: req.user?.id },
    });
    if (!teacher) {
      throw new APIError(
        "there is no teacher profile to fetch",
        StatusCodes.NOT_FOUND
      );
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "teachers were received successfully",
      teacher,
    });
  }
  //@desc   Update Teacher's Profile
  //@route PATCH /api/v1/teachers/update
  //@access  Private Teacher only
  static async TeacherUpdateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const teacher = await prisma.teacher.findFirst({
      where: { id: req.user.id },
    });

    if (!teacher) {
      throw new APIError(
        "there is no teacher with this email",
        StatusCodes.NOT_FOUND
      );
    }
    const updatedTeacher = await prisma.teacher.update({
      where: { id: req.user.id },
      data: { ...req.body },
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "teacher updated successfully",
      updatedTeacher,
    });
  }
  //@desc   Update Teacher's Profile via Admin
  //@route PATCH /api/v1/teachers/:teacherId/profile/update
  //@access  Private Admin only
  static async AdminUpdateTeacherProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { programId, classLevelId, AcademicYearId, subjectId } = req.body;
    // assign a program to the teacher
    const updatedTeacher = await prisma.teacher.update({
      where: { id: req.params.teacherId, isWithdrawn: false },
      data: {
        program: { connect: { id: programId } },
        ClassLevel: { connect: { id: classLevelId } },
        AcadamicYear: { connect: { id: AcademicYearId } },
        subject: { connect: { id: subjectId } },
      },
      include: {
        program: true,
        ClassLevel: true,
        AcadamicYear: true,
        subject: true,
      },
    });

    if (!updatedTeacher) {
      throw new APIError(
        "there is no teacher with this email",
        StatusCodes.NOT_FOUND
      );
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "teacher updated successfully",
      updatedTeacher,
    });
  }
}
