import express from 'express';
import { ClassLevel as ClassLevelController } from '../../controllers/Acadamic/classLevel';
import { authorizedTo } from '../../middlewares/Authentication';
import { ClassLevelExtension } from '../../Prisma Extensions/classLevel';
import { createValidateJwtMiddleware } from '../../middlewares/ValidateJwt';
import { PrismaClientProvider } from '../../controllers/PrismaClient';
// Define a generic type for the dynamic methods attached to the model
const prisma = PrismaClientProvider.getPrismaClient();

// Explicitly type AcademicExtension.AcademicYear using the generic type
const classLevel = ClassLevelExtension.classLevel as ModelMethods<typeof ClassLevelExtension.classLevel>;

class ClassLevel{
    router = express.Router();

  constructor() {
    this.initializeRoutes();
  }
  
  initializeRoutes() {
    this.router.use(createValidateJwtMiddleware,authorizedTo("admin"))
    this.router.route('/').post(ClassLevelController.createClassLevel)
    this.router.route('/').get(ClassLevelController.fetchClassLevels)
    this.router.route('/:id').get(ClassLevelController.fetchAClasslevel)
    this.router.route('/:id').put(ClassLevelController.updateAClassLevel)
    this.router.route('/:id').delete(ClassLevelController.deleteAClassLevel)
  }
}
export const router= new ClassLevel().router;