
import { PrismaClientProvider } from "../controllers/PrismaClient";
const prisma = PrismaClientProvider.getPrismaClient();
import { Auth } from "../middlewares/Authentication";
export const TeacherExtension = prisma.$extends({
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
            return query(args)
      },
      async update({ model, operation, args, query }) {
        if(args.data.password){
          args.data.password=await Auth.hash(args.data.password as string)
        }
        
            return query(args)
      },
      
    },
  },
});
