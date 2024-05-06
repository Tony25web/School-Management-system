import { PrismaClientProvider } from "../controllers/PrismaClient";
const prisma = PrismaClientProvider.getPrismaClient();
export const ProgramExtension = prisma.$extends({
  query: {
    program: {
      async create({ model, operation, args, query }) {
        args.data.code =
          args.data.name
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase() +
          Math.floor(10 + Math.random() * 90) +
          Math.floor(10 + Math.random() * 90);
        return query(args);
      },
    },
  },
});
