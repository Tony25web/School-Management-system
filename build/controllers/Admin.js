"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const http_status_codes_1 = require("http-status-codes");
const PrismaClient_1 = require("./PrismaClient");
const Authentication_1 = require("../middlewares/Authentication");
const APIError_1 = require("../utils/APIError");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
function exclude(user, keys) {
    const filteredUser = {};
    for (const [key, value] of Object.entries(user)) {
        if (!keys.includes(key)) {
            filteredUser[key] = value;
        }
    }
    return filteredUser;
}
class Admin {
    //@desc   Registering a new User
    //@route  PUT /api/v1/admin/register
    //@access  Private
    static async Register(req, res) {
        try {
            const { email, password, name } = req.body;
            const check = await prisma.admin.findFirst({ where: { email } });
            if (check) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ message: "admin already exists" });
            }
            const user = await prisma.admin.create({
                data: {
                    name,
                    email,
                    password: await Authentication_1.Auth.hash(password)
                }
            });
            const token = Authentication_1.Auth.generateJWT(user.id);
            res.status(http_status_codes_1.StatusCodes.CREATED).json({ status: "success", token });
        }
        catch (e) {
            console.log(e);
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ status: "failed", error: e });
        }
    }
    //@desc   Logging in an existing User
    //@route  PUT /api/v1/admin/register
    //@access  Private
    static async Login(req, res) {
        try {
            const { password, email } = req.body;
            const user = await prisma.admin.findFirst({ where: { email } });
            if (!user) {
                return res
                    .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                    .json({
                    message: "User not found make sure you have signed up before",
                });
            }
            const verifyPassword = await Authentication_1.Auth.verify(password, user.password);
            if (user && verifyPassword) {
                const token = Authentication_1.Auth.generateJWT(user.id);
                return res.status(http_status_codes_1.StatusCodes.OK).json({ message: "success", token });
            }
            else {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({
                    message: "invalid login credentials,check your password and try again",
                });
            }
        }
        catch (e) {
            console.log(e);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ status: "failed to login", error: e });
        }
    }
    //@desc   Registering a new Admin
    //@route  PUT /api/v1/admin/register
    //@access  Private
    static async getAllAdmins(req, res, next) {
        try {
            const admins = await prisma.admin.findMany({});
            if (!admins) {
                throw new APIError_1.APIError("there is no admins found yet ", 404);
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({ message: "success", admins });
        }
        catch (e) {
            next(e);
        }
    }
    //@desc   Registering a new Admin
    //@route  PUT /api/v1/admin/register
    //@access  Private
    static async getProfile(req, res, next) {
        try {
            const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
            if (!admin) {
                throw new APIError_1.APIError("there is no admin found with the id you have given ", 404);
            }
            const admin_Obj = exclude(admin, ['password']);
            res.status(http_status_codes_1.StatusCodes.OK).json({ status: "success", admin_Obj });
        }
        catch (e) {
            next(e);
        }
    } //@desc   Registering a new Admin
    //@route  PUT /api/v1/admin/register
    //@access  Private
    static async updateAdmin(req, res, next) {
        try {
            if (req.body.email) {
                const adminExist = await prisma.admin.findFirst({ where: { email: req.body?.email } });
                if (adminExist) {
                    throw new APIError_1.APIError("you cannot change your email to an existing one try different email input", http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
            }
            const updatedAdmin = await prisma.admin.update({ where: { id: req.params.id }, data: { ...req.body, password: await Authentication_1.Auth.hash(req.body.password) } });
            const admin_Obj = exclude(updatedAdmin, ['password']);
            if (!updatedAdmin) {
                throw new APIError_1.APIError("there is no admin to update", http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            res.status(201).json({ status: "success", data: updatedAdmin });
        }
        catch (e) {
            next(e);
        }
    } //@desc   Registering a new Admin
    //@route  PUT /api/v1/admin/register
    //@access  Private
    static async deleteAdmin(req, res) {
        try {
            return res.status(201).json({ status: "success", data: 'admin has been deleted' });
        }
        catch (e) {
            return res.status(201).json({ status: "failed to delete", error: e });
        }
    } //@desc   Registering a new Admin
    //@route  PUT /api/v1/admin/register
    //@access  Private
    static async suspendTeacher(req, res) {
        try {
            return res.status(201).json({ status: "success", data: 'admin has suspended the teacher' });
        }
        catch (e) {
            return res.status(201).json({ status: "failed to suspend", error: e });
        }
    } //@desc   Registering a new Admin
    //@route  PUT /api/v1/admin/register
    //@access  Private
    static async removeSuspension(req, res) {
        try {
            return res.status(201).json({ status: "success", data: 'admin has removed the suspension teacher' });
        }
        catch (e) {
            return res.status(201).json({ status: "failed to remove the suspension", error: e });
        }
    } //@desc   Registering a new Admin
    //@route  PUT /api/v1/admin/register
    //@access  Private
    static async withdrawTeacher(req, res) {
        try {
            return res.status(201).json({ status: "success", data: 'admin has withdrew the teacher' });
        }
        catch (e) {
            return res.status(201).json({ status: "failed to withdraw", error: e });
        }
    } //@desc   Registering a new Admin
    //@route  PUT /api/v1/admin/register
    //@access  Private
    static async publishExamResults(req, res) {
        try {
            return res.status(201).json({ status: "success", data: 'admin has published the exam results' });
        }
        catch (e) {
            return res.status(201).json({ status: "failed to publish", error: e });
        }
    } //@desc   Registering a new Admin
    //@route  PUT /api/v1/admin/register
    //@access  Private
    static async UnpublishExamResults(req, res) {
        try {
            return res.status(201).json({ status: "success", data: 'admin has Unpublished the exam results' });
        }
        catch (e) {
            return res.status(201).json({ status: "failed to Unpublish", error: e });
        }
    }
}
exports.Admin = Admin;
