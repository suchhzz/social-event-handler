-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('top', 'bottom');

-- CreateEnum
CREATE TYPE "FacebookTopEventType" AS ENUM ('ad_view', 'page_like', 'comment', 'video_view');

-- CreateEnum
CREATE TYPE "FacebookBottomEventType" AS ENUM ('ad_click', 'form_submission', 'checkout_complete');

-- CreateEnum
CREATE TYPE "FacebookEventType" AS ENUM ('ad_view', 'page_like', 'comment', 'video_view', 'ad_click', 'form_submission', 'checkout_complete');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'non_binary');

-- CreateEnum
CREATE TYPE "Referrer" AS ENUM ('newsfeed', 'marketplace', 'groups');

-- CreateEnum
CREATE TYPE "ClickPosition" AS ENUM ('top_left', 'bottom_right', 'center');

-- CreateEnum
CREATE TYPE "Device" AS ENUM ('mobile', 'desktop');

-- CreateEnum
CREATE TYPE "Browser" AS ENUM ('Chrome', 'Firefox', 'Safari');

-- CreateEnum
CREATE TYPE "TiktokTopEventType" AS ENUM ('video_view', 'like', 'share', 'comment');

-- CreateEnum
CREATE TYPE "TiktokBottomEventType" AS ENUM ('profile_visit', 'purchase', 'follow');

-- CreateEnum
CREATE TYPE "TiktokEventType" AS ENUM ('video_view', 'like', 'share', 'comment', 'profile_visit', 'purchase', 'follow');

-- CreateEnum
CREATE TYPE "TiktokDevice" AS ENUM ('Android', 'iOS', 'Desktop');

-- CreateTable
CREATE TABLE "facebook_user_location" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "facebook_user_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_user" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,

    CONSTRAINT "facebook_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_engagement_top" (
    "id" SERIAL NOT NULL,
    "actionTime" TIMESTAMP(3) NOT NULL,
    "referrer" "Referrer" NOT NULL,
    "videoId" TEXT,
    "eventId" INTEGER,

    CONSTRAINT "facebook_engagement_top_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_engagement_bottom" (
    "id" SERIAL NOT NULL,
    "adId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "clickPosition" "ClickPosition" NOT NULL,
    "device" "Device" NOT NULL,
    "browser" "Browser" NOT NULL,
    "purchaseAmount" TEXT,
    "eventId" INTEGER,

    CONSTRAINT "facebook_engagement_bottom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_event" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'facebook',
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" "FacebookEventType" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "facebook_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiktok_user" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,

    CONSTRAINT "tiktok_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiktok_engagement_top" (
    "id" SERIAL NOT NULL,
    "watchTime" INTEGER NOT NULL,
    "percentageWatched" DOUBLE PRECISION NOT NULL,
    "device" "TiktokDevice" NOT NULL,
    "country" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "eventId" INTEGER,

    CONSTRAINT "tiktok_engagement_top_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiktok_engagement_bottom" (
    "id" SERIAL NOT NULL,
    "actionTime" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT,
    "purchasedItem" TEXT,
    "purchaseAmount" TEXT,
    "eventId" INTEGER,

    CONSTRAINT "tiktok_engagement_bottom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiktok_event" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'tiktok',
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" "TiktokEventType" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "tiktok_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facebook_user_location_userId_key" ON "facebook_user_location"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_user_userId_key" ON "facebook_user"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_engagement_top_eventId_key" ON "facebook_engagement_top"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_engagement_bottom_eventId_key" ON "facebook_engagement_bottom"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_event_eventId_key" ON "facebook_event"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "tiktok_user_userId_key" ON "tiktok_user"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tiktok_engagement_top_eventId_key" ON "tiktok_engagement_top"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "tiktok_engagement_bottom_eventId_key" ON "tiktok_engagement_bottom"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "tiktok_event_eventId_key" ON "tiktok_event"("eventId");

-- AddForeignKey
ALTER TABLE "facebook_user_location" ADD CONSTRAINT "facebook_user_location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "facebook_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_engagement_top" ADD CONSTRAINT "facebook_engagement_top_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "facebook_event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_engagement_bottom" ADD CONSTRAINT "facebook_engagement_bottom_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "facebook_event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_event" ADD CONSTRAINT "facebook_event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "facebook_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiktok_engagement_top" ADD CONSTRAINT "tiktok_engagement_top_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tiktok_event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiktok_engagement_bottom" ADD CONSTRAINT "tiktok_engagement_bottom_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tiktok_event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiktok_event" ADD CONSTRAINT "tiktok_event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tiktok_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
