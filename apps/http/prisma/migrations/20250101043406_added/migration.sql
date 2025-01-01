/*
  Warnings:

  - You are about to drop the column `room` on the `Maps` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Maps_room_key";

-- AlterTable
ALTER TABLE "Maps" DROP COLUMN "room";

-- CreateTable
CREATE TABLE "Rooms" (
    "id" SERIAL NOT NULL,
    "room" TEXT NOT NULL,
    "mapId" INTEGER NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Maps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
