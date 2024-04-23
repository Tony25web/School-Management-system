"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashExtension = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const PrismaClient_1 = require("../controllers/PrismaClient");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
exports.hashExtension = prisma.$extends({
    model: {
        admin: {
            async signUp(email, password, name) {
                const hash = await bcryptjs_1.default.hash(password, 10);
                return prisma.admin.create({
                    data: {
                        email,
                        name,
                        password: hash
                    },
                });
            },
        },
    },
});
