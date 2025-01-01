/*
  Warnings:

  - You are about to drop the column `rooms` on the `Maps` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Maps" DROP COLUMN "rooms";

-- CreateTable
CREATE TABLE "Rooms" (
    "id" SERIAL NOT NULL,
    "room" TEXT NOT NULL,
    "mapId" INTEGER NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_room_key" ON "Rooms"("room");

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Maps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
