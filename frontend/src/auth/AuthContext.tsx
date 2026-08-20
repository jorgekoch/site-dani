import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { adminLogout, getAdminMe, type AdminUser } from "../api/authApi";

import { getAdminToken } from "../api/http";

type AuthContextValue = {
  admin: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const [loading, setLoading] = useState(true);

  async function refresh() {
    const token = getAdminToken();

    if (!token) {
      setAdmin(null);
      return;
    }

    try {
      const response = await getAdminMe();
      setAdmin(response.admin);
    } catch {
      setAdmin(null);
      adminLogout();
    }
  }

  useEffect(() => {
    refresh().finally(() => {
      setLoading(false);
    });
  }, []);

  function logout() {
    adminLogout();
    setAdmin(null);
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: Boolean(admin),
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
