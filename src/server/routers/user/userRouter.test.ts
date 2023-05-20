import "../../../loadEnviroments.js";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../..";
import {
  type UserCredentialStructure,
  type UserData,
} from "../../../types/types";
import connectToDatabase from "../../../database/connectToDatabase";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "../../../database/models/User";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

const mockUser: UserCredentialStructure = {
  username: "carlos",
  password: "carlos",
};

const mockUserHashed: UserCredentialStructure = {
  username: "carlos",
  password: "$2y$10$BXQrO.UGOr9NSY98pE.Keu9JB9sRY83qp9EcX5We0QQ3Ezgs1cr56",
};

describe("Given a POST 'users/login' endpoint", () => {
  describe("When it receives a request with a name 'carlos' and a password 'carlos'", () => {
    let newUser: UserData;

    beforeAll(async () => {
      newUser = await User.create(mockUserHashed);
    });

    test("Then it should responde with a response with status 200 and a 'token'", async () => {
      const expectedStatus = 200;

      const response: { body: { token: string } } = await request(app)
        .post("/users/login")
        .send(mockUser)
        .expect(expectedStatus);

      const payload = jwt.verify(response.body.token, process.env.JWT_SECRET!);
      const userId = payload.sub as string;

      expect(userId).toBe(newUser._id.toString());
    });
  });
});
