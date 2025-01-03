-- CreateEnum
CREATE TYPE "AnimationKeys" AS ENUM ('left', 'right', 'up', 'down');

-- CreateTable
CREATE TABLE "SpriteAssets" (
    "key" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "frameWidth" INTEGER NOT NULL,
    "frameHeight" INTEGER NOT NULL,

    CONSTRAINT "SpriteAssets_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Sprites" (
    "id" SERIAL NOT NULL,
    "initialState" INTEGER NOT NULL,
    "key" INTEGER NOT NULL,

    CONSTRAINT "Sprites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpriteAnimations" (
    "id" SERIAL NOT NULL,
    "key" "AnimationKeys" NOT NULL,
    "frames" INTEGER[],
    "spriteId" INTEGER NOT NULL,

    CONSTRAINT "SpriteAnimations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sprites" ADD CONSTRAINT "Sprites_key_fkey" FOREIGN KEY ("key") REFERENCES "SpriteAssets"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpriteAnimations" ADD CONSTRAINT "SpriteAnimations_spriteId_fkey" FOREIGN KEY ("spriteId") REFERENCES "Sprites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
