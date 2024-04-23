"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const classLevel_1 = require("../../controllers/Acadamic/classLevel");
const Authentication_1 = require("../../middlewares/Authentication");
const classLevel_2 = require("../../Prisma Extensions/classLevel");
// Define a generic type for the dynamic methods attached to the model
// Explicitly type AcademicExtension.AcademicYear using the generic type
const classLevel = classLevel_2.ClassLevelExtension.classLevel;
class ClassLevel {
    router = express_1.default.Router();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(classLevel.validateJwt, (0, Authentication_1.authorizedTo)("admin"));
        this.router.route('/').post(classLevel_1.ClassLevel.createClassLevel);
        this.router.route('/').get(classLevel_1.ClassLevel.fetchClassLevels);
        this.router.route('/:id').get(classLevel_1.ClassLevel.fetchAClasslevel);
        this.router.route('/:id').put(classLevel_1.ClassLevel.updateAClassLevel);
        this.router.route('/:id').delete(classLevel_1.ClassLevel.deleteAClassLevel);
    }
}
exports.router = new ClassLevel().router;
