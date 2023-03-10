import { CustomError } from "./customError";

export class NotAuthorizedError extends CustomError {
  statusCode = 401
  constructor(message = 'Not Authorized') {
    super(message)
  }
  serializeError() {
    return [{ message: this.message }]
  }
}