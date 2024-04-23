import express from 'express';
import { AcademicYear as AcademicYearController } from '../../controllers/Acadamic/AcademicYear';
import { authorizedTo } from '../../middlewares/Authentication';
import { AcademicYearExtension } from '../../Prisma Extensions/AcademicYear';
import { createValidateJwtMiddleware } from '../../middlewares/ValidateJwt';
import { PrismaClientProvider } from '../../controllers/PrismaClient';
const prisma = PrismaClientProvider.getPrismaClient();
// Explicitly type AcademicExtension.AcademicYear using the generic type
const academicYear = AcademicYearExtension.acadamicYear as ModelMethods<typeof AcademicYearExtension.acadamicYear>;

class AcademicYear{
    router = express.Router();

  constructor() {
    this.initializeRoutes();
  }
  
  initializeRoutes() {
    this.router.use(createValidateJwtMiddleware,authorizedTo("admin"))
    this.router.route('/').post(AcademicYearController.createAcademicYear)
    this.router.route('/').get(AcademicYearController.fetchAcademicYears)
    this.router.route('/:id').get(AcademicYearController.fetchAnAcademicYear)
    this.router.route('/:id').put(AcademicYearController.updateAnAcademicYear)
    this.router.route('/:id').delete(AcademicYearController.deleteAnAcademicYear)
  }
}
export const router= new AcademicYear().router;