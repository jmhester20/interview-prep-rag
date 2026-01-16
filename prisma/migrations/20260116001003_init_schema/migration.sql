-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('RESUME', 'JOB_POST', 'NOTES');

-- CreateTable
CREATE TABLE "PrepPack" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrepPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "prepPackId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "filename" TEXT,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Document_prepPackId_idx" ON "Document"("prepPackId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_prepPackId_fkey" FOREIGN KEY ("prepPackId") REFERENCES "PrepPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
