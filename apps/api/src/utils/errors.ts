export class NotFoundException extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class UnauthorizedException extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}