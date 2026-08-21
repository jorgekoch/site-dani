import { apiRequest } from "./http";

export type TriageSubmission = {
  fullName: string;
  age: number;
  profession: string;
  whatsapp: string;

  treatmentReason: "INJURY_RECOVERY" | "HEALTH_MAINTENANCE";

  injuryDescription?: string;
  injuryDuration?: string;

  medicalReferral: boolean;
  medicalDiagnosis?: string;

  mainComplaint: string;
  painLocation: string;

  painRadiates?: boolean;
  painRadiatesWhere?: string;
  painLevel?: number;

  physicalActivity: boolean;
  physicalActivityType?: string;

  sportsInjury?: boolean;
  sportsInjuryDetails?: string;

  complementaryExams: boolean;
  complementaryExamsDetails?: string;

  surgery: boolean;
  surgeryDetails?: string;

  metalImplant: boolean;
  metalImplantLocation?: string;

  medication: boolean;
  medicationDetails?: string;

  healthConditions: string[];
  additionalHealthInfo?: string;
  internalNotes?: string;

  consentAccepted: boolean;
};

export type TriageStatus =
  | "NEW"
  | "IN_REVIEW"
  | "ACCEPTED"
  | "DECLINED"
  | "COMPLETED";

export async function submitTriage(data: TriageSubmission) {
  return apiRequest<{
    id: string;
    status: TriageStatus;
    message: string;
  }>("/api/triage", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function listAdminTriages(status?: TriageStatus) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";

  return apiRequest<
    Array<{
      id: string;
      status: TriageStatus;
      fullName: string;
      age: number;
      profession: string;
      whatsapp: string;
      mainComplaint: string;
      painLocation: string;
      painLevel: number | null;
      treatmentReason: "INJURY_RECOVERY" | "HEALTH_MAINTENANCE";
      createdAt: string;
      updatedAt: string;
    }>
  >(`/api/admin/triage${query}`);
}

export async function getAdminTriage(id: string) {
  return apiRequest<
    TriageSubmission & {
      id: string;
      status: TriageStatus;
      createdAt: string;
      updatedAt: string;
    }
  >(`/api/admin/triage/${id}`);
}

export async function updateAdminTriageStatus(
  id: string,
  status: TriageStatus,
) {
  return apiRequest<{
    id: string;
    status: TriageStatus;
    fullName: string;
    age: number;
    profession: string;
    whatsapp: string;
    treatmentReason: "INJURY_RECOVERY" | "HEALTH_MAINTENANCE";
    injuryDescription: string | null;
    injuryDuration: string | null;
    medicalReferral: boolean;
    medicalDiagnosis: string | null;
    mainComplaint: string;
    painLocation: string;
    painRadiates: boolean | null;
    painRadiatesWhere: string | null;
    painLevel: number | null;
    physicalActivity: boolean;
    physicalActivityType: string | null;
    sportsInjury: boolean | null;
    sportsInjuryDetails: string | null;
    complementaryExams: boolean;
    complementaryExamsDetails: string | null;
    surgery: boolean;
    surgeryDetails: string | null;
    metalImplant: boolean;
    metalImplantLocation: string | null;
    medication: boolean;
    medicationDetails: string | null;
    healthConditions: string[];
    additionalHealthInfo: string | null;
    consentAccepted: boolean;
    createdAt: string;
    updatedAt: string;
  }>(`/api/admin/triage/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function updateAdminTriageInternalNotes(
  id: string,
  internalNotes: string,
) {
  return apiRequest<{
    id: string;
    internalNotes: string | null;
  }>(`/api/admin/triage/${id}/internal-notes`, {
    method: "PATCH",
    body: JSON.stringify({ internalNotes }),
  });
}