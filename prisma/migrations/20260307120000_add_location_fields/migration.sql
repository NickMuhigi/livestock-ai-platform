-- AlterTable
ALTER TABLE "users"
ADD COLUMN     "district" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "analyses"
ADD COLUMN     "uploadDistrict" TEXT,
ADD COLUMN     "uploadLatitude" DOUBLE PRECISION,
ADD COLUMN     "uploadLongitude" DOUBLE PRECISION;
