"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const Admin_1 = require("../../controllers/staff/Admin");
const Admin_2 = require("../../validators/Admin");
const Authentication_1 = require("../../middlewares/Authentication");
const AdminExtension_1 = require("../../Prisma Extensions/AdminExtension");
// Explicitly type AdminExtension.admin using the generic type
const admin = AdminExtension_1.AdminExtension.admin;
class AdminRoutes {
    router = express_1.default.Router();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.route('/').get(admin.validateJwt, (0, Authentication_1.authorizedTo)("admin"), Admin_1.Admin.getAllAdmins);
        this.router.route('/profile').get(admin.validateJwt, (0, Authentication_1.authorizedTo)("admin"), Admin_1.Admin.getProfile);
        this.router.route('/:id').put(admin.validateJwt, (0, Authentication_1.authorizedTo)("admin"), Admin_1.Admin.updateAdmin);
        this.router.route('/:id').delete(admin.validateJwt, (0, Authentication_1.authorizedTo)("admin"), Admin_1.Admin.deleteAdmin);
        this.router.route('/register').post(Admin_2.checkAdminRegistration, Admin_1.Admin.Register);
        this.router.route('/login').post(Admin_1.Admin.Login);
        this.router.route('/suspend/teacher/:id').put(admin.validateJwt, (0, Authentication_1.authorizedTo)("admin"), Admin_1.Admin.suspendTeacher);
        this.router.route('/unsuspend/teacher/:id').put(admin.validateJwt, (0, Authentication_1.authorizedTo)("admin"), Admin_1.Admin.removeSuspension);
        this.router.route('/withdraw/teacher/:id').put(admin.validateJwt, (0, Authentication_1.authorizedTo)("admin"), Admin_1.Admin.withdrawTeacher);
        this.router.route('/publish/exam/:id').put(admin.validateJwt, (0, Authentication_1.authorizedTo)("admin"), Admin_1.Admin.publishExamResults);
        this.router.route('/unpublish/exam/:id').put(admin.validateJwt, (0, Authentication_1.authorizedTo)("admin"), Admin_1.Admin.UnpublishExamResults);
    }
}
exports.router = new AdminRoutes().router;
