CREATE TYPE "Role" AS ENUM (
  'teacher',
  'admin'
);

CREATE TYPE "Status" AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TABLE "AcadamicTerm" (
  "id" String PRIMARY KEY,
  "name" String NOT NULL,
  "description" String NOT NULL,
  "duration" String NOT NULL DEFAULT '3 months',
  "admin" Admin NOT NULL,
  "adminId" String NOT NULL,
  "createAt" DateTime NOT NULL DEFAULT (now()),
  "updateAt" DateTime NOT NULL,
  "subject" Subject,
  "teacherId" Teacher
);

CREATE TABLE "Admin" (
  "id" String PRIMARY KEY,
  "AcadamicTerm" AcadamicTerm NOT NULL,
  "AcadamicYear" AcadamicYear NOT NULL,
  "name" String NOT NULL,
  "email" String NOT NULL,
  "password" String NOT NULL,
  "role" String NOT NULL DEFAULT 'admin',
  "createdAt" DateTime NOT NULL,
  "classLevel" ClassLevel NOT NULL,
  "Program" Program NOT NULL,
  "Subject" Subject NOT NULL,
  "Teacher" Teacher NOT NULL
);

CREATE TABLE "AcadamicYear" (
  "id" String PRIMARY KEY,
  "name" String NOT NULL,
  "fromYear" DateTime NOT NULL,
  "toYear" DateTime NOT NULL,
  "isCurrent" Boolean NOT NULL DEFAULT false,
  "admin" Admin NOT NULL,
  "createdBy" String NOT NULL,
  "students" Student NOT NULL,
  "teachers" Teacher NOT NULL,
  "createAt" DateTime NOT NULL DEFAULT (now()),
  "updateAt" DateTime NOT NULL,
  "YearGroup" YearGroup
);

CREATE TABLE "Student" (
  "id" String PRIMARY KEY,
  "AcadamicYear" AcadamicYear,
  "AcadamicYearId" String,
  "ClassLevel" ClassLevel,
  "classLevelId" String,
  "program" Program NOT NULL,
  "programId" String NOT NULL,
  "name" String NOT NULL,
  "perfectName" String,
  "email" String NOT NULL,
  "password" String NOT NULL,
  "studentId" String NOT NULL DEFAULT '',
  "role" String NOT NULL DEFAULT 'student',
  "dateAdmitted" DateTime NOT NULL DEFAULT (now()),
  "examResults" ExamResults NOT NULL,
  "isWithdrawn" Boolean NOT NULL DEFAULT false,
  "isSuspended" Boolean NOT NULL DEFAULT false,
  "isGraduated" Boolean NOT NULL DEFAULT false,
  "isPromoted" Boolean NOT NULL DEFAULT false,
  "yearGraduated" String,
  "createdAt" DateTime NOT NULL DEFAULT (now()),
  "updatedAt" DateTime NOT NULL
);

CREATE TABLE "Teacher" (
  "id" String PRIMARY KEY,
  "AcadamicYear" AcadamicYear,
  "AcadamicYearId" String,
  "ClassLevel" ClassLevel,
  "classLevelId" String,
  "program" Program NOT NULL,
  "programId" String NOT NULL,
  "subject" Subject NOT NULL,
  "name" String NOT NULL,
  "email" String NOT NULL,
  "password" String NOT NULL,
  "teacherId" String NOT NULL DEFAULT '',
  "dateEmployed" DateTime NOT NULL DEFAULT (now()),
  "isWithdrawn" Boolean NOT NULL DEFAULT false,
  "isSuspended" Boolean NOT NULL DEFAULT false,
  "role" Role NOT NULL DEFAULT 'teacher',
  "applicationStatus" Status NOT NULL DEFAULT 'pending',
  "examCreated" Exam NOT NULL,
  "createdId" Admin NOT NULL,
  "createdBy" String NOT NULL,
  "acadamicId" AcadamicTerm NOT NULL,
  "acadamicTermId" String UNIQUE NOT NULL
);

CREATE TABLE "ClassLevel" (
  "id" String PRIMARY KEY,
  "Admin" Admin,
  "adminId" String,
  "teachers" Teacher NOT NULL,
  "students" Student NOT NULL,
  "subjects" Subject NOT NULL,
  "createAt" DateTime NOT NULL DEFAULT (now()),
  "updateAt" DateTime NOT NULL
);

CREATE TABLE "Subject" (
  "id" String PRIMARY KEY,
  "ClassLevel" ClassLevel,
  "classLevelId" String,
  "exam" Exam,
  "program" Program NOT NULL,
  "programId" String NOT NULL,
  "name" String NOT NULL,
  "description" String,
  "teacher" Teacher NOT NULL,
  "teacherId" String NOT NULL,
  "acadamic" AcadamicTerm NOT NULL,
  "acadamicTermId" String UNIQUE NOT NULL,
  "admin" Admin NOT NULL,
  "adminId" String NOT NULL,
  "duration" String NOT NULL DEFAULT '3 Months',
  "createAt" DateTime NOT NULL DEFAULT (now()),
  "updateAt" DateTime NOT NULL
);

CREATE TABLE "Exam" (
  "id" String PRIMARY KEY,
  "name" String NOT NULL,
  "description" String NOT NULL,
  "subject" Subject NOT NULL,
  "subjectId" String UNIQUE NOT NULL,
  "program" Program NOT NULL,
  "programId" String NOT NULL,
  "passMark" Int NOT NULL DEFAULT 50,
  "totalMark" Int NOT NULL DEFAULT 100,
  "duration" String NOT NULL DEFAULT '30',
  "examDate" DateTime NOT NULL,
  "examTime" String NOT NULL,
  "examType" String NOT NULL DEFAULT 'Quiz',
  "examStatus" String NOT NULL DEFAULT 'pending',
  "Teacher" Teacher,
  "teacherId" String
);

CREATE TABLE "Program" (
  "id" String PRIMARY KEY,
  "Exam" Exam NOT NULL,
  "name" String NOT NULL,
  "description" String NOT NULL,
  "duration" String NOT NULL DEFAULT '4 Years',
  "code" String NOT NULL DEFAULT '',
  "adminId" Admin NOT NULL,
  "createdBy" String NOT NULL,
  "teachers" Teacher NOT NULL,
  "students" Student NOT NULL,
  "Subjects" Subject NOT NULL,
  "createAt" DateTime NOT NULL DEFAULT (now()),
  "updateAt" DateTime NOT NULL
);

CREATE TABLE "ExamResults" (
  "id" String PRIMARY KEY,
  "Student" Student,
  "studentId" String
);

CREATE TABLE "YearGroup" (
  "id" String PRIMARY KEY,
  "name" String NOT NULL,
  "acadamicYear" AcadamicYear,
  "acadamicYearId" String UNIQUE NOT NULL,
  "createAt" DateTime NOT NULL DEFAULT (now()),
  "updateAt" DateTime NOT NULL
);

ALTER TABLE "AcadamicTerm" ADD FOREIGN KEY ("adminId") REFERENCES "Admin" ("id");

ALTER TABLE "AcadamicYear" ADD FOREIGN KEY ("createdBy") REFERENCES "Admin" ("id");

ALTER TABLE "Student" ADD FOREIGN KEY ("AcadamicYearId") REFERENCES "AcadamicYear" ("id");

ALTER TABLE "Student" ADD FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel" ("id");

ALTER TABLE "Student" ADD FOREIGN KEY ("programId") REFERENCES "Program" ("id");

ALTER TABLE "Teacher" ADD FOREIGN KEY ("AcadamicYearId") REFERENCES "AcadamicYear" ("id");

ALTER TABLE "Teacher" ADD FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel" ("id");

ALTER TABLE "Teacher" ADD FOREIGN KEY ("programId") REFERENCES "Program" ("id");

ALTER TABLE "Teacher" ADD FOREIGN KEY ("createdBy") REFERENCES "Admin" ("id");

ALTER TABLE "AcadamicTerm" ADD FOREIGN KEY ("id") REFERENCES "Teacher" ("acadamicTermId");

ALTER TABLE "ClassLevel" ADD FOREIGN KEY ("adminId") REFERENCES "Admin" ("id");

ALTER TABLE "Subject" ADD FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel" ("id");

ALTER TABLE "Subject" ADD FOREIGN KEY ("programId") REFERENCES "Program" ("id");

ALTER TABLE "Subject" ADD FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id");

ALTER TABLE "AcadamicTerm" ADD FOREIGN KEY ("id") REFERENCES "Subject" ("acadamicTermId");

ALTER TABLE "Subject" ADD FOREIGN KEY ("adminId") REFERENCES "Admin" ("id");

ALTER TABLE "Subject" ADD FOREIGN KEY ("id") REFERENCES "Exam" ("subjectId");

ALTER TABLE "Exam" ADD FOREIGN KEY ("programId") REFERENCES "Program" ("id");

ALTER TABLE "Exam" ADD FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id");

ALTER TABLE "Program" ADD FOREIGN KEY ("createdBy") REFERENCES "Admin" ("id");

ALTER TABLE "ExamResults" ADD FOREIGN KEY ("studentId") REFERENCES "Student" ("id");

ALTER TABLE "AcadamicYear" ADD FOREIGN KEY ("id") REFERENCES "YearGroup" ("acadamicYearId");
