
import { PrismaClientProvider } from "../controllers/PrismaClient";
const prisma = PrismaClientProvider.getPrismaClient();
import { Auth } from "../middlewares/Authentication";
export const StudentExtension = prisma.$extends({
  query: {
    student: {
      async create({ model, operation, args, query }) {
        args.data.studentId =
          "STU" +
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
        if(!args.data.currentClassLevel){
          const classLevelName:number=(await prisma.classLevel.findFirst({where:{id:(args.data.classLevel?.connect?.id) as string},select:{name:true}}))?.name as number
          args.data.currentClassLevel= classLevelName
          console.log(args.data)
        }
            return query(args)
      }
    },
  },
});
