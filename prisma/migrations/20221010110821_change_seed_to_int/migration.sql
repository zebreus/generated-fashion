/*
  Warnings:

  - Changed the type of `seed` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "seed",
ADD COLUMN "seed" INTEGER NULL;

UPDATE "Image" SET seed = 0;

ALTER TABLE "Image" ALTER COLUMN "seed" SET NOT NULL;
