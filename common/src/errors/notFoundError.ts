import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(message = "The route is not found") {
    super(message);
  }

  serializeError() {
    return [{ message: this.message }];
  }
}
