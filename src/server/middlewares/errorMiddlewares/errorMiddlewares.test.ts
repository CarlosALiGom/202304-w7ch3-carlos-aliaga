import { type Request, type NextFunction, type Response } from "express";
import CustomError from "../../../types/customError";
import { generalError, notFoundError } from "./errorMiddlewares";

beforeEach(() => {
  jest.clearAllMocks();
});

const req = {};
const next = jest.fn();
describe("Given a notFound Endpoint function", () => {
  describe("When it receives a request and a next function", () => {
    test("Then it should call the next function with the error 'Endpoint not found'", () => {
      const res = {};
      const expectedError = new CustomError(404, "Endpoint not found");

      notFoundError(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a generalError function", () => {
  describe("When it receives a request and an unknown error", () => {
    test("Then it should call the status method of the response with a 500 and the json method with the message 'General Error'", () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error("General Error");
      const expectedStatus = 500;
      const { message } = error;

      generalError(
        error as CustomError,
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ message });
    });
  });
});
