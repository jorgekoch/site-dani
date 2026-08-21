import { useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { AdminRole } from "../api/authApi";

type RoleRouteProps = {
  roles: AdminRole[];
  children: ReactNode;
};

export function RoleRoute({ roles, children }: RoleRouteProps) {
  const { admin, loading } = useAuth();
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";

  useEffect(() => {
    if (!loading && !admin && pathname !== "/") {
      window.location.replace("/admin/login");
    }
  }, [loading, admin, pathname]);

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-shell">
          <p>Verificando sessão…</p>
        </div>
      </main>
    );
  }

  if (!admin && pathname !== "/") {
    return null;
  }

  if (!roles.includes(admin?.role ?? "STAFF")) {
    return (
      <main className="admin-page">
        <div className="admin-shell">
          <div className="admin-empty">
            <h1>Acesso não autorizado</h1>
            <p>Você não tem permissão para acessar esta área.</p>
            <a href="/admin/triagens">Voltar para as triagens</a>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
