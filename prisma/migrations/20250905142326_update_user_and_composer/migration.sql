/*
  Warnings:

  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - Added the required column `search_name` to the `composers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."users_username_key";

-- AlterTable
ALTER TABLE "public"."composers" ADD COLUMN     "search_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "username";
