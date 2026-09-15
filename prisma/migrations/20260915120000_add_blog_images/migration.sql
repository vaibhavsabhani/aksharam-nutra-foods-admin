-- BlogPost may already exist in databases created before it was added to migration history.
CREATE TABLE IF NOT EXISTS "BlogPost" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "isShow" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "coverImageUrl" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "isShow" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS "BlogPost_authorId_idx" ON "BlogPost"("authorId");
CREATE INDEX IF NOT EXISTS "BlogPost_createdAt_idx" ON "BlogPost"("createdAt");
CREATE INDEX IF NOT EXISTS "BlogPost_isShow_idx" ON "BlogPost"("isShow");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'BlogPost_authorId_fkey'
    ) THEN
        ALTER TABLE "BlogPost"
        ADD CONSTRAINT "BlogPost_authorId_fkey"
        FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
