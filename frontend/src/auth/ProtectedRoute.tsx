import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-shell">
          <p>Verificando sessão…</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    window.location.replace("/admin/login");
    return null;
  }

  return <>{children}</>;
}
