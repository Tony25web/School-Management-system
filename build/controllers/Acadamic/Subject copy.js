"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subject = void 0;
const PrismaClient_1 = require("../PrismaClient");
const APIError_1 = require("../../utils/APIError");
const http_status_codes_1 = require("http-status-codes");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
class Subject {
    //@desc   Creating a New Subject
    //@route  POST /api/v1/subjects/:programId
    //@access  Private(Admin)
    static async createSubject(req, res, next) {
        try {
            const { name, description, acadamicTermId } = req.body;
            const programFound = await prisma.program.findFirst({ where: { id: req.params.programId } });
            if (!programFound) {
                throw new APIError_1.APIError("there is no program found with the given id", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const subjectFound = await prisma.program.findFirst({ where: { name } });
            console.log(subjectFound);
            if (subjectFound) {
                throw new APIError_1.APIError("the Subject already exists", http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const SubjectCreated = await prisma.subject.create({
                data: {
                    name,
                    description,
                    acadamic: {
                        connect: { id: acadamicTermId }
                    },
                    program: {
                        connect: { id: req.params.programId }
                    },
                    admin: {
                        connect: { id: req.user.id }
                    },
                },
                include: { admin: true },
            });
            res
                .status(http_status_codes_1.StatusCodes.CREATED)
                .json({ message: "The Subject was created successfully", SubjectCreated });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   retrieving existing Subjects
    //@route  Get /api/v1/subjects
    //@access  Private(Admin)
    static async fetchSubjects(req, res, next) {
        try {
            const Subjects = await prisma.subject.findMany({
                where: { adminId: req.user?.id } || {},
            });
            if (!Subjects) {
                throw new APIError_1.APIError("there is no Subjects created yet", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Subjects successfully retrieved",
                Subjects,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   retrieving a specific, existing Subject
    //@route  Get /api/v1/subjects/:id
    //@access  Private(Admin)
    static async fetchASubject(req, res, next) {
        try {
            const Subject = await prisma.subject.findFirst({
                where: { id: req.params.id },
            });
            if (!Subject) {
                throw new APIError_1.APIError("there is no Subject with the specified id found ", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "A Program successfully retrieved",
                Subject,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   updating a specific Subject
    //@route  PUT /api/v1/subjects/:id
    //@access  Private(Admin)
    static async updateASubject(req, res, next) {
        try {
            // check the name of the class if it exists
            if (req.body.name) {
                const Subject = await prisma.subject.findFirst({
                    where: { name: req.body.name },
                });
                if (Subject) {
                    throw new APIError_1.APIError("the name of the Subject is already exists try another combination of characters", http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
            }
            const subject = await prisma.subject.update({
                where: { id: req.params.id },
                data: {
                    ...req.body,
                    adminId: req.user.id,
                },
            });
            if (!subject) {
                throw new APIError_1.APIError("could not update the subject because there is no record with the specified id found ", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "A subject successfully retrieved",
                subject,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //@desc   Deleting a specific existing subject
    //@route  Delete /api/v1/subjects/:id
    //@access  Private(Admin)
    static async deleteASubject(req, res, next) {
        try {
            const subject = await prisma.subject.delete({
                where: { id: req.params.id },
            });
            if (!subject) {
                throw new APIError_1.APIError("there is no subject with the specified id try again", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "A subject was successfully deleted" });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.Subject = Subject;
