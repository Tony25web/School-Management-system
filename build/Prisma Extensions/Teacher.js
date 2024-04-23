"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherExtension = void 0;
const PrismaClient_1 = require("../controllers/PrismaClient");
const prisma = PrismaClient_1.PrismaClientProvider.getPrismaClient();
const Authentication_1 = require("../middlewares/Authentication");
exports.TeacherExtension = prisma.$extends({
    query: {
        teacher: {
            async create({ model, operation, args, query }) {
                args.data.teacherID =
                    "TEA" +
                        Math.floor(100 + Math.random() * 900) +
                        Date.now().toString().slice(2, 4) +
                        args.data.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .toUpperCase();
                return query(args);
            },
            async update({ model, operation, args, query }) {
                if (args.data.password) {
                    args.data.password = await Authentication_1.Auth.hash(args.data.password);
                }
                return query(args);
            },
        },
    },
});
