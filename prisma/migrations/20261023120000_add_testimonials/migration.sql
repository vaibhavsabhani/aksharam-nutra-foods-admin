CREATE TABLE "Testimonial" (
    "id" SERIAL NOT NULL,
    "quote" TEXT NOT NULL,
    "author" VARCHAR(255) NOT NULL,
    "isShow" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Testimonial_authorId_idx" ON "Testimonial"("authorId");
CREATE INDEX "Testimonial_createdAt_idx" ON "Testimonial"("createdAt");

ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;