import {Request,Response,NextFunction } from "express";
import {StatusCodes} from  "http-status-codes";  
import { PrismaClient } from "@prisma/client";
import {Auth} from "../../middlewares/Authentication";
import { APIError } from "../../utils/APIError";
import { Admin as AdminType } from "@prisma/client";
import { exclude } from "../../utils/Exclude";
const prisma=new PrismaClient();
export interface SignUpCredentials{
id?:string
email:string
password:string
name:string
role?:string
}

export class Admin{

  //@desc   Registering a new Admin
  //@route  PUT /api/v1/admin/register
  //@access  Private

  static async Register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body as SignUpCredentials;
     const check=await prisma.admin.findFirst({where:{email}})
      if (check) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "admin already exists" });
      }
      const user = await prisma.admin.create({
       data:{
        name,
        email,
        password:await Auth.hash(password)
       }
      })
      const token =Auth.generateJWT(user.id);
      res.status(StatusCodes.CREATED).json({ status: "success", token });
    } catch (e: Error | unknown) {
      console.log(e)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "failed", error: e });
    }
  }
  //@desc   Logging in an existing User
  //@route  PUT /api/v1/admin/register
  //@access  Private
 static  async Login(req: Request, res: Response) {
    try {
      const { password, email } = req.body as Pick<
        SignUpCredentials,
        "password" | "email"
      >;
      const user=await prisma.admin.findFirst({where:{email}})
      
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({
            message: "User not found make sure you have signed up before",
          });
      }

      const verifyPassword = await Auth.verify(password, user.password);
      if (user && verifyPassword) {
        const token = Auth.generateJWT(user.id);
        return res.status(StatusCodes.OK).json({ message: "success", token });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({
            message:
              "invalid login credentials,check your password and try again",
          });
      }
    } catch (e: Error | any) {
        console.log(e)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: "failed to login", error: e });
    }
  }

//@desc   Registering a new Admin
//@route  PUT /api/v1/admin/register
//@access  Private
static async getAllAdmins(req:Request,res:Response,next:NextFunction){
try{
const admins=await prisma.admin.findMany({})
if(!admins){
  throw new APIError("there is no admins found yet ",404)
}
res.status(StatusCodes.OK).json({message:"success", admins})
}catch(e:Error|any){
  next(e)
}
}
//@desc   Registering a new Admin
//@route  PUT /api/v1/admin/register
//@access  Private
static async getProfile(req:Request,res:Response,next:NextFunction){
  try{
const admin=await prisma.admin.findUnique({where:{id:req.user.id},include:{Program:true,AcadamicYear:true,AcadamicTerm:true,Subject:true,classLevel:true,YearGroup:true}});
if(!admin){
  throw new APIError("there is no admin found with the id you have given ",404)
}
const admin_Obj= exclude<AdminType,keyof AdminType>(admin, ['password']);
  res.status(StatusCodes.OK).json({status:"success",admin_Obj})

}catch(e:Error|any){
    next(e)
}
}//@desc   Registering a new Admin
//@route  PUT /api/v1/admin/register
//@access  Private
static async updateAdmin(req:Request,res:Response,next:NextFunction){
try{
  if(req.body.email){

    const adminExist=await prisma.admin.findFirst({where:{email:req.body?.email as string}})
    if(adminExist){
      throw new APIError("you cannot change your email to an existing one try different email input",StatusCodes.BAD_REQUEST)
    }
  }

const updatedAdmin=await prisma.admin.update({where:{id:req.params.id},data:{...req.body,password:await Auth.hash(req.body.password)}})
const admin_Obj= exclude<AdminType,keyof AdminType>(updatedAdmin, ['password']);
if(!updatedAdmin){
  throw new APIError("there is no admin to update",StatusCodes.NOT_FOUND)
}
 res.status(201).json({status:"success",data:admin_Obj})
}catch(e:Error|any){
   next(e)
}
}//@desc   Registering a new Admin
//@route  PUT /api/v1/admin/register
//@access  Private
static async deleteAdmin(req:Request,res:Response){
try{
return res.status(201).json({status:"success",data:'admin has been deleted'})
}catch(e:Error|any){
    return res.status(201).json({status:"failed to delete",error:e})
}
}//@desc   Registering a new Admin
//@route  PUT /api/v1/admin/register
//@access  Private
static async suspendTeacher(req:Request,res:Response){
try{
return res.status(201).json({status:"success",data:'admin has suspended the teacher'})
}catch(e:Error|unknown){
    return res.status(201).json({status:"failed to suspend",error:e})
}
}//@desc   Registering a new Admin
//@route  PUT /api/v1/admin/register
//@access  Private
static async removeSuspension(req:Request,res:Response){
try{
return res.status(201).json({status:"success",data:'admin has removed the suspension teacher'})
}catch(e:Error|unknown){
    return res.status(201).json({status:"failed to remove the suspension",error:e})
}
}//@desc   Registering a new Admin
//@route  PUT /api/v1/admin/register
//@access  Private
static async withdrawTeacher(req:Request,res:Response){
try{
return res.status(201).json({status:"success",data:'admin has withdrew the teacher'})
}catch(e:Error|unknown){
    return res.status(201).json({status:"failed to withdraw",error:e})
}
}//@desc   Registering a new Admin
//@route  PUT /api/v1/admin/register
//@access  Private
static async publishExamResults(req:Request,res:Response){
try{
return res.status(201).json({status:"success",data:'admin has published the exam results'})
}catch(e:Error|unknown){
    return res.status(201).json({status:"failed to publish",error:e})
}
}//@desc   Registering a new Admin
//@route  PUT /api/v1/admin/register
//@access  Private
static async UnpublishExamResults(req:Request,res:Response){
try{
return res.status(201).json({status:"success",data:'admin has Unpublished the exam results'})
}catch(e:Error|unknown){
    return res.status(201).json({status:"failed to Unpublish",error:e})
}
}
}