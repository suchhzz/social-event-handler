/*
  Warnings:

  - The primary key for the `facebook_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `city` on the `facebook_user` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `facebook_user` table. All the data in the column will be lost.
  - The `id` column on the `facebook_user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `facebook_engagement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tiktok_engagement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tiktok_user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `facebook_user` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `gender` on the `facebook_user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
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

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_facebookEngagementId_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_facebookUserId_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_tiktokEngagementId_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_tiktokUserId_fkey";

-- AlterTable
ALTER TABLE "facebook_user" DROP CONSTRAINT "facebook_user_pkey",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD CONSTRAINT "facebook_user_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "event";

-- DropTable
DROP TABLE "facebook_engagement";

-- DropTable
DROP TABLE "tiktok_engagement";

-- DropTable
DROP TABLE "tiktok_user";

-- DropEnum
DROP TYPE "funnel_stage";

-- DropEnum
DROP TYPE "gender";

-- DropEnum
DROP TYPE "source";

-- CreateTable
CREATE TABLE "facebook_user_location" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "facebook_user_location_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "facebook_user_location_userId_key" ON "facebook_user_location"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_engagement_top_eventId_key" ON "facebook_engagement_top"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_engagement_bottom_eventId_key" ON "facebook_engagement_bottom"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_event_eventId_key" ON "facebook_event"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_user_userId_key" ON "facebook_user"("userId");

-- AddForeignKey
ALTER TABLE "facebook_user_location" ADD CONSTRAINT "facebook_user_location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "facebook_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_engagement_top" ADD CONSTRAINT "facebook_engagement_top_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "facebook_event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_engagement_bottom" ADD CONSTRAINT "facebook_engagement_bottom_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "facebook_event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_event" ADD CONSTRAINT "facebook_event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "facebook_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
