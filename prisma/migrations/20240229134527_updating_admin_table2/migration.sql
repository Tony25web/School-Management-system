-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "passwordChangedAt" DROP NOT NULL,
ALTER COLUMN "passwordChangedAt" SET DEFAULT CURRENT_TIMESTAMP;