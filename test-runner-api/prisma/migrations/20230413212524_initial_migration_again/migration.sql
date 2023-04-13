-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'FINISHED');

-- CreateEnum
CREATE TYPE "CommandStatus" AS ENUM ('PENDING', 'RUNNING', 'FINISHED', 'ABORTED', 'FAILED');

-- CreateEnum
CREATE TYPE "ConcurrencyMode" AS ENUM ('SINGULAR', 'PARALLEL');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "selector" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL,
    "dockerImageConfigId" TEXT NOT NULL,
    "environmentId" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Command" (
    "id" TEXT NOT NULL,
    "spec" TEXT NOT NULL,
    "status" "CommandStatus" NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "Command_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Environment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "concurrencyLimit" INTEGER NOT NULL,

    CONSTRAINT "Environment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentVariable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,

    CONSTRAINT "EnvironmentVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DockerImageConfig" (
    "id" TEXT NOT NULL,
    "dockerImage" TEXT NOT NULL,
    "startCommand" TEXT,
    "concurrency" "ConcurrencyMode" NOT NULL,
    "isLocalImage" BOOLEAN NOT NULL,

    CONSTRAINT "DockerImageConfig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_dockerImageConfigId_fkey" FOREIGN KEY ("dockerImageConfigId") REFERENCES "DockerImageConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentVariable" ADD CONSTRAINT "EnvironmentVariable_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
