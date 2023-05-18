import { type NextFunction, type Request, type Response } from "express";
import createDebug from "debug";
import CustomError from "../../../types/customError.js";

const debugError = createDebug(
  "shoppingList-api:server:middlewares:errorMidlewares"
);

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError(404, "Endpoint not found");

  next(error);
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  debugError(error.message);

  const statusCode = error.statusCode || 500;

  const message = error.statusCode ? error.message : "General Error";

  res.status(statusCode).json({ message });
};
