/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacebookEngagement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacebookUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TiktokEngagement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TiktokUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "funnel_stage" AS ENUM ('top', 'bottom');

-- CreateEnum
CREATE TYPE "source" AS ENUM ('facebook', 'tiktok');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('male', 'female', 'non_binary');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_facebookEngagementId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_facebookUserId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_tiktokEngagementId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_tiktokUserId_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "FacebookEngagement";

-- DropTable
DROP TABLE "FacebookUser";

-- DropTable
DROP TABLE "TiktokEngagement";

-- DropTable
DROP TABLE "TiktokUser";

-- DropEnum
DROP TYPE "FunnelStage";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "Source";

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" "source" NOT NULL,
    "funnelStage" "funnel_stage" NOT NULL,
    "eventType" TEXT NOT NULL,
    "facebookUserId" TEXT,
    "tiktokUserId" TEXT,
    "facebookEngagementId" TEXT,
    "tiktokEngagementId" TEXT,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "gender" NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "facebook_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiktok_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,

    CONSTRAINT "tiktok_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_engagement" (
    "id" TEXT NOT NULL,
    "actionTime" TIMESTAMP(3) NOT NULL,
    "referrer" TEXT,
    "videoId" TEXT,
    "adId" TEXT,
    "campaignId" TEXT,
    "clickPosition" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "purchaseAmount" TEXT,

    CONSTRAINT "facebook_engagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiktok_engagement" (
    "id" TEXT NOT NULL,
    "watchTime" INTEGER,
    "percentageWatched" DOUBLE PRECISION,
    "device" TEXT,
    "country" TEXT,
    "videoId" TEXT,
    "actionTime" TIMESTAMP(3),
    "profileId" TEXT,
    "purchasedItem" TEXT,
    "purchaseAmount" TEXT,

    CONSTRAINT "tiktok_engagement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_facebookUserId_fkey" FOREIGN KEY ("facebookUserId") REFERENCES "facebook_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_tiktokUserId_fkey" FOREIGN KEY ("tiktokUserId") REFERENCES "tiktok_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_facebookEngagementId_fkey" FOREIGN KEY ("facebookEngagementId") REFERENCES "facebook_engagement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_tiktokEngagementId_fkey" FOREIGN KEY ("tiktokEngagementId") REFERENCES "tiktok_engagement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
