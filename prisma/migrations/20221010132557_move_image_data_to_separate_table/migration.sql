/*
  Warnings:

  - You are about to drop the column `imageData` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `imageMimeType` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "imageData",
DROP COLUMN "imageMimeType",
ADD COLUMN     "imageDataId" INTEGER;

-- CreateTable
CREATE TABLE "ImageData" (
    "id" SERIAL NOT NULL,
    "data" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,

    CONSTRAINT "ImageData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_imageDataId_fkey" FOREIGN KEY ("imageDataId") REFERENCES "ImageData"("id") ON DELETE SET NULL ON UPDATE CASCADE;
