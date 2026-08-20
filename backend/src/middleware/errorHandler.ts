import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { AppError } from '../errors/AppError.js'

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Confira os campos enviados.',
      fields: error.flatten().fieldErrors,
    })
    return
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      res.status(409).json({
        message: 'Um registro com esses dados já existe.',
        code: 'CONFLICT',
      })
      return
    }

    if (error.code === 'P2025') {
      res.status(404).json({
        message: 'Registro não encontrado.',
        code: 'NOT_FOUND',
      })
      return
    }
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      ...(error.code ? { code: error.code } : {}),
    })
    return
  }

  console.error('Unhandled API error:', error)

  res.status(500).json({
    message: 'Não foi possível concluir a operação.',
    code: 'INTERNAL_SERVER_ERROR',
  })
}