const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function getApiUrl() {
  return API_URL;
}

export function getAdminToken() {
  return localStorage.getItem("dani_admin_token");
}

export function setAdminToken(token: string) {
  localStorage.setItem("dani_admin_token", token);
}

export function clearAdminToken() {
  localStorage.removeItem("dani_admin_token");
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAdminToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  });

  const payload = await response.json().catch(() => null);

  if (response.status === 401) {
    clearAdminToken();

    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  if (!response.ok) {
    throw new Error(
      payload?.message ?? "Não foi possível concluir a operação.",
    );
  }

  return payload as T;
}
