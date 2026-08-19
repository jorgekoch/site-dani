import { z } from 'zod'

export const treatmentReasonSchema = z.enum(['INJURY_RECOVERY', 'HEALTH_MAINTENANCE'])

export const triageSubmissionSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  age: z.number().int().min(1).max(120),
  profession: z.string().trim().min(2).max(120),
  whatsapp: z.string().trim().min(8).max(30),
  treatmentReason: treatmentReasonSchema,
  injuryDescription: z.string().trim().max(2000).optional(),
  injuryDuration: z.string().trim().max(200).optional(),
  medicalReferral: z.boolean(),
  medicalDiagnosis: z.string().trim().max(1000).optional(),
  mainComplaint: z.string().trim().min(2).max(3000),
  painLocation: z.string().trim().min(2).max(500),
  painRadiates: z.boolean().optional(),
  painRadiatesWhere: z.string().trim().max(500).optional(),
  painLevel: z.number().int().min(1).max(10).optional(),
  physicalActivity: z.boolean(),
  physicalActivityType: z.string().trim().max(500).optional(),
  sportsInjury: z.boolean().optional(),
  sportsInjuryDetails: z.string().trim().max(1000).optional(),
  complementaryExams: z.boolean(),
  complementaryExamsDetails: z.string().trim().max(1000).optional(),
  surgery: z.boolean(),
  surgeryDetails: z.string().trim().max(1000).optional(),
  metalImplant: z.boolean(),
  metalImplantLocation: z.string().trim().max(500).optional(),
  medication: z.boolean(),
  medicationDetails: z.string().trim().max(1000).optional(),
  healthConditions: z.array(z.string().trim().min(1).max(160)).max(30),
  additionalHealthInfo: z.string().trim().max(3000).optional(),
  consentAccepted: z.literal(true),
})

export const triageStatusSchema = z.enum(['NEW', 'IN_REVIEW', 'ACCEPTED', 'DECLINED', 'COMPLETED'])

export const triageStatusUpdateSchema = z.object({
  status: triageStatusSchema,
})

export type TriageSubmissionInput = z.infer<typeof triageSubmissionSchema>
