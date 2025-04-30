-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('M', 'F');

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "gender" "GenderType",
ADD COLUMN     "image" TEXT DEFAULT 'https://randomuser.me/api/portraits/men/54.jpg';

-- AlterTable
ALTER TABLE "instructors" ADD COLUMN     "gender" "GenderType",
ADD COLUMN     "image" TEXT DEFAULT 'https://randomuser.me/api/portraits/men/91.jpg';

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "gender" "GenderType",
ADD COLUMN     "image" TEXT DEFAULT 'https://randomuser.me/api/portraits/men/73.jpg';
