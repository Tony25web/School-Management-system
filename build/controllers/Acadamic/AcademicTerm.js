"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicTerm = void 0;
const PrismaClient_1 = require("../PrismaClient");
const APIError_1 = require("../../utils/APIError");
const http_status_codes_1 = require("http-status-codes");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
class AcademicTerm {
    //@desc   Creating a New academic Term
    //@route  POST /api/v1/academic-terms
    //@access  Private(Admin)
    static async createAcademicTerm(req, res, next) {
        try {
            const { name, description, duration } = req.body;
            const academicTerm = await prisma.acadamicTerm.findFirst({
                where: { name },
            });
            if (academicTerm) {
                throw new APIError_1.APIError("the Academic Term is already created", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const academicTermCreated = await prisma.acadamicTerm.create({
                data: {
                    name,
                    description,
                    duration,
                    admin: {
                        connect: { id: req.user.id },
                    },
                },
                include: { admin: true },
            });
            res
                .status(http_status_codes_1.StatusCodes.CREATED)
                .json({ message: "academic Term created", academicTermCreated });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   retrieving existing academic Terms
    //@route  Get /api/v1/academic-terms
    //@access  Private(Admin)
    static async fetchAcademicTerms(req, res, next) {
        try {
            const academicTerms = await prisma.acadamicTerm.findMany({
                where: { adminId: req.user?.id } || {},
            });
            if (!academicTerms) {
                throw new APIError_1.APIError("there is no academic Terms created yet", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "academic Terms successfully retrieved",
                academicTerms,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   retrieving a specific existing academic Term
    //@route  Get /api/v1/academic-terms/:id
    //@access  Private(Admin)
    static async fetchAnAcademicTerm(req, res, next) {
        try {
            const academicTerm = await prisma.acadamicTerm.findFirst({
                where: { id: req.params.id },
            });
            if (!academicTerm) {
                throw new APIError_1.APIError("there is no Academic Term with the specified id found ", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "An Academic Term successfully retrieved",
                academicTerm,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   updating a specific existing academic Term
    //@route  PUT /api/v1/academic-terms/:id
    //@access  Private(Admin)
    static async updateAnAcademicTerm(req, res, next) {
        try {
            // check the name of the Term if it exists
            if (req.body.name) {
                const TermExists = await prisma.acadamicTerm.findFirst({
                    where: { name: req.body.name },
                });
                if (TermExists) {
                    throw new APIError_1.APIError("the name of the term is already exists try another combination of characters", http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
            }
            const academicTerm = await prisma.acadamicTerm.update({
                where: { id: req.params.id },
                data: {
                    ...req.body,
                    adminId: req.user.id,
                },
            });
            if (!academicTerm) {
                throw new APIError_1.APIError("could not update the Term because there is no record with the specified id found ", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "An academic Term successfully retrieved",
                academicTerm,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   Deleting a specific existing academic Term
    //@route  Delete /api/v1/academic-terms/:id
    //@access  Private(Admin)
    static async deleteAnAcademicTerm(req, res, next) {
        try {
            const academicTerm = await prisma.acadamicTerm.delete({
                where: { id: req.params.id },
            });
            if (!academicTerm) {
                throw new APIError_1.APIError("there is no academic Term with the specified id try again", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "An Academic Term successfully deleted" });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AcademicTerm = AcademicTerm;
