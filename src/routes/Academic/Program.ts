import express from 'express';
import { Program as ProgramController } from '../../controllers/Acadamic/Program';
import { authorizedTo } from '../../middlewares/Authentication';
import { ProgramExtension } from '../../Prisma Extensions/Program';
import { createValidateJwtMiddleware } from '../../middlewares/ValidateJwt';
import { PrismaClientProvider } from '../../controllers/PrismaClient';
// Define a generic type for the dynamic methods attached to the model
const prisma = PrismaClientProvider.getPrismaClient();

// Explicitly type AcademicExtension.AcademicYear using the generic type
const program = ProgramExtension.program as ModelMethods<typeof ProgramExtension.program>;

class Program{
    router = express.Router();

  constructor() {
    this.initializeRoutes();
  }
  
  initializeRoutes() {
    this.router.use(createValidateJwtMiddleware,authorizedTo("admin"))
    this.router.route('/').post(ProgramController.createProgram)
    this.router.route('/').get(ProgramController.fetchPrograms)
    this.router.route('/:id').get(ProgramController.fetchAProgram)
    this.router.route('/:id').put(ProgramController.updateAProgram)
    this.router.route('/:id').delete(ProgramController.deleteAProgram)
  }
}
export const router= new Program().router;