/*
  Warnings:

  - You are about to drop the column `finalStatus` on the `WebsiteMetric` table. All the data in the column will be lost.
  - You are about to drop the column `regionsDownCount` on the `WebsiteMetric` table. All the data in the column will be lost.
  - You are about to drop the column `regionsDownList` on the `WebsiteMetric` table. All the data in the column will be lost.
  - You are about to drop the column `windowEnd` on the `WebsiteMetric` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[websiteId,regionId,windowStart]` on the table `WebsiteMetric` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[websiteId,regionId,roundAt]` on the table `WebsiteTick` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `checks` to the `WebsiteMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `failures` to the `WebsiteMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roundAt` to the `WebsiteTick` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Incident_websiteId_endedAt_key";

-- AlterTable
ALTER TABLE "public"."WebsiteMetric" DROP COLUMN "finalStatus",
DROP COLUMN "regionsDownCount",
DROP COLUMN "regionsDownList",
DROP COLUMN "windowEnd",
ADD COLUMN     "checks" INTEGER NOT NULL,
ADD COLUMN     "failures" INTEGER NOT NULL,
ADD COLUMN     "maxMs" INTEGER,
ADD COLUMN     "minMs" INTEGER,
ADD COLUMN     "p50Ms" INTEGER,
ADD COLUMN     "p95Ms" INTEGER,
ADD COLUMN     "p99Ms" INTEGER,
ADD COLUMN     "regionId" TEXT NOT NULL DEFAULT 'ALL';

-- AlterTable
ALTER TABLE "public"."WebsiteTick" ADD COLUMN     "roundAt" TIMESTAMPTZ NOT NULL,
ALTER COLUMN "responseTimeMs" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Incident_websiteId_startedAt_idx" ON "public"."Incident"("websiteId", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "public"."Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteMetric_websiteId_regionId_windowStart_key" ON "public"."WebsiteMetric"("websiteId", "regionId", "windowStart");

-- CreateIndex
CREATE INDEX "WebsiteTick_roundAt_idx" ON "public"."WebsiteTick"("roundAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteTick_websiteId_regionId_roundAt_key" ON "public"."WebsiteTick"("websiteId", "regionId", "roundAt");
