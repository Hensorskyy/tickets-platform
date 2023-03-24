import { CustomError } from "./customError";

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(message = "Bad Request") {
    super(message)
  }
  serializeError() {
    return [{ message: this.message }]
  }

}