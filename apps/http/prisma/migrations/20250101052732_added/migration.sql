/*
  Warnings:

  - You are about to drop the `Rooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rooms" DROP CONSTRAINT "Rooms_mapId_fkey";

-- AlterTable
ALTER TABLE "Maps" ADD COLUMN     "rooms" TEXT[];

-- DropTable
DROP TABLE "Rooms";
