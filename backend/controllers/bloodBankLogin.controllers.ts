import { Request, Response } from "express";
import { prisma } from "../utils/prisma.utils.ts";
import bcrypt from "bcrypt";
import { z } from "zod";
import { generateToken } from "../utils/jwt.utils.ts";

const bloodBankLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Blood Bank login controller
 * @param req - Request containing email and password
 * @param res - Response with JWT token or error
 */
const bloodBankLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData = bloodBankLoginSchema.parse(req.body);

    // Find blood bank by email
    const bloodBank = await prisma.bloodBanks.findFirst({
      where: {
        email: loginData.email,
      },
      select: {
        id: true,
        name: true,
        adminName: true,
        email: true,
        password: true,
        licenseNumber: true,
        city: true,
        state: true,
        phone: true,
        address: true,
        totalBloodBags: true,
      },
    });

    if (!bloodBank) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      bloodBank.password
    );

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(bloodBank.id);

    // Set token in cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Blood Bank login successful",
      data: {
        id: bloodBank.id,
        name: bloodBank.name,
        adminName: bloodBank.adminName,
        email: bloodBank.email,
        licenseNumber: bloodBank.licenseNumber,
        city: bloodBank.city,
        state: bloodBank.state,
        phone: bloodBank.phone,
        address: bloodBank.address,
        totalBloodBags: bloodBank.totalBloodBags,
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

    console.error("Blood Bank login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

export { bloodBankLogin };
