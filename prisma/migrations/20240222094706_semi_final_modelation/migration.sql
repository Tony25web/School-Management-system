/*
  Warnings:

  - Added the required column `updateAt` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExamResultStatus" AS ENUM ('failed', 'passed');

-- CreateEnum
CREATE TYPE "Remarks" AS ENUM ('Excellent', 'good', 'poor');

-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('pending', 'approved', 'live');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('teacher', 'admin');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "AcadamicTerm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL DEFAULT '3 months',
    "adminId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcadamicTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcadamicYear" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fromYear" TIMESTAMP(3) NOT NULL,
    "toYear" TIMESTAMP(3) NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcadamicYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "AcadamicYearId" TEXT,
    "classLevelId" TEXT,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "perfectName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "studentId" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT 'student',
    "dateAdmitted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isWithdrawn" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "isGraduated" BOOLEAN NOT NULL DEFAULT false,
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "yearGraduated" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "AcadamicYearId" TEXT,
    "classLevelId" TEXT,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "teacherID" TEXT NOT NULL DEFAULT '',
    "dateEmployed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isWithdrawn" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'teacher',
    "applicationStatus" "Status" NOT NULL DEFAULT 'pending',
    "createdBy" TEXT NOT NULL,
    "acadamicTermId" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassLevel" (
    "id" TEXT NOT NULL,
    "adminId" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "classLevelId" TEXT,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "teacherId" TEXT NOT NULL,
    "acadamicTermId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "duration" TEXT NOT NULL DEFAULT '3 Months',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamResult" (
    "id" TEXT NOT NULL,
    "studentId" TEXT,
    "examId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "acadamicYearId" TEXT NOT NULL,
    "acadamicTermId" TEXT NOT NULL,
    "classLevelId" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "passMark" INTEGER NOT NULL DEFAULT 50,
    "status" "ExamResultStatus" NOT NULL DEFAULT 'failed',
    "reamarks" "Remarks" NOT NULL DEFAULT 'poor',
    "position" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "passMark" INTEGER NOT NULL DEFAULT 50,
    "totalMark" INTEGER NOT NULL DEFAULT 100,
    "duration" TEXT NOT NULL DEFAULT '30',
    "examDate" TIMESTAMP(3) NOT NULL,
    "examTime" TEXT NOT NULL,
    "examType" TEXT NOT NULL DEFAULT 'Quiz',
    "examStatus" "ExamStatus" NOT NULL DEFAULT 'pending',
    "classLevelId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "acadanmicYear" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "examId" TEXT,
    "questionName" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamResults" (
    "id" TEXT NOT NULL,
    "studentId" TEXT,

    CONSTRAINT "ExamResults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YearGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "acadamicYearId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YearGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_acadamicTermId_key" ON "Teacher"("acadamicTermId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_acadamicTermId_key" ON "Subject"("acadamicTermId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamResult_examId_key" ON "ExamResult"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamResult_subjectId_key" ON "ExamResult"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamResult_acadamicYearId_key" ON "ExamResult"("acadamicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamResult_acadamicTermId_key" ON "ExamResult"("acadamicTermId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamResult_classLevelId_key" ON "ExamResult"("classLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_subjectId_key" ON "Exam"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_classLevelId_key" ON "Exam"("classLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_createdBy_key" ON "Exam"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_acadanmicYear_key" ON "Exam"("acadanmicYear");

-- CreateIndex
CREATE UNIQUE INDEX "Question_createdBy_key" ON "Question"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "YearGroup_acadamicYearId_key" ON "YearGroup"("acadamicYearId");

-- AddForeignKey
ALTER TABLE "AcadamicTerm" ADD CONSTRAINT "AcadamicTerm_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcadamicYear" ADD CONSTRAINT "AcadamicYear_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_AcadamicYearId_fkey" FOREIGN KEY ("AcadamicYearId") REFERENCES "AcadamicYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_AcadamicYearId_fkey" FOREIGN KEY ("AcadamicYearId") REFERENCES "AcadamicYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_acadamicTermId_fkey" FOREIGN KEY ("acadamicTermId") REFERENCES "AcadamicTerm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLevel" ADD CONSTRAINT "ClassLevel_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_acadamicTermId_fkey" FOREIGN KEY ("acadamicTermId") REFERENCES "AcadamicTerm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_acadamicYearId_fkey" FOREIGN KEY ("acadamicYearId") REFERENCES "AcadamicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_acadamicTermId_fkey" FOREIGN KEY ("acadamicTermId") REFERENCES "AcadamicTerm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_acadanmicYear_fkey" FOREIGN KEY ("acadanmicYear") REFERENCES "AcadamicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResults" ADD CONSTRAINT "ExamResults_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YearGroup" ADD CONSTRAINT "YearGroup_acadamicYearId_fkey" FOREIGN KEY ("acadamicYearId") REFERENCES "AcadamicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
