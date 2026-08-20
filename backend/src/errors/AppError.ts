export class AppError extends Error {
  public readonly statusCode: number
  public readonly code?: string

  constructor(
    message: string,
    statusCode = 500,
    code?: string,
  ) {
    super(message)

    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Requisição inválida.') {
    super(message, 400, 'BAD_REQUEST')
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado.') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Você não tem permissão para esta ação.') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado.') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflito.') {
    super(message, 409, 'CONFLICT')
  }
}