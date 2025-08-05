import { Request, Response } from "express";
import { prisma } from '../utils/prisma.utils.ts';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

const donate1 = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { patientId }: { patientId: string } = req.body;
    const donorId = req.user?.userId;
    
    // Validate required inputs
    if (!donorId) {
      return res.status(401).json({ 
        error: "Unauthorized. Donor ID missing.",
        success: false 
      });
    }

    if (!patientId) {
      return res.status(400).json({ 
        error: "Patient ID is required.",
        success: false 
      });
    }

    // Get donor details
    const getDonorDetails = await prisma.donors.findUnique({
      where: {
        id: donorId
      },
      select: {
        id: true,
        name: true,
        BloodBank: true,
        BloodType: true,
        city: true
      }
    });

    if (!getDonorDetails) {
      return res.status(404).json({ 
        error: "Donor not found.",
        success: false 
      });
    }

    if (!getDonorDetails.BloodBank || !getDonorDetails.city) {
      return res.status(400).json({ 
        error: "Donor profile incomplete. Blood bank or city information missing.",
        success: false 
      });
    }

    // Get patient details
    const getPatientDetails = await prisma.patients.findUnique({
      where: {
        id: patientId
      },
      select: {
        id: true,
        name: true,
        BloodBank: true,
        BloodType: true,
        city: true
      }
    });

    if (!getPatientDetails) {
      return res.status(404).json({ 
        error: "Patient not found.",
        success: false 
      });
    }

    if (!getPatientDetails.BloodBank || !getPatientDetails.city) {
      return res.status(400).json({ 
        error: "Patient profile incomplete. Blood bank or city information missing.",
        success: false 
      });
    }

  
    if (!isBloodTypeCompatible(getDonorDetails.BloodType, getPatientDetails.BloodType)) {
      return res.status(400).json({ 
        error: `Blood type incompatible. Donor (${getDonorDetails.BloodType}) cannot donate to patient (${getPatientDetails.BloodType}).`,
        success: false 
      });
    }
    const getDonorBloodBankDetails = await prisma.bloodBanks.findFirst({
      where: {
        name: getDonorDetails.BloodBank,
        city: getDonorDetails.city
      },
      select: {
        id: true,
        name: true,
        city: true
      }
    });

    if (!getDonorBloodBankDetails) {
      return res.status(404).json({ 
        error: "Donor's associated blood bank not found.",
        success: false 
      });
    }

    const existingRequest = await prisma.donationRequest.findFirst({
      where: {
        donorId: getDonorDetails.id,
        patientId: patientId,
        status: "pending"
      }
    });

    if (existingRequest) {
      return res.status(409).json({ 
        error: "You already have a pending donation request for this patient.",
        success: false,
        existingRequestId: existingRequest.id
      });
    }

    // Create donation request
    const donationRequest = await prisma.donationRequest.create({
      data: {
        donorId: getDonorDetails.id,
        donor: getDonorDetails.name,
        bloodBankId: getDonorBloodBankDetails.id,
        bloodBank: getDonorBloodBankDetails.name,
        donorBloodType: getDonorDetails.BloodType,
        patientId: patientId,
        patientCity: getPatientDetails.city,
        patientBloodBankId: "hello",
        patientBloodBankName: getPatientDetails.name,
        patientBloodType: getPatientDetails.BloodType
        // status and createdAt will use default values from schema
      }
    });

    // Success response
    return res.status(201).json({
      success: true,
      message: "Donation request submitted successfully.",
      data: {
        requestId: donationRequest.id,
        donor: {
          id: getDonorDetails.id,
          name: getDonorDetails.name,
          bloodType: getDonorDetails.BloodType,
          city: getDonorDetails.city,
          bloodBank: getDonorBloodBankDetails.name
        },
        patient: {
          id: getPatientDetails.id,
          name: getPatientDetails.name,
          bloodType: getPatientDetails.BloodType,
          city: getPatientDetails.city,
          bloodBank: "hello"
        },
        status: donationRequest.status,
        createdAt: donationRequest.createdAt
      }
    });

  } catch (error) {
    console.error("Error in donate1 handler:", error);
    
    // Handle specific Prisma errors
    if (typeof error === "object" && error !== null && "code" in error) {
      const err = error as { code?: string };
      if (err.code === 'P2002') {
        return res.status(409).json({ 
          error: "Duplicate donation request.",
          success: false 
        });
      }
      if (err.code === 'P2025') {
        return res.status(404).json({ 
          error: "Required record not found.",
          success: false 
        });
      }
    }

    return res.status(500).json({ 
      error: "Internal Server Error",
      success: false 
    });
  }
};

// Blood type compatibility checker
function isBloodTypeCompatible(donorType: string, patientType: string): boolean {
  const compatibility: Record<string, string[]> = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+'] // Universal receiver (as patient)
  };
  
  return compatibility[donorType]?.includes(patientType) || false;
}

export { donate1 };