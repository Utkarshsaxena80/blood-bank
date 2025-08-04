import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.utils.js";
import { prisma } from "../utils/prisma.utils.js";
import {
  PatientSignupSchema,
  PatientLoginSchema,
  DonorSignupSchema,
  DonorLoginSchema,
  BloodBankSignupSchema,
  BloodBankLoginSchema,
} from "../utils/validation.utils.js";

// Patient Signup
export const patientSignup = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = PatientSignupSchema.parse(req.body);
    const {
      name,
      email,
      password,
      phone,
      BloodBank,
      BloodType,
      city,
      state,
      age,
    } = validatedData;

    // Check if patient already exists
    const existingPatient = await prisma.patients.findFirst({
      where: { email },
    });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create patient
    const patient = await prisma.patients.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        BloodBank,
        BloodType,
        city,
        state,
        age: age,
      },
    });

    // Generate JWT token
    const token = generateToken(patient.id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      user: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        type: "patient",
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("Patient signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Patient Login
export const patientLogin = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = PatientLoginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find patient
    const patient = await prisma.patients.findFirst({
      where: { email },
    });

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, patient.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateToken(patient.id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        type: "patient",
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("Patient login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Donor Signup
export const donorSignup = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = DonorSignupSchema.parse(req.body);
    const {
      name,
      email,
      password,
      phone,
      BloodBank,
      BloodType,
      city,
      state,
      age,
    } = validatedData;

    // Check if donor already exists
    const existingDonor = await prisma.donors.findFirst({
      where: { email },
    });

    if (existingDonor) {
      return res.status(400).json({
        success: false,
        message: "Donor with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create donor
    const donor = await prisma.donors.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        BloodBank,
        BloodType,
        city,
        state,
        age: age,
      },
    });

    // Generate JWT token
    const token = generateToken(donor.id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "Donor registered successfully",
      user: {
        id: donor.id,
        name: donor.name,
        email: donor.email,
        type: "donor",
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("Donor signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Donor Login
export const donorLogin = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = DonorLoginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find donor
    const donor = await prisma.donors.findFirst({
      where: { email },
    });

    if (!donor) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, donor.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateToken(donor.id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: donor.id,
        name: donor.name,
        email: donor.email,
        type: "donor",
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("Donor login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Blood Bank Signup
export const bloodBankSignup = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = BloodBankSignupSchema.parse(req.body);
    const {
      name,
      adminName,
      licenseNumber,
      email,
      password,
      phone,
      totalBloodBags,
      address,
      city,
      state,
    } = validatedData;

    // Check if blood bank already exists
    const existingBloodBank = await prisma.bloodBanks.findFirst({
      where: {
        OR: [{ email }, { licenseNumber }],
      },
    });

    if (existingBloodBank) {
      return res.status(400).json({
        success: false,
        message: "Blood bank with this email or license number already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create blood bank
    const bloodBank = await prisma.bloodBanks.create({
      data: {
        name,
        adminName,
        licenseNumber,
        email,
        password: hashedPassword,
        phone,
        totalBloodBags: totalBloodBags,
        address,
        city,
        state,
      },
    });

    // Generate JWT token
    const token = generateToken(bloodBank.id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "Blood bank registered successfully",
      user: {
        id: bloodBank.id,
        name: bloodBank.name,
        email: bloodBank.email,
        type: "bloodBank",
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("Blood bank signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Blood Bank Login
export const bloodBankLogin = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = BloodBankLoginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find blood bank
    const bloodBank = await prisma.bloodBanks.findFirst({
      where: { email },
    });

    if (!bloodBank) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, bloodBank.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateToken(bloodBank.id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: bloodBank.id,
        name: bloodBank.name,
        email: bloodBank.email,
        type: "bloodBank",
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("Blood bank login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Check Auth Status
export const checkAuth = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Try to find user in all tables
    let user = await prisma.patients.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (user) {
      return res.status(200).json({
        success: true,
        user: { ...user, type: "patient" },
      });
    }

    user = await prisma.donors.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (user) {
      return res.status(200).json({
        success: true,
        user: { ...user, type: "donor" },
      });
    }

    user = await prisma.bloodBanks.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (user) {
      return res.status(200).json({
        success: true,
        user: { ...user, type: "bloodBank" },
      });
    }

    res.status(404).json({
      success: false,
      message: "User not found",
    });
  } catch (error) {
    console.error("Check auth error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
