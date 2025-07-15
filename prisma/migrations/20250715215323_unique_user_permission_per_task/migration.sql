/*
  Warnings:

  - A unique constraint covering the columns `[taskId,userId]` on the table `TaskPermission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TaskPermission_taskId_userId_permission_key";

-- CreateIndex
CREATE UNIQUE INDEX "TaskPermission_taskId_userId_key" ON "TaskPermission"("taskId", "userId");
