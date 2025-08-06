import { Request, Response } from "express";
import { prisma } from "../utils/prisma.utils.ts";
import bcrypt from "bcrypt";
import { z } from "zod";
import { generateToken } from "../utils/jwt.utils.ts";

const donorLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Donor login controller
 * @param req - Request containing email and password
 * @param res - Response with JWT token or error
 */
const donorLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData = donorLoginSchema.parse(req.body);

    // Find donor by email
    const donor = await prisma.donors.findFirst({
      where: {
        email: loginData.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        BloodType: true,
        city: true,
        phone: true,
        age: true,
      },
    });

    if (!donor) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      donor.password
    );

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(donor.id);

    // Set token in cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Donor login successful",
      data: {
        id: donor.id,
        name: donor.name,
        email: donor.email,
        bloodType: donor.BloodType,
        city: donor.city,
        phone: donor.phone,
        age: donor.age,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    console.error("Donor login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

export { donorLogin };
