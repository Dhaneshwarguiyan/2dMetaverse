/*
  Warnings:

  - Added the required column `tileSet` to the `Maps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Maps" ADD COLUMN     "tileSet" TEXT NOT NULL;
