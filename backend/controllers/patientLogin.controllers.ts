import { Request, Response } from "express";
import { prisma } from "../utils/prisma.utils.ts";
import bcrypt from "bcrypt";
import { z } from "zod";
import { generateToken } from "../utils/jwt.utils.ts";

const patientLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Patient login controller
 * @param req - Request containing email and password
 * @param res - Response with JWT token or error
 */
const patientLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData = patientLoginSchema.parse(req.body);

    // Find patient by email
    const patient = await prisma.patients.findFirst({
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
      },
    });

    if (!patient) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      patient.password
    );

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(patient.id);

    // Set token in cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Patient login successful",
      data: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        bloodType: patient.BloodType,
        city: patient.city,
        phone: patient.phone,
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

    console.error("Patient login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

export { patientLogin };
