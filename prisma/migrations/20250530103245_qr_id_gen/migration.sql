/*
  Warnings:

  - A unique constraint covering the columns `[qr_id]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "qr_id" SERIAL NOT NULL;

-- CreateTable
CREATE TABLE "id_generators" (
    "acedemic_year_id" INTEGER NOT NULL,
    "qr_couter" INTEGER NOT NULL DEFAULT 0,
    "uni_id_couter" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "id_generators_pkey" PRIMARY KEY ("acedemic_year_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_qr_id_key" ON "students"("qr_id");

-- AddForeignKey
ALTER TABLE "id_generators" ADD CONSTRAINT "id_generators_acedemic_year_id_fkey" FOREIGN KEY ("acedemic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
