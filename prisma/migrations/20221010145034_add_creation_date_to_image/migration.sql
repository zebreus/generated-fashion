/*
  Warnings:

  - Added the required column `date` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN "date" TIMESTAMP(3) NULL;

UPDATE "Image" SET "date" = '2022-01-01 00:00:00-00';

ALTER TABLE "Image" ALTER COLUMN "date" SET NOT NULL;