import { type Request } from "express";
import { type Types } from "mongoose";

export type UserCredentialStructure = {
  username: string;
  password: string;
};

export type UserCredentialsRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserCredentialStructure
>;

export type UserStructure = {
  _id: string;
} & UserCredentialStructure;

export type UserData = {
  _id: Types.ObjectId;
} & UserCredentialStructure;
