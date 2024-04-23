"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app/app");
const http_1 = __importDefault(require("http"));
const port = process.env.port || 3005;
const server = http_1.default.createServer(app_1.app);
server.listen(port, () => {
    console.log(`server is listening on ${port}`);
});
