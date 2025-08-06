import { Request, Response } from "express";

/**
 * Logout controller - Clears authentication cookie
 * @param req - Request object
 * @param res - Response object
 */
const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear the authentication cookie
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed. Please try again.",
    });
  }
};

export { logout };
