import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { adminLogout } from "../../api/authApi";

import {
  listAdminTriages,
  updateAdminTriageStatus,
  type TriageStatus,
} from "../../api/triageApi";

import { useAuth } from "../../auth/AuthContext";

import { formatWhatsapp } from "../../utils/formatWhatsapp";

import "./AdminPortal.css";

const statuses: TriageStatus[] = [
  "NEW",
  "IN_REVIEW",
  "ACCEPTED",
  "DECLINED",
  "COMPLETED",
];

type FilterStatus = TriageStatus | "";
type SortMode = "recent" | "older" | "name" | "status";

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
  const navigate = useNavigate();
  const [items, setItems] = useState<Submission[]>([]);
  const [status, setStatus] = useState<FilterStatus>("");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { admin } = useAuth();

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
    const nextItems = term
      ? items.filter((item) =>
          `${item.fullName} ${item.whatsapp} ${item.profession}`
            .toLocaleLowerCase()
            .includes(term),
        )
      : items;

    return [...nextItems].sort((a, b) => {
      switch (sortMode) {
        case "older":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name":
          return a.fullName.localeCompare(b.fullName);
        case "status":
          return statuses.indexOf(a.status) - statuses.indexOf(b.status);
        case "recent":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [items, search, sortMode]);

  function count(targetStatus: TriageStatus) {
    return items.filter((item) => item.status === targetStatus).length;
  }

  const total = items.length;
  const pending = items.filter(
    (item) => item.status === "NEW" || item.status === "IN_REVIEW",
  ).length;
  const approved = count("ACCEPTED") + count("COMPLETED");
  const approvalRate = total ? Math.round((approved / total) * 100) : 0;
  const latestSubmission = items.reduce<string | null>((latest, item) => {
    if (!latest) return item.createdAt;
    return new Date(item.createdAt).getTime() > new Date(latest).getTime()
      ? item.createdAt
      : latest;
  }, null);

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

          <div className="admin-top-actions">
            {admin?.role === "ADMIN" && <Link to="/admin/usuarios">Usuários</Link>}

            <div className="admin-user">
              <strong>{admin?.name}</strong>

              <small>
                {admin?.role === "ADMIN" ? "Administrador" : "Equipe"}
              </small>
            </div>

            <button
              onClick={() => {
                adminLogout();
                navigate("/admin/login", { replace: true });
              }}
            >
              Sair
            </button>
          </div>
        </div>

        <div className="admin-dashboard">
          <div className="admin-stat admin-stat-highlight">
            <small>Total</small>
            <strong>{total}</strong>
            <span>Fichas recebidas</span>
          </div>

          <div className="admin-stat">
            <small>Novas</small>
            <strong>{count("NEW")}</strong>
            <span>Precisam início</span>
          </div>

          <div className="admin-stat">
            <small>Em análise</small>
            <strong>{count("IN_REVIEW")}</strong>
            <span>Em revisão ativa</span>
          </div>

          <div className="admin-stat">
            <small>Pendentes</small>
            <strong>{pending}</strong>
            <span>Sem resposta final</span>
          </div>

          <div className="admin-stat admin-stat-success">
            <small>Aprovadas</small>
            <strong>{approved}</strong>
            <span>{approvalRate}% da fila</span>
          </div>

          <div className="admin-stat admin-stat-ghost">
            <small>Última ficha</small>
            <strong>
              {latestSubmission
                ? new Date(latestSubmission).toLocaleDateString("pt-BR")
                : "—"}
            </strong>
            <span>{latestSubmission ? "Recebida em" : "Sem registros"}</span>
          </div>
        </div>

        <div className="admin-toolbar">
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

          <div className="admin-sorter">
            <label htmlFor="sort-mode">Ordenar por</label>
            <select
              id="sort-mode"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
            >
              <option value="recent">Mais recentes</option>
              <option value="older">Mais antigas</option>
              <option value="name">Nome</option>
              <option value="status">Status</option>
            </select>
          </div>
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
          <div className="admin-empty admin-empty-loading">
            <h2>Carregando fichas…</h2>
            <p>Buscando triagens no painel administrativo.</p>
          </div>
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
          <div className="triage-results-bar">
            <strong>{filtered.length}</strong>
            <span>{filtered.length === 1 ? "resultado" : "resultados"}</span>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="triage-list">
            {filtered.map((item) => (
              <article className="triage-row" key={item.id}>
                <div>
                  <span className="triage-status">
                    {labels[item.status] ?? item.status}
                  </span>

                  <h2>{item.fullName}</h2>

                  <p>
                    {item.profession} · {item.age} anos ·{" "}
                    {formatWhatsapp(item.whatsapp)}
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
