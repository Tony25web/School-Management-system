import express from 'express';
import { Subject as SubjectController } from '../../controllers/Acadamic/Subject';
import { authorizedTo } from '../../middlewares/Authentication';
import {SubjectExtension } from '../../Prisma Extensions/Subject';
import { createValidateJwtMiddleware } from '../../middlewares/ValidateJwt';
import { PrismaClientProvider } from '../../controllers/PrismaClient';
// Define a generic type for the dynamic methods attached to the model
const prisma = PrismaClientProvider.getPrismaClient();
// Explicitly type AcademicExtension.AcademicYear using the generic type
const subject = SubjectExtension.subject as ModelMethods<typeof SubjectExtension.subject>;

class Subject{
    router = express.Router();

  constructor() {
    this.initializeRoutes();
  }
  
  initializeRoutes() {
    this.router.use(createValidateJwtMiddleware,authorizedTo("admin"))
    this.router.route('/:programId').post(SubjectController.createSubject)
    this.router.route('/').get(SubjectController.fetchSubjects)
    this.router.route('/:id').get(SubjectController.fetchASubject)
    this.router.route('/:id').put(SubjectController.updateASubject)
    this.router.route('/:id').delete(SubjectController.deleteASubject)
  }
}
export const router= new Subject().router;