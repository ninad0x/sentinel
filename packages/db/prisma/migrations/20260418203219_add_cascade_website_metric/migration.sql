-- DropForeignKey
ALTER TABLE "public"."WebsiteMetric" DROP CONSTRAINT "WebsiteMetric_websiteId_fkey";

-- AddForeignKey
ALTER TABLE "public"."WebsiteMetric" ADD CONSTRAINT "WebsiteMetric_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "public"."Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
