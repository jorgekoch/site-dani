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

function isRateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, {
      count: 0,
      resetAt: now + 15 * 60_000,
    });

    return false;
  }

  return current.count >= 5;
}

function registerFailure(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, {
      count: 1,
      resetAt: now + 15 * 60_000,
    });

    return;
  }

  current.count += 1;
}

function clearFailures(key: string) {
  attempts.delete(key);
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

  async createUser(input: CreateUserInput) {
    const email = input.email.toLowerCase();

    try {
      const user = await authRepository.createUser({
        name: input.name,
        email,
        passwordHash: hashPassword(input.password),
        role: input.role,
      });

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

  async resetPassword(id: string, password: string) {
    const user = await authRepository.findUserById(id);

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.");
    }

    return authRepository.updatePassword(id, hashPassword(password));
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

    return authRepository.updateActive(id, input.active);
  },
};
