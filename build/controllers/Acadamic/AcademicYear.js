"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicYear = void 0;
const PrismaClient_1 = require("../PrismaClient");
const APIError_1 = require("../../utils/APIError");
const http_status_codes_1 = require("http-status-codes");
const AcademicYear_1 = require("../../Prisma Extensions/AcademicYear");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
class AcademicYear {
    //@desc   Creating a New academic Year
    //@route  POST /api/v1/academic-years
    //@access  Private(Admin)
    static async createAcademicYear(req, res, next) {
        try {
            const { name, fromYear, toYear } = req.body;
            const academicYear = await prisma.acadamicYear.findFirst({
                where: { name },
            });
            if (academicYear) {
                throw new APIError_1.APIError("the AcademicYear is already created", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const academicYearCreated = await prisma.acadamicYear.create({
                data: {
                    name,
                    fromYear: new Date(fromYear),
                    toYear: new Date(toYear),
                    admin: {
                        connect: { id: req.user.id }
                    }
                },
                include: { admin: true }
            });
            res
                .status(http_status_codes_1.StatusCodes.CREATED)
                .json({ message: "academic year created", academicYearCreated });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   retrieving an existing academic Years
    //@route  Get /api/v1/academic-years
    //@access  Private(Admin)
    static async fetchAcademicYears(req, res, next) {
        try {
            const academicYears = await prisma.acadamicYear.findMany({ where: { createdBy: req.user?.id } || {} });
            if (!academicYears) {
                throw new APIError_1.APIError("there is no academic years created yet", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({
                message: "academic Years successfully retrieved",
                academicYears,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   retrieving a specific existing academic Year
    //@route  Get /api/v1/academic-years/:id
    //@access  Private(Admin)
    static async fetchAnAcademicYear(req, res, next) {
        try {
            const academicYear = await prisma.acadamicYear.findFirst({
                where: { id: req.params.id },
            });
            if (!academicYear) {
                throw new APIError_1.APIError("there is no academic year with the specified id found ", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({
                message: "An academic Year successfully retrieved",
                academicYear,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   updating a specific existing academic Year
    //@route  PUT /api/v1/academic-years/:id
    //@access  Private(Admin)
    static async updateAnAcademicYear(req, res, next) {
        try {
            // check the name of the year if it exists
            if (req.body.name) {
                const yearExists = await prisma.acadamicYear.findFirst({ where: { name: req.body.name } });
                if (yearExists) {
                    throw new APIError_1.APIError("the name already exists try another combination of characters", http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
            }
            const academicYear = await AcademicYear_1.AcademicYearExtension.acadamicYear.update({
                where: { id: req.params.id },
                data: {
                    ...req.body,
                    createdBy: req.user.id,
                },
            });
            console.log(academicYear);
            if (!academicYear) {
                throw new APIError_1.APIError("could not update the year because there is no record with the specified id found ", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({
                message: "An academic Year successfully retrieved",
                academicYear,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   Deleting a specific existing academic Year
    //@route  Delete /api/v1/academic-years/:id
    //@access  Private(Admin)
    static async deleteAnAcademicYear(req, res, next) {
        try {
            const academicYear = await prisma.acadamicYear.delete({
                where: { id: req.params.id },
            });
            if (!academicYear) {
                throw new APIError_1.APIError("there is no academic year with the specified id try again", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "An academic Year successfully deleted" });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AcademicYear = AcademicYear;
