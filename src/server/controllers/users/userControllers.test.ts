import { Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type Response, type NextFunction } from "express";
import {
  type UserCredentialsRequest,
  type UserStructure,
} from "../../../types/types.js";
import loginUser from "./userControllers.js";
import User from "../../../database/models/User.js";

beforeEach(() => {
  jest.clearAllMocks();
});
describe("Given a userLogin", () => {
  describe("When it receives a request with a valid credentials and a response", () => {
    test("Then it should call the status method of the response with a 200", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const req: Partial<UserCredentialsRequest> = {
        body: {
          username: "carlos",
          password: "carlos",
        },
      };

      const next = jest.fn();

      const expectedStatusCode = 200;

      const token = "mocked-token";

      const mockedUser: UserStructure = {
        _id: new Types.ObjectId().toString(),
        username: "hello",
        password: "hello",
      };

      User.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockedUser),
      });

      bcrypt.compare = jest.fn().mockReturnValue(true);

      jwt.sign = jest.fn().mockReturnValue(token);

      await loginUser(
        req as UserCredentialsRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith({ token });
      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });
});
