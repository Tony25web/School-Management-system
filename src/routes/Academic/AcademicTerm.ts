import express from 'express';
import { AcademicTerm as AcademicTermController } from '../../controllers/Acadamic/AcademicTerm';
import { authorizedTo } from '../../middlewares/Authentication';
import { AcademicTermExtension } from '../../Prisma Extensions/AcademicTerm';
import { createValidateJwtMiddleware } from '../../middlewares/ValidateJwt';
import { PrismaClientProvider } from '../../controllers/PrismaClient';
const prisma = PrismaClientProvider.getPrismaClient();
// Explicitly type AcademicExtension.AcademicTerm using the generic type
const academicTerm = AcademicTermExtension.acadamicTerm as ModelMethods<typeof AcademicTermExtension.acadamicTerm>;

class AcademicTerm{
    router = express.Router();

  constructor() {
    this.initializeRoutes();
  }
  
  initializeRoutes() {
    this.router.use(createValidateJwtMiddleware,authorizedTo("admin"))
    this.router.route('/').post(AcademicTermController.createAcademicTerm)
    this.router.route('/').get(AcademicTermController.fetchAcademicTerms)
    this.router.route('/:id').get(AcademicTermController.fetchAnAcademicTerm)
    this.router.route('/:id').put(AcademicTermController.updateAnAcademicTerm)
    this.router.route('/:id').delete(AcademicTermController.deleteAnAcademicTerm)
  }
}
export const router= new AcademicTerm().router;