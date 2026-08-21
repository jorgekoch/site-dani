import { prisma } from "../../lib/prisma.js";

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.adminUser.findUnique({
      where: { email },
    });
  },

  findUserById(id: string) {
    return prisma.adminUser.findUnique({
      where: { id },
    });
  },

  countActiveAdmins() {
    return prisma.adminUser.count({
      where: {
        role: "ADMIN",
        active: true,
      },
    });
  },

  createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: "ADMIN" | "STAFF";
  }) {
    return prisma.adminUser.create({
      data,
    });
  },

  createAuditLog(data: {
    action: string;
    details?: string | null;
    actorId: string;
    triageId?: string | null;
  }) {
    return prisma.auditLog.create({
      data,
    });
  },

  listUsers() {
    return prisma.adminUser.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });
  },

  updatePassword(id: string, passwordHash: string) {
    return prisma.adminUser.update({
      where: { id },
      data: {
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    });
  },

  updateActive(id: string, active: boolean) {
    return prisma.adminUser.update({
      where: { id },
      data: {
        active,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    });
  },
};
