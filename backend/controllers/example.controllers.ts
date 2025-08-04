import { Request, Response } from "express";

// Example protected route that requires authentication
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // This comes from the auth middleware

    // Here you would typically fetch the full user profile from the database
    // For now, we'll just return the userId

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      userId: userId,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Example public route that works with or without authentication
export const getPublicData = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Optional, may be undefined

    res.status(200).json({
      success: true,
      message: "Public data retrieved successfully",
      isAuthenticated: !!userId,
      userId: userId || null,
    });
  } catch (error) {
    console.error("Get public data error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
