import { CustomError } from "./customError";
import { ValidationError } from "express-validator";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[], message = "Validation failed") {
    super(message);
  }

  serializeError() {
    return this.errors?.map((error) => {
      return {
        message: error?.msg,
        field: error?.param,
      };
    });
  }
}
