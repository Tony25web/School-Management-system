"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectExtension = void 0;
const PrismaClient_1 = require("../controllers/PrismaClient");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
exports.SubjectExtension = prisma.$extends({});
