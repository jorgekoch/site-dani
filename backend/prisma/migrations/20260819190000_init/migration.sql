CREATE TYPE "TriageStatus" AS ENUM ('NEW', 'IN_REVIEW', 'ACCEPTED', 'DECLINED', 'COMPLETED');
CREATE TYPE "TreatmentReason" AS ENUM ('INJURY_RECOVERY', 'HEALTH_MAINTENANCE');

CREATE TABLE "TriageSubmission" (
  "id" TEXT NOT NULL,
  "status" "TriageStatus" NOT NULL DEFAULT 'NEW',
  "fullName" TEXT NOT NULL,
  "age" INTEGER NOT NULL,
  "profession" TEXT NOT NULL,
  "whatsapp" TEXT NOT NULL,
  "treatmentReason" "TreatmentReason" NOT NULL,
  "injuryDescription" TEXT,
  "injuryDuration" TEXT,
  "medicalReferral" BOOLEAN NOT NULL,
  "medicalDiagnosis" TEXT,
  "mainComplaint" TEXT NOT NULL,
  "painLocation" TEXT NOT NULL,
  "painRadiates" BOOLEAN,
  "painRadiatesWhere" TEXT,
  "painLevel" INTEGER,
  "physicalActivity" BOOLEAN NOT NULL,
  "physicalActivityType" TEXT,
  "sportsInjury" BOOLEAN,
  "sportsInjuryDetails" TEXT,
  "complementaryExams" BOOLEAN NOT NULL,
  "complementaryExamsDetails" TEXT,
  "surgery" BOOLEAN NOT NULL,
  "surgeryDetails" TEXT,
  "metalImplant" BOOLEAN NOT NULL,
  "metalImplantLocation" TEXT,
  "medication" BOOLEAN NOT NULL,
  "medicationDetails" TEXT,
  "healthConditions" TEXT[] NOT NULL,
  "additionalHealthInfo" TEXT,
  "consentAccepted" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "TriageSubmission_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TriageSubmission_status_createdAt_idx" ON "TriageSubmission"("status", "createdAt");
CREATE INDEX "TriageSubmission_whatsapp_idx" ON "TriageSubmission"("whatsapp");
