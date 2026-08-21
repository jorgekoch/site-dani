const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function getApiUrl() {
  return API_URL;
}

export function getAdminToken() {
  return null;
}

export function setAdminToken(_token: string) {
  return;
}

export function clearAdminToken() {
  return;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
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
