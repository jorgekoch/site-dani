import { useEffect, useState } from "react";

import { listAdminUsers, type AdminUserListItem } from "../../api/authApi";

import { useAuth } from "../../auth/AuthContext";

import "./AdminPortal.css";

export function AdminUsersPage() {
  const { admin } = useAuth();

  const [users, setUsers] = useState<AdminUserListItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const result = await listAdminUsers();
      setUsers(result);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível carregar os usuários.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  if (admin?.role !== "ADMIN") {
    return null;
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-top">
          <div>
            <span className="admin-eyebrow">Portal administrativo</span>

            <h1>Usuários</h1>

            <p>
              Gerencie os usuários que possuem acesso ao portal administrativo.
            </p>
          </div>

          <a href="/admin/triagens">Voltar para triagens</a>
        </div>

        {loading ? (
          <p>Carregando usuários…</p>
        ) : error ? (
          <p className="admin-error">{error}</p>
        ) : (
          <div className="triage-list">
            {users.map((user) => (
              <article className="triage-row" key={user.id}>
                <div>
                  <span className="triage-status">
                    {user.active ? "Ativo" : "Inativo"}
                  </span>

                  <h2>{user.name}</h2>

                  <p>{user.email}</p>

                  <small>
                    Perfil: {user.role === "ADMIN" ? "Administrador" : "Equipe"}
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
