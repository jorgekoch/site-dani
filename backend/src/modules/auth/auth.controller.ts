import { Request, Response } from "express";

import { BadRequestError } from "../../core/errors/AppError.js";

import { asyncHandler } from "../../core/utils/asyncHandler.js";
import { revokeAdminToken } from "../../lib/auth.js";

import { authService } from "./auth.service.js";

import {
  createUserSchema,
  loginSchema,
  resetPasswordSchema,
  updateUserStatusSchema,
} from "./auth.schema.js";

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const input = loginSchema.parse(req.body);

    const rateLimitKey = `${req.ip ?? "unknown"}:${input.email.toLowerCase()}`;

    const result = await authService.login(input, rateLimitKey);

    res.json(result);
  }),

  me: asyncHandler(async (_req: Request, res: Response) => {
    res.json({
      admin: res.locals.admin,
    });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const header = req.header("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (token) {
      revokeAdminToken(token);
    }

    res.json({ message: "Logout realizado com sucesso." });
  }),

  listUsers: asyncHandler(async (_req: Request, res: Response) => {
    const users = await authService.listUsers();

    res.json(users);
  }),

  createUser: asyncHandler(async (req: Request, res: Response) => {
    const input = createUserSchema.parse(req.body);

    const actor = res.locals.admin as { id: string } | undefined;

    if (!actor) {
      throw new BadRequestError("Contexto administrativo inválido.");
    }

    const user = await authService.createUser(input, actor.id);

    res.status(201).json(user);
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== "string" || !id.trim()) {
      throw new BadRequestError("Usuário inválido.");
    }

    const input = resetPasswordSchema.parse(req.body);

    const actor = res.locals.admin as { id: string } | undefined;

    if (!actor) {
      throw new BadRequestError("Contexto administrativo inválido.");
    }

    const user = await authService.resetPassword(id, input.password, actor.id);

    res.json({
      message: "Senha redefinida com sucesso.",
      user,
    });
  }),

  updateUserStatus: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== "string" || !id.trim()) {
      throw new BadRequestError("Usuário inválido.");
    }

    const input = updateUserStatusSchema.parse(req.body);

    const actor = res.locals.admin as { id: string } | undefined;

    if (!actor) {
      throw new BadRequestError("Contexto administrativo inválido.");
    }

    const user = await authService.updateUserStatus(id, input, actor.id);

    res.json(user);
  }),
};
