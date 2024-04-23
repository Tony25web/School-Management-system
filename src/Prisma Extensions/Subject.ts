
import { PrismaClientProvider } from "../controllers/PrismaClient";

const prisma = PrismaClientProvider.getPrismaClient();

export const SubjectExtension=prisma.$extends({
  
  });