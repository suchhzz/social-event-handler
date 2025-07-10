-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('top', 'bottom');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('facebook', 'tiktok');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'non_binary');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" "Source" NOT NULL,
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" TEXT NOT NULL,
    "facebookUserId" TEXT,
    "tiktokUserId" TEXT,
    "facebookEngagementId" TEXT,
    "tiktokEngagementId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "FacebookUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiktokUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,

    CONSTRAINT "TiktokUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookEngagement" (
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

    CONSTRAINT "FacebookEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiktokEngagement" (
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

    CONSTRAINT "TiktokEngagement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_facebookUserId_fkey" FOREIGN KEY ("facebookUserId") REFERENCES "FacebookUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tiktokUserId_fkey" FOREIGN KEY ("tiktokUserId") REFERENCES "TiktokUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_facebookEngagementId_fkey" FOREIGN KEY ("facebookEngagementId") REFERENCES "FacebookEngagement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tiktokEngagementId_fkey" FOREIGN KEY ("tiktokEngagementId") REFERENCES "TiktokEngagement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
