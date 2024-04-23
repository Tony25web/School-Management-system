"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const PrismaClient_1 = require("../PrismaClient");
const APIError_1 = require("../../utils/APIError");
const http_status_codes_1 = require("http-status-codes");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
class Program {
    //@desc   Creating a New Program
    //@route  POST /api/v1/programs
    //@access  Private(Admin)
    static async createProgram(req, res, next) {
        try {
            const { name, description } = req.body;
            const programExists = await prisma.program.findFirst({ where: { name } });
            if (programExists) {
                throw new APIError_1.APIError("the Program is already created", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const programCreated = await prisma.program.create({
                data: {
                    name,
                    description,
                    adminId: {
                        connect: { id: req.user.id },
                    },
                },
                include: { adminId: true },
            });
            res
                .status(http_status_codes_1.StatusCodes.CREATED)
                .json({ message: "Program created successfully", programCreated });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   retrieving existing Programs
    //@route  Get /api/v1/programs
    //@access  Private(Admin)
    static async fetchPrograms(req, res, next) {
        try {
            const Programs = await prisma.program.findMany({
                where: { createdBy: req.user?.id } || {},
            });
            if (!Programs) {
                throw new APIError_1.APIError("there is no Programs created yet", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "The Subjects was  successfully retrieved",
                Programs,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   retrieving a specific, existing Program
    //@route  Get /api/v1/programs/:id
    //@access  Private(Admin)
    static async fetchAProgram(req, res, next) {
        try {
            const program = await prisma.program.findFirst({
                where: { id: req.params.id },
            });
            if (!program) {
                throw new APIError_1.APIError("there is no Program with the specified id found ", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "A Program successfully retrieved",
                program,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   updating a specific Program
    //@route  PUT /api/v1/programs/:id
    //@access  Private(Admin)
    static async updateAProgram(req, res, next) {
        try {
            // check the name of the class if it exists
            if (req.body.name) {
                const Program = await prisma.program.findFirst({
                    where: { name: req.body.name },
                });
                if (Program) {
                    throw new APIError_1.APIError("the name of the Program is already exists try another combination of characters", http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
            }
            const program = await prisma.program.update({
                where: { id: req.params.id },
                data: {
                    ...req.body,
                    createdBy: req.user.id,
                },
            });
            if (!program) {
                throw new APIError_1.APIError("could not update the Program because there is no record with the specified id found ", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "A Program successfully retrieved",
                program,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   Deleting a specific existing Program
    //@route  Delete /api/v1/programs/:id
    //@access  Private(Admin)
    static async deleteAProgram(req, res, next) {
        try {
            const program = await prisma.program.delete({
                where: { id: req.params.id },
            });
            if (!program) {
                throw new APIError_1.APIError("there is no program with the specified id try again", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "A Program was successfully deleted" });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.Program = Program;
