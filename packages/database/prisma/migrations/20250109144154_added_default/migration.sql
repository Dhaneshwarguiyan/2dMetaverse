/*
  Warnings:

  - A unique constraint covering the columns `[visitedRooms]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "visitedRooms" SET DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "User_visitedRooms_key" ON "User"("visitedRooms");
