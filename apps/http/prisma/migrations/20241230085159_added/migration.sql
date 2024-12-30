-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lastName" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Maps" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "room" TEXT NOT NULL,

    CONSTRAINT "Maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapLayers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,
    "mapId" INTEGER NOT NULL,

    CONSTRAINT "MapLayers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapAssets" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mapId" INTEGER NOT NULL,

    CONSTRAINT "MapAssets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Maps_name_key" ON "Maps"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Maps_room_key" ON "Maps"("room");

-- CreateIndex
CREATE UNIQUE INDEX "MapAssets_path_key" ON "MapAssets"("path");

-- CreateIndex
CREATE UNIQUE INDEX "MapAssets_name_key" ON "MapAssets"("name");

-- AddForeignKey
ALTER TABLE "MapLayers" ADD CONSTRAINT "MapLayers_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Maps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapAssets" ADD CONSTRAINT "MapAssets_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Maps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
