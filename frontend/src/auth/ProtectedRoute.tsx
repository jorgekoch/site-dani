import { useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading, isAuthenticated } = useAuth();
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== "/") {
      window.location.replace("/admin/login");
    }
  }, [loading, isAuthenticated, pathname]);

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-shell">
          <p>Verificando sessão…</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated && pathname !== "/") {
    return null;
  }

  return <>{children}</>;
}
