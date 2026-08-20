import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(10).max(200),
  role: z.enum(["ADMIN", "STAFF"]),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(10).max(200),
});

export const updateUserStatusSchema = z.object({
  active: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
