import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../core/errors/AppError.js";

import {
  hashPassword,
  issueAdminToken,
  safeEqual,
  verifyPassword,
} from "../../lib/auth.js";

import { authRepository } from "./auth.repository.js";

import type {
  CreateUserInput,
  LoginInput,
  UpdateUserStatusInput,
} from "./auth.schema.js";

const attempts = new Map<string, { count: number; resetAt: number }>();

const adminLoginWindowMs = 15 * 60_000;
const adminLoginMaxAttempts = 5;

function isRateLimitedForLogin(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, {
      count: 0,
      resetAt: now + adminLoginWindowMs,
    });

    return false;
  }

  return current.count >= adminLoginMaxAttempts;
}

function registerLoginFailure(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, {
      count: 1,
      resetAt: now + adminLoginWindowMs,
    });

    return;
  }

  current.count += 1;
}

function clearLoginFailures(key: string) {
  attempts.delete(key);
}

export function validateUserStatusChange({
  targetRole,
  nextActive,
  activeAdminsCount,
}: {
  targetRole: "ADMIN" | "STAFF";
  nextActive: boolean;
  activeAdminsCount: number;
}) {
  if (
    targetRole === "ADMIN" &&
    !nextActive &&
    activeAdminsCount <= 1
  ) {
    throw new ConflictError(
      "Não é possível desativar o último administrador ativo.",
    );
  }
}

function isRateLimited(key: string) {
  return isRateLimitedForLogin(key);
}

function registerFailure(key: string) {
  registerLoginFailure(key);
}

function clearFailures(key: string) {
  clearLoginFailures(key);
}

export const authService = {
  async login(input: LoginInput, rateLimitKey: string) {
    if (isRateLimited(rateLimitKey)) {
      throw new UnauthorizedError(
        "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
      );
    }

    const email = input.email.toLowerCase();

    let user = await authRepository.findUserByEmail(email);

    const envEmail = process.env.ADMIN_EMAIL?.toLowerCase();

    const envPassword = process.env.ADMIN_PASSWORD;

    if (
      !user &&
      envEmail === email &&
      envPassword &&
      safeEqual(input.password, envPassword)
    ) {
      user = await authRepository.createUser({
        name: "Administrador",
        email,
        role: "ADMIN",
        passwordHash: hashPassword(envPassword),
      });
    }

    if (
      !user ||
      !user.active ||
      !verifyPassword(input.password, user.passwordHash)
    ) {
      registerFailure(rateLimitKey);

      throw new UnauthorizedError("Credenciais inválidas.");
    }

    clearFailures(rateLimitKey);

    return {
      token: issueAdminToken(user.email, user.role),

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async listUsers() {
    return authRepository.listUsers();
  },

  async createUser(input: CreateUserInput, actorId?: string) {
    const email = input.email.toLowerCase();

    try {
      const user = await authRepository.createUser({
        name: input.name,
        email,
        passwordHash: hashPassword(input.password),
        role: input.role,
      });

      if (actorId) {
        await authRepository.createAuditLog({
          actorId,
          action: "ADMIN_USER_CREATED",
          details: `Usuário criado: ${user.name} (${user.role})`,
        });
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      };
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "P2002") {
        throw new ConflictError("Este e-mail já está cadastrado.");
      }

      throw error;
    }
  },

  async resetPassword(id: string, password: string, actorId?: string) {
    const user = await authRepository.findUserById(id);

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.");
    }

    const updatedUser = await authRepository.updatePassword(
      id,
      hashPassword(password),
    );

    if (actorId) {
      await authRepository.createAuditLog({
        actorId,
        action: "ADMIN_PASSWORD_RESET",
        details: `Senha redefinida para ${user.name}`,
      });
    }

    return updatedUser;
  },

  async updateUserStatus(
    id: string,
    input: UpdateUserStatusInput,
    actorId: string,
  ) {
    const user = await authRepository.findUserById(id);

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.");
    }

    if (user.id === actorId && !input.active) {
      throw new ConflictError("Você não pode desativar o próprio usuário.");
    }

    if (user.role === "ADMIN" && !input.active) {
      const activeAdminsCount = await authRepository.countActiveAdmins();

      validateUserStatusChange({
        targetRole: user.role,
        nextActive: input.active,
        activeAdminsCount,
      });
    }

    const updatedUser = await authRepository.updateActive(id, input.active);

    await authRepository.createAuditLog({
      actorId,
      action: "ADMIN_USER_STATUS_CHANGED",
      details: `Usuário ${user.name} ${input.active ? "ativado" : "desativado"}`,
    });

    return updatedUser;
  },
};
