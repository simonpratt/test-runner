class Error {
  private type: string;
  private message: string;

  public toString: () => string;

  constructor(type: string, message: string) {
    this.type = type;
    this.message = message || '';

    this.toString = function () {
      return `${this.type}${this.message ? ` ${this.message}` : ''}`;
    };
  }
}

class UnauthorisedError extends Error {
  constructor(message: string) {
    super('Unauthorised', message);
  }
}

class PermissionDeniedError extends Error {
  constructor(message: string) {
    super('Permission denied', message);
  }
}

class ResourceNotFoundError extends Error {
  constructor(message: string) {
    super('Not Found', message);
  }
}

class CrossOriginError extends Error {
  constructor(message: string) {
    super('Cross-origin Error', message);
  }
}

class ExternalServiceError extends Error {
  constructor(message: string) {
    super('External Service Error', message);
  }
}

export default {
  UnauthorisedError,
  PermissionDeniedError,
  ResourceNotFoundError,
  CrossOriginError,
  ExternalServiceError,
};
