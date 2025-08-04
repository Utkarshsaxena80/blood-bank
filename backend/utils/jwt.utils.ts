import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_KEY || "fallback-secret-key-for-development";

if (!process.env.JWT_KEY && process.env.NODE_ENV === "production") {
  throw new Error("JWT_KEY environment variable is required in production");
}

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
