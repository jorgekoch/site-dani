import { useEffect, useMemo, useState } from "react";

import { adminLogout } from "../../api/authApi";

import {
  listAdminTriages,
  updateAdminTriageStatus,
  type TriageStatus,
} from "../../api/triageApi";

import "./AdminPortal.css";

const statuses: TriageStatus[] = [
  "NEW",
  "IN_REVIEW",
  "ACCEPTED",
  "DECLINED",
  "COMPLETED",
];

type FilterStatus = TriageStatus | "";

const labels: Record<TriageStatus, string> = {
  NEW: "Nova",
  IN_REVIEW: "Em análise",
  ACCEPTED: "Aprovada",
  DECLINED: "Recusada",
  COMPLETED: "Concluída",
};

type Submission = {
  id: string;
  fullName: string;
  age: number;
  profession: string;
  whatsapp: string;
  mainComplaint: string;
  painLocation: string;
  painLevel?: number | null;
  status: TriageStatus;
  createdAt: string;
  treatmentReason?: string;
};

export function AdminTriagePage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [status, setStatus] = useState<FilterStatus>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await listAdminTriages(status || undefined);

      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar fichas.");
    } finally {
      setLoading(false);
    }
  }

  async function update(id: string, nextStatus: TriageStatus) {
    try {
      const updated = await updateAdminTriageStatus(id, nextStatus);

      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: updated.status,
              }
            : item,
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível atualizar.");
    }
  }

  useEffect(() => {
    load();
  }, [status]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();

    if (!term) {
      return items;
    }

    return items.filter((item) =>
      `${item.fullName} ${item.whatsapp} ${item.profession}`
        .toLocaleLowerCase()
        .includes(term),
    );
  }, [items, search]);

  function count(targetStatus: TriageStatus) {
    return items.filter((item) => item.status === targetStatus).length;
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-top">
          <div>
            <span className="admin-eyebrow">Portal administrativo</span>

            <h1>Triagens</h1>

            <p className="admin-detail-head p">
              Acompanhe as fichas recebidas e a situação de cada paciente.
            </p>
          </div>

          <button
            onClick={() => {
              adminLogout();
              window.location.replace("/admin/login");
            }}
          >
            Sair
          </button>
        </div>

        <div className="admin-dashboard">
          <div className="admin-stat">
            <small>Novas</small>
            <strong>{count("NEW")}</strong>
          </div>

          <div className="admin-stat">
            <small>Em análise</small>
            <strong>{count("IN_REVIEW")}</strong>
          </div>

          <div className="admin-stat">
            <small>Aprovadas</small>
            <strong>{count("ACCEPTED")}</strong>
          </div>

          <div className="admin-stat">
            <small>Concluídas</small>
            <strong>{count("COMPLETED")}</strong>
          </div>
        </div>

        <div className="admin-search">
          <input
            aria-label="Buscar paciente"
            placeholder="Buscar por nome, WhatsApp ou profissão"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button type="button" onClick={() => setSearch("")}>
              Limpar
            </button>
          )}
        </div>

        <div className="admin-filters">
          <button
            className={!status ? "active" : ""}
            onClick={() => setStatus("")}
          >
            Todas
          </button>

          {statuses.map((itemStatus) => (
            <button
              className={status === itemStatus ? "active" : ""}
              key={itemStatus}
              onClick={() => setStatus(itemStatus)}
            >
              {labels[itemStatus]}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Carregando fichas…</p>
        ) : error ? (
          <p className="admin-error">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <h2>Nenhuma ficha encontrada</h2>

            <p>
              {search
                ? "Tente outro nome, WhatsApp ou profissão."
                : "Quando um paciente enviar a avaliação, ela aparecerá aqui."}
            </p>
          </div>
        ) : (
          <div className="triage-list">
            {filtered.map((item) => (
              <article className="triage-row" key={item.id}>
                <div>
                  <span className="triage-status">
                    {labels[item.status] ?? item.status}
                  </span>

                  <h2>{item.fullName}</h2>

                  <p>
                    {item.profession} · {item.age} anos · {item.whatsapp}
                  </p>

                  <p>{item.mainComplaint}</p>

                  <small>
                    {item.painLocation}
                    {item.painLevel ? ` · dor ${item.painLevel}/10` : ""} ·{" "}
                    {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                  </small>
                </div>

                <div className="triage-row-actions">
                  <select
                    aria-label={`Status de ${item.fullName}`}
                    value={item.status}
                    onChange={(e) =>
                      update(item.id, e.target.value as TriageStatus)
                    }
                  >
                    {statuses.map((itemStatus) => (
                      <option key={itemStatus} value={itemStatus}>
                        {labels[itemStatus]}
                      </option>
                    ))}
                  </select>

                  <a href={`/admin/triagens/${item.id}`}>Ver ficha</a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
