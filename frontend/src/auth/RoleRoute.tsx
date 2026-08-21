import type { ReactNode } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { AdminRole } from "../api/authApi";

type RoleRouteProps = {
  roles: AdminRole[];
  children: ReactNode;
};

export function RoleRoute({ roles, children }: RoleRouteProps) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-shell">
          <p>Verificando sessão…</p>
        </div>
      </main>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!roles.includes(admin.role)) {
    return (
      <main className="admin-page">
        <div className="admin-shell">
          <div className="admin-empty">
            <h1>Acesso não autorizado</h1>
            <p>Você não tem permissão para acessar esta área.</p>
            <Link to="/admin/triagens">Voltar para as triagens</Link>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
