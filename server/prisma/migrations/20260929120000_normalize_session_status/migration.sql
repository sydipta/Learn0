UPDATE "Session" SET "status" = 'upcoming' WHERE "status" = 'Upcoming';

ALTER TABLE "Session" ALTER COLUMN "status" SET DEFAULT 'upcoming';