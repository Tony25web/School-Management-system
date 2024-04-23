/*
  Warnings:

  - Added the required column `passwordChangedAt` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "passwordChangedAt" TIMESTAMP(3) NOT NULL;
