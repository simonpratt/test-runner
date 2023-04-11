/*
  Warnings:

  - You are about to drop the column `name` on the `DockerImageConfig` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Command" DROP CONSTRAINT "Command_jobId_fkey";

-- AlterTable
ALTER TABLE "DockerImageConfig" DROP COLUMN "name",
ALTER COLUMN "startCommand" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
