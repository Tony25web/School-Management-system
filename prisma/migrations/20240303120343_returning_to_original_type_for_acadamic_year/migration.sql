/*
  Warnings:

  - Changed the type of `fromYear` on the `AcadamicYear` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `toYear` on the `AcadamicYear` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AcadamicYear" DROP COLUMN "fromYear",
ADD COLUMN     "fromYear" TIMESTAMP(3) NOT NULL,
DROP COLUMN "toYear",
ADD COLUMN     "toYear" TIMESTAMP(3) NOT NULL;
