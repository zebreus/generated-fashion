-- CreateEnum
CREATE TYPE "ReplicateState" AS ENUM ('starting', 'processing', 'succeeded', 'failed', 'canceled');

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "replicateId" TEXT NOT NULL,
    "replicateState" "ReplicateState" NOT NULL,
    "imageData" BYTEA,
    "prompt" TEXT NOT NULL,
    "seed" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_replicateId_key" ON "Image"("replicateId");
