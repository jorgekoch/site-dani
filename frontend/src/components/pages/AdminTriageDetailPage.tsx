import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  archiveAdminTriage,
  getAdminTriage,
  restoreAdminTriage,
  updateAdminTriageInternalNotes,
  updateAdminTriageStatus,
  type TriageStatus,
} from "../../api/triageApi";
import { useAuth } from "../../auth/AuthContext";
import "./AdminPortal.css";
import { formatWhatsapp } from "../../utils/formatWhatsapp";

const statuses: TriageStatus[] = [
  "NEW",
  "IN_REVIEW",
  "ACCEPTED",
  "DECLINED",
  "COMPLETED",
];

const labels: Record<TriageStatus, string> = {
  NEW: "Nova",
  IN_REVIEW: "Em análise",
  ACCEPTED: "Aprovada",
  DECLINED: "Recusada",
  COMPLETED: "Concluída",
};

type AuditEntry = {
  id: string;
  action: string;
  details?: string | null;
  createdAt: string;
  actor?: {
    name?: string | null;
    role?: string | null;
  } | null;
};

function formatAuditDescription(entry: AuditEntry) {
  const action = entry.action;

  if (action === "TRIAGE_STATUS_CHANGED") {
    const details = (entry.details ?? "").trim();
    const statusMatch = details.match(/([A-Z_]+)\s*->\s*([A-Z_]+)/);

    if (statusMatch) {
      const from = labels[statusMatch[1] as TriageStatus] ?? statusMatch[1];
      const to = labels[statusMatch[2] as TriageStatus] ?? statusMatch[2];

      return `Status alterado de ${from} → ${to}`;
    }

    return details ? `Status alterado: ${details}` : "Status alterado";
  }

  if (action === "TRIAGE_INTERNAL_NOTES_UPDATED") {
    return "Observação interna atualizada";
  }

  if (action === "TRIAGE_ARCHIVED") {
    return "Ficha arquivada";
  }

  if (action === "TRIAGE_RESTORED") {
    return "Ficha restaurada do arquivo";
  }

  if (action === "ADMIN_USER_STATUS_CHANGED") {
    return entry.details || "Status de usuário alterado";
  }

  if (action === "ADMIN_USER_CREATED") {
    return entry.details || "Usuário criado";
  }

  if (action === "ADMIN_PASSWORD_RESET") {
    return entry.details || "Senha redefinida";
  }

  return entry.details || "Atualização registrada";
}

function getAuditActionLabel(entry: AuditEntry) {
  switch (entry.action) {
    case "TRIAGE_STATUS_CHANGED":
      return "Status";
    case "TRIAGE_INTERNAL_NOTES_UPDATED":
      return "Observação";
    case "TRIAGE_ARCHIVED":
      return "Arquivo";
    case "TRIAGE_RESTORED":
      return "Arquivo";
    case "ADMIN_USER_STATUS_CHANGED":
      return "Usuário";
    case "ADMIN_USER_CREATED":
      return "Cadastro";
    case "ADMIN_PASSWORD_RESET":
      return "Segurança";
    default:
      return "Sistema";
  }
}

function formatAuditDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatDisplayValue(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return "Não informado";
  }

  if (typeof value === "boolean") {
    return value ? "Sim" : "Não";
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ") || "Não informado";
  }

  return String(value);
}

function isMissingValue(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

export function AdminTriageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [internalNotes, setInternalNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSuccess, setNotesSuccess] = useState("");
  const [changingArchive, setChangingArchive] = useState(false);

  const { admin, logout } = useAuth();

  const triageId = id ?? "";

  useEffect(() => {
    if (!triageId) {
      setError("Ficha não encontrada.");
      setLoading(false);
      return;
    }

    getAdminTriage(triageId)
      .then((data) => {
        setItem(data);
        setInternalNotes(data.internalNotes ?? "");
      })
      .catch((e) =>
        setError(
          e instanceof Error ? e.message : "Não foi possível carregar a ficha.",
        ),
      )
      .finally(() => setLoading(false));
  }, [triageId]);

  async function change(status: TriageStatus) {
    if (item?.archivedAt) return;

    try {
      setError("");

      await updateAdminTriageStatus(triageId, status);
      const refreshed = await getAdminTriage(triageId);
      setItem(refreshed);
      setInternalNotes(refreshed.internalNotes ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível atualizar.");
    }
  }

  async function saveInternalNotes() {
    if (item?.archivedAt) return;

    try {
      setError("");
      setNotesSuccess("");
      setSavingNotes(true);

      const result = await updateAdminTriageInternalNotes(
        triageId,
        internalNotes,
      );

      const refreshed = await getAdminTriage(triageId);
      setInternalNotes(refreshed.internalNotes ?? "");
      setItem(refreshed);

      setNotesSuccess("Observação interna salva com sucesso.");
      if (result?.internalNotes !== undefined) {
        setInternalNotes(result.internalNotes ?? "");
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível salvar a observação.",
      );
    } finally {
      setSavingNotes(false);
    }
  }

  async function toggleArchive() {
    const isArchived = Boolean(item?.archivedAt);
    const confirmed = window.confirm(
      isArchived
        ? "Restaurar esta ficha? Ela voltará a aparecer na lista de triagens ativas."
        : "Arquivar esta ficha? Ela sairá da lista de triagens ativas e continuará disponível no Arquivo.",
    );

    if (!confirmed) return;

    try {
      setError("");
      setChangingArchive(true);

      if (isArchived) {
        await restoreAdminTriage(triageId);
      } else {
        await archiveAdminTriage(triageId);
      }

      const refreshed = await getAdminTriage(triageId);
      setItem(refreshed);
      setInternalNotes(refreshed.internalNotes ?? "");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível atualizar o arquivamento da ficha.",
      );
    } finally {
      setChangingArchive(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-shell">
          <p>Carregando ficha…</p>
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="admin-page">
        <div className="admin-shell">
          <p className="admin-error">{error || "Ficha não encontrada."}</p>

          <Link to="/admin/triagens">Voltar às triagens</Link>
        </div>
      </main>
    );
  }

  const groupedFields = [
    {
      title: "Dados pessoais",
      fields: [
        ["Nome completo", item.fullName],
        ["Idade", item.age],
        ["Profissão", item.profession],
        ["WhatsApp", formatWhatsapp(item.whatsapp)],
        ["Objetivo", item.treatmentReason === "INJURY_RECOVERY" ? "Recuperação de lesão" : "Manutenção da saúde"],
      ],
    },
    {
      title: "Queixa e dor",
      fields: [
        ["Queixa principal", item.mainComplaint],
        ["Local", item.painLocation],
        ["Nível da dor", item.painLevel ? `${item.painLevel}/10` : "Não informado"],
        ["Lesão", item.injuryDescription],
        ["Tempo da lesão", item.injuryDuration],
        ["Radiografia/irradiação", item.painRadiates ? item.painRadiatesWhere || "Sim" : "Não"],
      ],
    },
    {
      title: "Histórico médico",
      fields: [
        ["Encaminhamento médico", item.medicalReferral ? "Sim" : "Não"],
        ["Diagnóstico médico", item.medicalDiagnosis],
      ],
    },
    {
      title: "Atividade física",
      fields: [
        ["Pratica atividade física", item.physicalActivity ? "Sim" : "Não"],
        ["Tipo de atividade", item.physicalActivityType],
        ["Lesão esportiva", item.sportsInjury ? "Sim" : "Não"],
        ["Detalhes da lesão esportiva", item.sportsInjuryDetails],
      ],
    },
    {
      title: "Exames e cirurgias",
      fields: [
        ["Exames", item.complementaryExams ? "Sim" : "Não"],
        ["Detalhes dos exames", item.complementaryExamsDetails],
        ["Cirurgia", item.surgery ? "Sim" : "Não"],
        ["Detalhes da cirurgia", item.surgeryDetails],
        ["Implante metálico", item.metalImplant ? "Sim" : "Não"],
        ["Local do implante", item.metalImplantLocation],
      ],
    },
    {
      title: "Medicamentos",
      fields: [
        ["Medicamento", item.medication ? "Sim" : "Não"],
        ["Medicamento utilizado", item.medicationDetails],
      ],
    },
    {
      title: "Condições de saúde",
      fields: [
        ["Condições", item.healthConditions?.join(", ")],
        ["Informações adicionais", item.additionalHealthInfo],
      ],
    },
    {
      title: "Informações do paciente",
      fields: [
        ["Consentimento", item.consentAccepted ? "Sim" : "Não"],
        ["Recebida em", new Date(item.createdAt).toLocaleString("pt-BR")],
        ["Última atualização", new Date(item.updatedAt).toLocaleString("pt-BR")],
        ...(item.archivedAt
          ? [["Arquivada em", new Date(item.archivedAt).toLocaleString("pt-BR")]]
          : []),
      ],
    },
  ];

  const historyEntries = (item.auditLogs ?? []) as AuditEntry[];
  const isArchived = Boolean(item.archivedAt);

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-top">
          <div>
            <span className="admin-eyebrow">Portal administrativo</span>

            <h1>Ficha de triagem</h1>
          </div>

          <div className="admin-top-actions">
            <Link to="/admin/triagens">Triagens</Link>
            <Link to="/admin/arquivo">Arquivo</Link>

            {admin?.role === "ADMIN" && <Link to="/admin/usuarios">Usuários</Link>}

            <div className="admin-user">
              <strong>{admin?.name}</strong>

              <small>
                {admin?.role === "ADMIN" ? "Administrador" : "Equipe"}
              </small>
            </div>

            <button onClick={handleLogout}>Sair</button>
          </div>
        </div>

        <div className="admin-detail-head">
          <div>
            <span className="admin-eyebrow">
              {isArchived ? "Ficha arquivada" : "Ficha de triagem"}
            </span>

            <h1>{item.fullName}</h1>

            <p>
              {isArchived
                ? `Arquivada em ${new Date(item.archivedAt).toLocaleString("pt-BR")}`
                : `Recebida em ${new Date(item.createdAt).toLocaleString("pt-BR")}`}
            </p>
          </div>

          <select
            value={item.status}
            onChange={(e) => change(e.target.value as TriageStatus)}
            disabled={isArchived}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {labels[status]}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-detail-actions">
          <Link to={isArchived ? "/admin/arquivo" : "/admin/triagens"}>
            ← {isArchived ? "Voltar ao arquivo" : "Voltar às triagens"}
          </Link>
        </div>

        <section className="admin-detail-sections">
          {groupedFields.map((section) => {
            const visibleFields = section.fields.filter(
              ([, value]) =>
                value !== undefined && value !== null && value !== "",
            );

            if (!visibleFields.length) return null;

            return (
              <article key={section.title} className="admin-detail-section">
                <div className="admin-detail-section-header">
                  <h2>{section.title}</h2>
                </div>

                <div className="admin-detail-grid">
                  {visibleFields.map(([label, value]) => {
                    const displayValue = formatDisplayValue(value);
                    const missing = isMissingValue(value);

                    return (
                      <div
                        key={`${section.title}-${label}`}
                        className={`admin-detail-item ${missing ? "is-empty" : ""}`}
                      >
                        <small>{label}</small>

                        {label === "WhatsApp" && !missing ? (
                          <p>
                            <a
                              href={`https://wa.me/${String(item.whatsapp).replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {displayValue}
                            </a>
                          </p>
                        ) : (
                          <p>{displayValue}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>

        <details className="admin-history-panel admin-history-accordion">
          <summary className="admin-history-summary">
            <div>
              <span className="admin-eyebrow">Registro de atividades</span>
              <h2>Histórico de alterações</h2>
              <p>
                {historyEntries.length === 0
                  ? "Nenhuma alteração registrada."
                  : `${historyEntries.length} ${historyEntries.length === 1 ? "registro" : "registros"} nesta ficha.`}
              </p>
            </div>

            <span className="admin-history-toggle" aria-hidden="true">
              <span>Ver histórico</span>
              <span className="admin-history-chevron">⌄</span>
            </span>
          </summary>

          <div className="admin-history-body">
            {historyEntries.length ? (
              <div className="admin-history-list">
                {historyEntries.map((entry) => (
                  <div key={entry.id} className="admin-history-item">
                    <div className="admin-history-date">
                      <span>{formatAuditDateTime(entry.createdAt)}</span>
                    </div>

                    <div className="admin-history-content">
                      <span className="admin-history-tag">
                        {getAuditActionLabel(entry)}
                      </span>

                      <strong>{formatAuditDescription(entry)}</strong>

                      <span>
                        {entry.actor?.name
                          ? `por ${entry.actor.name}${entry.actor?.role ? ` (${entry.actor.role === "ADMIN" ? "Administrador" : "Equipe"})` : ""}`
                          : "por administrador"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-empty-copy">Ainda não há alterações registradas.</p>
            )}
          </div>
        </details>

        <section className="admin-internal-notes">
          <div className="admin-internal-notes-header">
            <div>
              <span className="admin-eyebrow">Uso interno</span>

              <h2>Observações internas</h2>

              <p>
                {isArchived
                  ? "A ficha está arquivada. Restaure-a para editar as observações."
                  : "Visível apenas para a equipe administrativa."}
              </p>
            </div>
          </div>

          <textarea
            value={internalNotes}
            onChange={(event) => {
              setInternalNotes(event.target.value);
              setNotesSuccess("");
            }}
            placeholder="Adicione uma observação sobre esta ficha..."
            maxLength={5000}
            disabled={savingNotes || isArchived}
          />

          <div className="admin-internal-notes-footer">
            <small>{internalNotes.length}/5000</small>

            <button
              type="button"
              onClick={saveInternalNotes}
              disabled={savingNotes || isArchived}
            >
              {savingNotes ? "Salvando…" : "Salvar observação"}
            </button>
          </div>

          {notesSuccess && (
            <p className="admin-success" role="status">
              {notesSuccess}
            </p>
          )}
        </section>

        {admin?.role === "ADMIN" && (
          <section className={`admin-archive-action ${isArchived ? "is-archived" : ""}`}>
            <div className="admin-archive-action-copy">
              <span className="admin-eyebrow">
                {isArchived ? "Ficha arquivada" : "Organização da ficha"}
              </span>

              <h2>{isArchived ? "Restaurar ao fluxo ativo" : "Arquivar esta ficha"}</h2>

              <p>
                {isArchived
                  ? "Ao restaurar, a ficha volta para a lista principal de triagens e poderá receber novas atualizações."
                  : "Use o arquivo quando esta ficha não precisar mais permanecer na fila ativa. Todo o histórico e os dados serão preservados."}
              </p>
            </div>

            <button
              className="admin-archive-action-button"
              type="button"
              onClick={toggleArchive}
              disabled={changingArchive}
            >
              <span>
                {changingArchive
                  ? "Processando…"
                  : isArchived
                    ? "Restaurar ficha"
                    : "Arquivar ficha"}
              </span>
              {!changingArchive && (
                <small>{isArchived ? "Retornar para triagens" : "Mover para o arquivo"}</small>
              )}
            </button>
          </section>
        )}

        {error && <p className="admin-error">{error}</p>}
      </div>
    </main>
  );
}
