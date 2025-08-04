import { Request, Response } from "express";
import { prisma } from "../utils/prisma.utils";
import bcrypt from "bcrypt";
import { z } from "zod";

/**
 *
 * @param req the data of patient
 * @param res will give the response of operations
 */

const patinetSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().min(10, "Invalid phone number"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  bloodBank: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  bloodType: z.string(),
  age: z.number().positive().int(),
});

const patientR = async (req: Request, res: Response): Promise<void> => {
  const patientData = patinetSchema.parse(req.body);
  //fetch data from datbases of patients and email as thier -->will do it later (using prisma )

  try {
    const userExists = await prisma.patients.findFirst({
      where: { email: patientData.email },
    });
    if (userExists) {
      res.status(409).json({
        message: "User Already exists with same email",
      });
    } else {
      //heash password
      const SALT_ROUNDS: number = 10;
      const hashedPassword = await bcrypt.hash(
        patientData.password,
        SALT_ROUNDS
      );

      const pushUser = await prisma.patients.create({
        data: {
          name: patientData.name,
          email: patientData.email,
          password: hashedPassword,
          phone: patientData.phone,
          BloodBank: patientData.bloodBank,
          BloodType: patientData.bloodType,
          city: patientData.city,
          state: patientData.state,
          age: patientData.age,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
      res.status(200).json({
        message: "user added",
        pushUser,
      });
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        message: "invalid input data",
      });
      return;
    }
    res.status(500).json({
      message: "Cannot register at this moment",
    });
  }
};
export { patientR };
