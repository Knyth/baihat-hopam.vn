/*
  Warnings:

  - Made the column `search_name` on table `Composer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Composer" ALTER COLUMN "search_name" SET NOT NULL;
