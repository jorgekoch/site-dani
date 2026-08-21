import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { adminLogout } from "../../api/authApi";
import {
  listArchivedTriages,
  restoreAdminTriage,
  type ArchivedTriage,
} from "../../api/triageApi";
import { useAuth } from "../../auth/AuthContext";
import { formatWhatsapp } from "../../utils/formatWhatsapp";
import "./AdminPortal.css";

type GroupedArchive = Record<string, ArchivedTriage[]>;

export function AdminArchivePage() {
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [items, setItems] = useState<ArchivedTriage[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restoringId, setRestoringId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await listArchivedTriages();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar o arquivo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

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

  const grouped = useMemo(() => {
    return filtered.reduce<GroupedArchive>((acc, item) => {
      const date = item.archivedAt ? new Date(item.archivedAt) : new Date(item.createdAt);
      const year = String(date.getFullYear());

      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push(item);
      return acc;
    }, {});
  }, [filtered]);

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  async function restore(id: string) {
    const confirmed = window.confirm(
      "Restaurar esta ficha? Ela voltará a aparecer na lista de triagens ativas.",
    );

    if (!confirmed) return;

    try {
      setError("");
      setRestoringId(id);
      await restoreAdminTriage(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível restaurar a ficha.");
    } finally {
      setRestoringId(null);
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-top">
          <div>
            <span className="admin-eyebrow">Portal administrativo</span>
            <h1>Arquivo</h1>
            <p className="admin-detail-head p">
              Consulte fichas arquivadas e preserve o histórico dos pacientes.
            </p>
          </div>

          <div className="admin-top-actions">
            <Link to="/admin/triagens">Triagens</Link>
            {admin?.role === "ADMIN" && <Link to="/admin/usuarios">Usuários</Link>}

            <div className="admin-user">
              <strong>{admin?.name}</strong>
              <small>{admin?.role === "ADMIN" ? "Administrador" : "Equipe"}</small>
            </div>

            <button
              type="button"
              onClick={() => {
                adminLogout();
                navigate("/admin/login", { replace: true });
              }}
            >
              Sair
            </button>
          </div>
        </div>

        <div className="admin-toolbar">
          <div className="admin-search">
            <input
              aria-label="Buscar ficha arquivada"
              placeholder="Buscar por nome, WhatsApp ou profissão"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button type="button" onClick={() => setSearch("")}>
                Limpar
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="admin-empty admin-empty-loading">
            <h2>Carregando arquivo…</h2>
            <p>Buscando fichas arquivadas.</p>
          </div>
        ) : error ? (
          <p className="admin-error">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <h2>Nenhuma ficha arquivada</h2>
            <p>
              {search
                ? "Nenhuma ficha arquivada corresponde à busca."
                : "As fichas arquivadas aparecerão aqui, organizadas por ano."}
            </p>
          </div>
        ) : (
          years.map((year) => (
            <section key={year} className="admin-detail-section">
              <div className="admin-detail-section-header">
                <h2>{year}</h2>
                <span>{grouped[year].length} {grouped[year].length === 1 ? "ficha" : "fichas"}</span>
              </div>

              <div className="triage-list">
                {grouped[year].map((item) => (
                  <article className="triage-row" key={item.id}>
                    <div>
                      <span className="triage-status">Arquivada</span>
                      <h2>{item.fullName}</h2>
                      <p>
                        {item.profession} · {item.age} anos · {formatWhatsapp(item.whatsapp)}
                      </p>
                      <p>{item.mainComplaint}</p>
                      <small>
                        Arquivada em {new Date(item.archivedAt).toLocaleDateString("pt-BR")}
                      </small>
                    </div>

                    <div className="triage-row-actions">
                      <Link to={`/admin/triagens/${item.id}`}>Ver ficha</Link>

                      {admin?.role === "ADMIN" && (
                        <button
                          type="button"
                          onClick={() => restore(item.id)}
                          disabled={restoringId === item.id}
                        >
                          {restoringId === item.id ? "Restaurando…" : "Restaurar"}
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
