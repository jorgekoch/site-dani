-- AlterTable
ALTER TABLE "TriageSubmission" ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "TriageSubmission_archivedAt_createdAt_idx" ON "TriageSubmission"("archivedAt", "createdAt");
