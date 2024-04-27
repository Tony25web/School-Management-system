import express from 'express';
import {Admin} from '../../controllers/staff/Admin';
import { checkAdminRegistration } from '../../validators/Admin';
import { authorizedTo } from '../../middlewares/Authentication';
import { AdminExtension } from '../../Prisma Extensions/Admin';
// Define a generic type for the dynamic methods attached to the model
type ModelMethods<T> = {
  [K in keyof T]: T[K] extends (arg:any) => any ? T[K] : never;
};

// Explicitly type AdminExtension.admin using the generic type
const admin = AdminExtension.admin as ModelMethods<typeof AdminExtension.admin>;

class AdminRoutes{
    router = express.Router();

  constructor() {
    this.initializeRoutes();
  }
  
  initializeRoutes() {
    this.router.route('/').get(admin.validateJwt,authorizedTo("admin"),Admin.getAllAdmins)
    this.router.route('/profile').get(admin.validateJwt,authorizedTo("admin"),Admin.getProfile)
    this.router.route('/:id').put(admin.validateJwt,authorizedTo("admin"),Admin.updateAdmin)
    this.router.route('/:id').delete(admin.validateJwt,authorizedTo("admin"),Admin.deleteAdmin)
    this.router.route('/register',).post(checkAdminRegistration,Admin.Register)
    this.router.route('/login').post(Admin.Login)
    this.router.route('/suspend/teacher/:id').put(admin.validateJwt,authorizedTo("admin"),Admin.suspendTeacher)
    this.router.route('/unsuspend/teacher/:id').put(admin.validateJwt,authorizedTo("admin"),Admin.removeSuspension)
    this.router.route('/withdraw/teacher/:id').put(admin.validateJwt,authorizedTo("admin"),Admin.withdrawTeacher)
    this.router.route('/publish/exam/:id').put(admin.validateJwt,authorizedTo("admin"),Admin.publishExamResults)
    this.router.route('/unpublish/exam/:id').put(admin.validateJwt,authorizedTo("admin"),Admin.UnpublishExamResults)
  }
}
export const router= new AdminRoutes().router;