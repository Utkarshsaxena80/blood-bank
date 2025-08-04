import { z } from "zod";

// Patient validation schemas
export const PatientSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  BloodBank: z.string().min(1, "Blood bank is required"),
  BloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  age: z
    .number()
    .min(18, "Age must be at least 18")
    .max(65, "Age must be under 65"),
});

export const PatientLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Donor validation schemas
export const DonorSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  BloodBank: z.string().min(1, "Blood bank is required"),
  BloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  age: z
    .number()
    .min(18, "Age must be at least 18")
    .max(65, "Age must be under 65"),
});

export const DonorLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Blood Bank validation schemas
export const BloodBankSignupSchema = z.object({
  name: z.string().min(2, "Blood bank name must be at least 2 characters"),
  adminName: z.string().min(2, "Admin name must be at least 2 characters"),
  licenseNumber: z
    .string()
    .min(5, "License number must be at least 5 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  totalBloodBags: z.number().min(0, "Total blood bags must be non-negative"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
});

export const BloodBankLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});
