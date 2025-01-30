import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";

interface AuthenticatedRequest extends Request {
  User?: {
    _id: string;
  };
}

// to prevent unauthenticated users from accessing protected routes
const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  console.log(req.path);

  if (req.path === "/api/login" || req.path === "/api/register") {
    next();
    return;
  }

  // verify User is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: "Authorization token required" });
    return;
  }

  const token = authorization.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  try {
    // verify token
    const decodedToken = jwt.verify(token, secret as Secret) as JwtPayload;
    const { _id } = decodedToken;

    // find user in the database
    const user = await User.findOne({ _id }).select("_id");

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    // assign user to the request
    // @ts-ignore
    req.User = { _id: user._id.toString() };
    console.log("user is authenticated");
    next();
  } catch (error) {
    console.log("Error while authenticating : ", error);
    res.status(401).json({ error: "Request is not authorized" });
    return;
  }
};

export default requireAuth;
