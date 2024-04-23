import dotenv from'dotenv'
dotenv.config();
import { app } from "./app/app";
import http from "http";
const port =process.env.port ||3005;
const server=http.createServer(app)

server.listen(port,()=>{
    console.log(`server is listening on ${port}`)
});