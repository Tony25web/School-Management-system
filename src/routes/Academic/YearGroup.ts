import express from 'express';
import { YearGroup as YearGroupController } from '../../controllers/Acadamic/YearGroup';
import { authorizedTo } from '../../middlewares/Authentication';
import { createValidateJwtMiddleware } from '../../middlewares/ValidateJwt';
import { PrismaClientProvider } from '../../controllers/PrismaClient';
// Define a generic type for the dynamic methods attached to the model
const prisma = PrismaClientProvider.getPrismaClient();

class YearGroup{
    router = express.Router();

  constructor() {
    this.initializeRoutes();
  }
  
  initializeRoutes() {
    this.router.use(createValidateJwtMiddleware,authorizedTo("admin"))
    this.router.route('/')
    .post(YearGroupController.createYearGroup)
    .get(YearGroupController.fetchYearGroups)
    this.router.route('/:id')
    .get(YearGroupController.fetchAYearGroup)
    .put(YearGroupController.updateAYearGroup)
    .delete(YearGroupController.deleteAYearGroup)
  }
}
export const router= new YearGroup().router;