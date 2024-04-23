"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YearGroup = void 0;
const PrismaClient_1 = require("../PrismaClient");
const APIError_1 = require("../../utils/APIError");
const http_status_codes_1 = require("http-status-codes");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
class YearGroup {
    //@desc   Creating a New Year
    //@route  POST /api/v1/year-groups
    //@access  Private(Admin)
    static async createYearGroup(req, res, next) {
        try {
            const { name, acadamicYearId } = req.body;
            const yearGroupFound = await prisma.yearGroup.findFirst({ where: { name } });
            if (yearGroupFound) {
                throw new APIError_1.APIError("the year already exists", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const YearGroupCreated = await prisma.yearGroup.create({
                data: {
                    name,
                    acadamicYear: {
                        connect: { id: acadamicYearId }
                    },
                    admin: {
                        connect: { id: req.user.id }
                    },
                },
                include: { admin: true },
            });
            res
                .status(http_status_codes_1.StatusCodes.CREATED)
                .json({ message: "The Year Group was created successfully", YearGroupCreated });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   retrieving existing Year Groups
    //@route  Get /api/v1/year-groups
    //@access  Private(Admin)
    static async fetchYearGroups(req, res, next) {
        try {
            const groups = await prisma.yearGroup.findMany({});
            if (!groups) {
                throw new APIError_1.APIError("there is no Year Groups created yet", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Year Groups successfully retrieved",
                groups,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   retrieving a specific, existing Year Group
    //@route  Get /api/v1/year-groups/:id
    //@access  Private(Admin)
    static async fetchAYearGroup(req, res, next) {
        try {
            const group = await prisma.yearGroup.findFirst({
                where: { id: req.params.id },
            });
            if (!group) {
                throw new APIError_1.APIError("there is no Year Group with the specified id found ", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "A Year Group was retrieved successfully",
                group,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   updating a specific Year Group
    //@route  PUT /api/v1/year-groups/:id
    //@access  Private(Admin)
    static async updateAYearGroup(req, res, next) {
        try {
            // check the name of the class if it exists
            if (req.body.name) {
                const groupFound = await prisma.yearGroup.findFirst({
                    where: { name: req.body.name },
                });
                if (groupFound) {
                    throw new APIError_1.APIError("the name of the group is already exists try another combination of characters", http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
            }
            const group = await prisma.yearGroup.update({
                where: { id: req.params.id },
                data: {
                    ...req.body,
                    adminId: req.user.id,
                },
            });
            if (!group) {
                throw new APIError_1.APIError("could not update the year group because there is no record with the specified id found ", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "A Year Group was retrieved successfully",
                group,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   Deleting a specific existing Year Group
    //@route  Delete /api/v1/year-groups/:id
    //@access  Private(Admin)
    static async deleteAYearGroup(req, res, next) {
        try {
            const group = await prisma.yearGroup.delete({
                where: { id: req.params.id },
            });
            if (!group) {
                throw new APIError_1.APIError("there is no Year Group with the specified id try again", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "A Year group was successfully deleted" });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.YearGroup = YearGroup;
