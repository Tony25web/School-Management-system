"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClientProvider = void 0;
const client_1 = require("@prisma/client");
class PrismaClientProvider {
    static prismaClient;
    static getPrismaClient() {
        if (PrismaClientProvider.prismaClient) {
            return PrismaClientProvider.prismaClient;
        }
        return PrismaClientProvider.prismaClient = new client_1.PrismaClient();
    }
}
exports.PrismaClientProvider = PrismaClientProvider;
