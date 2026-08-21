import { apiRequest, clearAdminToken, setAdminToken } from "./http";

export type AdminRole = "ADMIN" | "STAFF";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

export type AdminLoginResponse = {
  token: string;
  user: AdminUser;
};

export async function adminLogin(email: string, password: string) {
  return apiRequest<AdminLoginResponse>(
    "/api/admin/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );
}

export async function adminLogout() {
  try {
    await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/api/admin/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    // Ignore logout API failures and proceed with local cleanup.
  } finally {
    clearAdminToken();
  }
}

export async function getAdminMe() {
  return apiRequest<{ admin: AdminUser }>("/api/admin/auth/me");
}

export type AdminUserListItem = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  createdAt?: string;
};

export async function listAdminUsers() {
  return apiRequest<AdminUserListItem[]>("/api/admin/auth/users");
}

export type CreateAdminUserInput = {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
};

export async function createAdminUser(data: CreateAdminUserInput) {
  return apiRequest<AdminUserListItem>("/api/admin/auth/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminUserStatus(id: string, active: boolean) {
  return apiRequest<AdminUserListItem>(`/api/admin/auth/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      active,
    }),
  });
}

export type ResetAdminUserPasswordResponse = {
  message: string;
  user: AdminUserListItem;
};

export async function resetAdminUserPassword(
  id: string,
  password: string,
) {
  return apiRequest<ResetAdminUserPasswordResponse>(
    `/api/admin/auth/users/${id}/password`,
    {
      method: "PATCH",
      body: JSON.stringify({
        password,
      }),
    },
  );
}
