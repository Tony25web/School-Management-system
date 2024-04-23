"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassLevel = void 0;
const PrismaClient_1 = require("../PrismaClient");
const APIError_1 = require("../../utils/APIError");
const http_status_codes_1 = require("http-status-codes");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
class ClassLevel {
    //@desc   Creating a New Class Level
    //@route  POST /api/v1/class-levels
    //@access  Private(Admin)
    static async createClassLevel(req, res, next) {
        try {
            const { name, description } = req.body;
            const classLevel = await prisma.classLevel.findFirst({ where: { name } });
            if (classLevel) {
                throw new APIError_1.APIError("the class Level is already created", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const classLevelCreated = await prisma.classLevel.create({
                data: {
                    name,
                    description,
                    admin: {
                        connect: { id: req.user.id },
                    },
                },
                include: { admin: true },
            });
            res
                .status(http_status_codes_1.StatusCodes.CREATED)
                .json({ message: "academic Term created", classLevelCreated });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   retrieving existing Class Levels
    //@route  Get /api/v1/class-levels
    //@access  Private(Admin)
    static async fetchClassLevels(req, res, next) {
        try {
            const classLevels = await prisma.classLevel.findMany({
                where: { adminId: req.user?.id } || {},
            });
            if (!classLevels) {
                throw new APIError_1.APIError("there is no academic Terms created yet", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "academic Terms successfully retrieved",
                classLevels,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   retrieving a specific existing academic Term
    //@route  Get /api/v1/class-levels/:id
    //@access  Private(Admin)
    static async fetchAClasslevel(req, res, next) {
        try {
            const classLevel = await prisma.classLevel.findFirst({
                where: { id: req.params.id },
            });
            if (!classLevel) {
                throw new APIError_1.APIError("there is no Academic Term with the specified id found ", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "An Academic Term successfully retrieved",
                classLevel,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   updating a specific existing academic Term
    //@route  PUT /api/v1/class-levels/:id
    //@access  Private(Admin)
    static async updateAClassLevel(req, res, next) {
        try {
            // check the name of the class if it exists
            if (req.body.name) {
                const ClassExists = await prisma.classLevel.findFirst({
                    where: { name: req.body.name },
                });
                if (ClassExists) {
                    throw new APIError_1.APIError("the name of the class is already exists try another combination of characters", http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
            }
            const classLevel = await prisma.classLevel.update({
                where: { id: req.params.id },
                data: {
                    ...req.body,
                    adminId: req.user.id,
                },
            });
            if (!classLevel) {
                throw new APIError_1.APIError("could not update the Term because there is no record with the specified id found ", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "An academic Term successfully retrieved",
                classLevel,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   Deleting a specific existing academic Term
    //@route  Delete /api/v1/class-levels/:id
    //@access  Private(Admin)
    static async deleteAClassLevel(req, res, next) {
        try {
            const classLevel = await prisma.classLevel.delete({
                where: { id: req.params.id },
            });
            if (!classLevel) {
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
exports.ClassLevel = ClassLevel;
