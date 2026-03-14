/*
  Warnings:

  - A unique constraint covering the columns `[websiteId,endedAt]` on the table `Incident` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Incident_websiteId_endedAt_key" ON "public"."Incident"("websiteId", "endedAt");
