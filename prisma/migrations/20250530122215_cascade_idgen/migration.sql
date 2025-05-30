-- DropForeignKey
ALTER TABLE "id_generators" DROP CONSTRAINT "id_generators_acedemic_year_id_fkey";

-- AddForeignKey
ALTER TABLE "id_generators" ADD CONSTRAINT "id_generators_acedemic_year_id_fkey" FOREIGN KEY ("acedemic_year_id") REFERENCES "academic_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;
