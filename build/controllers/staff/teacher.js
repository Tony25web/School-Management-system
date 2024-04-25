"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teacher = void 0;
const PrismaClient_1 = require("../PrismaClient");
const APIError_1 = require("../../utils/APIError");
const Teacher_1 = require("../../Prisma Extensions/Teacher");
const Authentication_1 = require("../../middlewares/Authentication");
const http_status_codes_1 = require("http-status-codes");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
class Teacher {
    //@desc   Admin Register a new Teacher
    //@route  POST /api/v1/teachers/admin/register
    //@access  Private
    static async adminRegisterTeacher(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const teacher = await prisma.teacher.findFirst({ where: { name } });
            if (teacher) {
                throw new APIError_1.APIError("teacher already exists try another input combination", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const hashedPassword = await Authentication_1.Auth.hash(password);
            const teacherCreated = await Teacher_1.TeacherExtension.teacher.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    createdId: { connect: { id: req.user.id } },
                },
            });
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                status: "success",
                message: "Teacher created successfully",
                data: teacherCreated,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   login an existing Teacher
    //@route  POST /api/v1/teachers/login
    //@access  Public
    static async loginTeacher(req, res, next) {
        try {
            const { email, password } = req.body;
            const teacher = await prisma.teacher.findFirst({ where: { email } });
            if (!teacher) {
                throw new APIError_1.APIError(`Teacher were not found`, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const passwordMatched = await Authentication_1.Auth.verify(password, teacher?.password);
            if (!passwordMatched) {
                throw new APIError_1.APIError(`password is invalid`, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const token = Authentication_1.Auth.generateJWT(teacher.id);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: "success",
                message: "logged-in successfully",
                token,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   Get All Teachers
    //@route GET /api/v1/admin/teachers
    //@access  Private Admin only
    static async getAllTeachers(req, res, next) {
        const teachers = await prisma.teacher.findMany({});
        if (!teachers) {
            throw new APIError_1.APIError("there is no teachers to fetch", http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "success",
            message: "teachers were received successfully",
            teachers,
        });
    }
    //@desc   Get Single Teacher
    //@route GET /api/v1/teachers/:teacherId/admin
    //@access  Private Admin only
    static async getSingleTeacher(req, res, next) {
        const { teacherId } = req.params;
        const teacher = await prisma.teacher.findFirst({
            where: { id: teacherId },
        });
        if (!teacher) {
            throw new APIError_1.APIError("there is no teacher to fetch", http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "success",
            message: "teachers were received successfully",
            teacher,
        });
    }
    //@desc   Get Teacher's Profile
    //@route GET /api/v1/teachers/profile
    //@access  Private Teacher only
    static async getTeacherProfile(req, res, next) {
        const teacher = await prisma.teacher.findFirst({
            where: { id: req.user?.id }, include: { examsCreated: true },
        });
        if (!teacher) {
            throw new APIError_1.APIError("there is no teacher profile to fetch", http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "success",
            message: "teachers were received successfully",
            teacher,
        });
    }
    //@desc   Update Teacher's Profile
    //@route PATCH /api/v1/teachers/update
    //@access  Private Teacher only
    static async TeacherUpdateProfile(req, res, next) {
        const teacher = await prisma.teacher.findFirst({
            where: { id: req.user.id },
        });
        if (!teacher) {
            throw new APIError_1.APIError("there is no teacher with this email", http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        const updatedTeacher = await prisma.teacher.update({
            where: { id: req.user.id },
            data: { ...req.body },
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "success",
            message: "teacher updated successfully",
            updatedTeacher,
        });
    }
    //@desc   Update Teacher's Profile via Admin
    //@route PATCH /api/v1/teachers/:teacherId/profile/update
    //@access  Private Admin only
    static async AdminUpdateTeacherProfile(req, res, next) {
        const { programId, classLevelId, AcademicYearId, subjectId } = req.body;
        // assign a program to the teacher
        const updatedTeacher = await prisma.teacher.update({
            where: { id: req.params.teacherId, isWithdrawn: false },
            data: {
                program: programId ? { connect: { id: programId } } : undefined,
                ClassLevel: classLevelId ? { connect: { id: classLevelId } } : undefined,
                AcadamicYear: AcademicYearId ? { connect: { id: AcademicYearId } } : undefined,
                subject: subjectId ? { connect: { id: subjectId } } : undefined,
            },
            include: {
                program: true,
                ClassLevel: true,
                AcadamicYear: true,
                subject: true,
            },
        });
        if (!updatedTeacher) {
            throw new APIError_1.APIError("there is no teacher with this email", http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "success",
            message: "teacher updated successfully",
            updatedTeacher,
        });
    }
}
exports.Teacher = Teacher;
