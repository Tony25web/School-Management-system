import { PrismaClient } from '@prisma/client';
export class PrismaClientProvider{
private static prismaClient:PrismaClient;
static getPrismaClient():PrismaClient{
    if(PrismaClientProvider.prismaClient){
        return PrismaClientProvider.prismaClient;
    }
    return PrismaClientProvider.prismaClient=new PrismaClient()
} 
}