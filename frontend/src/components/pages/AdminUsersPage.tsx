import { FormEvent, useEffect, useState } from "react";

import {
  createAdminUser,
  listAdminUsers,
  updateAdminUserStatus,
  type AdminRole,
  type AdminUserListItem,
} from "../../api/authApi";

import { useAuth } from "../../auth/AuthContext";

import "./AdminPortal.css";

export function AdminUsersPage() {
  const { admin } = useAuth();

  const [users, setUsers] = useState<AdminUserListItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("STAFF");

  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const [changingUserId, setChangingUserId] = useState<string | null>(null);

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

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setRole("STAFF");
    setFormError("");
  }

  function openForm() {
    resetForm();
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    if (creating) return;

    resetForm();
    setShowForm(false);
  }

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setFormError("Informe um nome válido.");
      return;
    }

    if (!trimmedEmail) {
      setFormError("Informe o e-mail do usuário.");
      return;
    }

    if (password.length < 10) {
      setFormError("A senha deve ter pelo menos 10 caracteres.");
      return;
    }

    setCreating(true);

    try {
      await createAdminUser({
        name: trimmedName,
        email: trimmedEmail,
        password,
        role,
      });

      setSuccess("Usuário criado com sucesso.");

      resetForm();

      await loadUsers();

      setShowForm(false);
    } catch (e) {
      setFormError(
        e instanceof Error ? e.message : "Não foi possível criar o usuário.",
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleStatus(user: AdminUserListItem) {
    const nextActive = !user.active;

    const action = nextActive ? "ativar" : "desativar";

    const confirmed = window.confirm(
      `Deseja ${action} o usuário "${user.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setChangingUserId(user.id);
    setSuccess("");
    setError("");

    try {
      const updated = await updateAdminUserStatus(user.id, nextActive);

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === updated.id
            ? {
                ...currentUser,
                ...updated,
              }
            : currentUser,
        ),
      );

      setSuccess(
        nextActive
          ? "Usuário ativado com sucesso."
          : "Usuário desativado com sucesso.",
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível alterar o status do usuário.",
      );
    } finally {
      setChangingUserId(null);
    }
  }

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

          <div className="admin-top-actions">
            <a href="/admin/triagens">Triagens</a>

            <div className="admin-user">
              <strong>{admin.name}</strong>

              <small>Administrador</small>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.replace("/admin/triagens");
              }}
            >
              Voltar
            </button>
          </div>
        </div>

        <div className="admin-users-toolbar">
          <div>
            <h2>Usuários cadastrados</h2>

            <p>
              {users.length} {users.length === 1 ? "usuário" : "usuários"}{" "}
              cadastrado
              {users.length === 1 ? "" : "s"}.
            </p>
          </div>

          <button type="button" onClick={openForm}>
            + Novo usuário
          </button>
        </div>

        {success && <p className="admin-success">{success}</p>}

        {showForm && (
          <section className="admin-user-form">
            <div className="admin-user-form-header">
              <div>
                <span className="admin-eyebrow">Novo acesso</span>

                <h2>Criar usuário</h2>
              </div>

              <button type="button" onClick={closeForm} disabled={creating}>
                Fechar
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="admin-form-grid">
                <label>
                  Nome
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nome completo"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={120}
                    disabled={creating}
                  />
                </label>

                <label>
                  E-mail
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="usuario@exemplo.com"
                    autoComplete="email"
                    required
                    disabled={creating}
                  />
                </label>

                <label>
                  Senha
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo de 10 caracteres"
                    autoComplete="new-password"
                    required
                    minLength={10}
                    maxLength={200}
                    disabled={creating}
                  />
                  <small>A senha deve possuir pelo menos 10 caracteres.</small>
                </label>

                <label>
                  Perfil
                  <select
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value as AdminRole)
                    }
                    disabled={creating}
                  >
                    <option value="STAFF">Equipe (STAFF)</option>

                    <option value="ADMIN">Administrador (ADMIN)</option>
                  </select>
                </label>
              </div>

              {formError && (
                <p className="admin-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="admin-form-actions">
                <button type="button" onClick={closeForm} disabled={creating}>
                  Cancelar
                </button>

                <button type="submit" disabled={creating}>
                  {creating ? "Criando…" : "Criar usuário"}
                </button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <p>Carregando usuários…</p>
        ) : error ? (
          <p className="admin-error">{error}</p>
        ) : users.length === 0 ? (
          <div className="admin-empty">
            <h2>Nenhum usuário encontrado</h2>

            <p>Crie o primeiro usuário administrativo.</p>
          </div>
        ) : (
          <div className="triage-list">
            {users.map((user) => {
              const isCurrentAdmin = user.id === admin.id;

              const changing = changingUserId === user.id;

              return (
                <article className="triage-row" key={user.id}>
                  <div>
                    <span className="triage-status">
                      {user.active ? "Ativo" : "Inativo"}
                    </span>

                    <h2>{user.name}</h2>

                    <p>{user.email}</p>

                    <small>
                      Perfil:{" "}
                      {user.role === "ADMIN" ? "Administrador" : "Equipe"}
                    </small>
                  </div>

                  <div className="triage-row-actions">
                    {isCurrentAdmin ? (
                      <small>Sua conta</small>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        disabled={changing}
                      >
                        {changing
                          ? "Alterando…"
                          : user.active
                            ? "Desativar"
                            : "Ativar"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
