import { CustomError } from "./customError";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  constructor(message = "Could not connect to a database") {
    super(message);
  }

  serializeError() {
    return [{ message: this.message }];
  }
}
