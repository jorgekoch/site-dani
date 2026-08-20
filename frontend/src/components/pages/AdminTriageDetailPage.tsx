import { useEffect, useState } from "react";
import {
  getAdminTriage,
  updateAdminTriageStatus,
  type TriageStatus,
} from "../../api/triageApi";
import "./AdminPortal.css";

const statuses = ["NEW", "IN_REVIEW", "ACCEPTED", "DECLINED", "COMPLETED"];
const labels: Record<string, string> = {
  NEW: "Nova",
  IN_REVIEW: "Em análise",
  ACCEPTED: "Aprovada",
  DECLINED: "Recusada",
  COMPLETED: "Concluída",
};

export function AdminTriageDetailPage({ id }: { id: string }) {
  const [item, setItem] = useState<any>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    getAdminTriage(id)
      .then(setItem)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);
  async function change(status: TriageStatus) {
    try {
      const next = await updateAdminTriageStatus(id, status);
      setItem(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível atualizar.");
    }
  }
  if (loading)
    return (
      <main className="admin-page">
        <div className="admin-shell">Carregando ficha…</div>
      </main>
    );
  if (error || !item)
    return (
      <main className="admin-page">
        <div className="admin-shell">
          <p className="admin-error">{error || "Ficha não encontrada."}</p>
          <a href="/admin/triagens">Voltar</a>
        </div>
      </main>
    );
  const fields = [
    ["Nome completo", item.fullName],
    ["Idade", item.age],
    ["Profissão", item.profession],
    ["WhatsApp", item.whatsapp],
    [
      "Objetivo",
      item.treatmentReason === "INJURY_RECOVERY"
        ? "Recuperação de lesão"
        : "Manutenção da saúde",
    ],
    ["Queixa principal", item.mainComplaint],
    ["Local", item.painLocation],
    ["Nível da dor", item.painLevel ? `${item.painLevel}/10` : "Não informado"],
    ["Lesão", item.injuryDescription],
    ["Tempo da lesão", item.injuryDuration],
    ["Encaminhamento médico", item.medicalReferral ? "Sim" : "Não"],
    ["Diagnóstico médico", item.medicalDiagnosis],
    ["Atividade física", item.physicalActivity ? "Sim" : "Não"],
    ["Atividade", item.physicalActivityType],
    ["Lesão esportiva", item.sportsInjury ? "Sim" : "Não"],
    ["Detalhes da lesão esportiva", item.sportsInjuryDetails],
    ["Exames", item.complementaryExams ? "Sim" : "Não"],
    ["Detalhes dos exames", item.complementaryExamsDetails],
    ["Cirurgia", item.surgery ? "Sim" : "Não"],
    ["Detalhes da cirurgia", item.surgeryDetails],
    ["Implante metálico", item.metalImplant ? "Sim" : "Não"],
    ["Local do implante", item.metalImplantLocation],
    ["Medicamento", item.medication ? "Sim" : "Não"],
    ["Medicamento utilizado", item.medicationDetails],
    ["Condições de saúde", item.healthConditions?.join(", ")],
    ["Informações adicionais", item.additionalHealthInfo],
  ];
  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-top">
          <a href="/admin/triagens">← Voltar às triagens</a>
          <a
            href={`https://wa.me/${String(item.whatsapp).replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
        <div className="admin-detail-head">
          <div>
            <span className="admin-eyebrow">Ficha de triagem</span>
            <h1>{item.fullName}</h1>
            <p>
              Recebida em {new Date(item.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>
          <select
            value={item.status}
            onChange={(e) => change(e.target.value as TriageStatus)}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {labels[s]}
              </option>
            ))}
          </select>
        </div>
        <section className="admin-detail-grid">
          {fields
            .filter(
              ([, value]) =>
                value !== undefined && value !== null && value !== "",
            )
            .map(([label, value]) => (
              <article key={label}>
                <small>{label}</small>
                <p>{String(value)}</p>
              </article>
            ))}
        </section>
        {error && <p className="admin-error">{error}</p>}
      </div>
    </main>
  );
}
