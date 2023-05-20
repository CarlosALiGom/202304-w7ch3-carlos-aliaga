import bcrypt from "bcryptjs";
import { type JwtPayload } from "jsonwebtoken";
import { type Response, type NextFunction, type Request } from "express";
import jwt from "jsonwebtoken";
import User from "../../../database/models/User.js";
import CustomError from "../../../types/customError.js";
import { type UserCredentialStructure } from "../../../types/types.js";

const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentialStructure
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      const customError = new CustomError(401, "Wrong credentials");

      throw customError;
    }

    const tokenPayload: JwtPayload = {
      sub: user._id.toString(),
      name: user.username,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!);

    res.status(200).json({ token });
  } catch (error: unknown) {
    next(error);
  }
};

export default loginUser;
