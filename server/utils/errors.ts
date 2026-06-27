export function notFound(message = 'Resource Not Found') {
  return createError({ statusCode: 404, statusMessage: message })
}

export function unauthorized(message = 'Unauthorized') {
  return createError({ statusCode: 401, statusMessage: message })
}

export function forbidden(message = 'Forbidden') {
  return createError({ statusCode: 403, statusMessage: message })
}

export function conflict(message = 'Conflict') {
  return createError({ statusCode: 409, statusMessage: message })
}

export function validationError(message = 'Validation Error') {
  return createError({ statusCode: 422, statusMessage: message })
}
