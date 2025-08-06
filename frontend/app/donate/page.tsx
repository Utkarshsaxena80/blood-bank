"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, HeartPulse, Droplets, Clock, UserCheck, XCircle, AlertCircle } from "lucide-react";
import axios from "axios";

// This interface is to match the expected successful response from your backend.
// It is crucial for type safety and code readability.
interface DonationResponse {
  success: boolean;
  message?: string;
  data?: {
    requestId: string;
    donor: {
      id: string;
      name: string;
      bloodType: string;
      city: string;
      bloodBank: string;
    };
    patient: {
      id: string;
      name: string;
      bloodType: string;
      city: string;
      bloodBank: string;
    };
    status: string;
    createdAt: string;
  };
  error?: string;
}

// Reusable InfoCard component for cleaner JSX
function InfoCard({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <Icon className="h-6 w-6 text-red-500 mr-3" />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 text-left">{text}</p>
    </div>
  );
}

export default function DonateConfirmationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [donationResult, setDonationResult] = useState<DonationResponse | null>(null);
  
  // Get the requestId from the URL query parameters
  const requestId = params.get("requestId");

  useEffect(() => {
    // If there's no requestId in the URL, redirect to the home page
    if (!requestId) {
      router.push("/");
      return;
    }

    const fetchDonationDetails = async () => {
      try {
        setLoading(true);

        // Fetch the donation details from the backend using the requestId
        const response = await axios.get(`http://localhost:5000/donation-request/${requestId}`);
        
        if (response.data.success) {
          setDonationResult(response.data);
        } else {
          setDonationResult({ success: false, error: response.data.error });
        }
      } catch (err: any) {
        console.error("Failed to fetch donation details:", err);
        setDonationResult({
          success: false,
          error: err.response?.data?.error || "Failed to load donation details. Please try again."
        });
      } finally {
        // Set a small delay to make the loading state feel more natural
        setTimeout(() => setLoading(false), 500); 
      }
    };

    fetchDonationDetails();
  }, [requestId, router]);

  // --- RENDERING LOGIC ---

  // Loading state: shows a spinner while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mb-4"></div>
        <p className="text-gray-600">Loading your donation confirmation...</p>
        <p className="text-sm text-gray-500 mt-2">This should only take a moment.</p>
      </div>
    );
  }

  // Error state: displays a failure message if the fetch failed
  if (!donationResult?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Donation Confirmation Failed
          </h1>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800 font-medium">
                {donationResult?.error || 'Something went wrong. The donation request details could not be loaded.'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/patients")}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Back to Patient List
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state: displays all the confirmation details
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          ❤️ Thank You for Volunteering!
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Donation Request Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-500">Request ID</p>
              <p className="font-medium text-gray-900">{donationResult.data?.requestId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-green-600 capitalize">{donationResult.data?.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Patient</p>
              <p className="font-medium text-gray-900">{donationResult.data?.patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Blood Type Needed</p>
              <p className="font-medium text-gray-900">{donationResult.data?.patient.bloodType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Your Blood Bank</p>
              <p className="font-medium text-gray-900">{donationResult.data?.donor.bloodBank}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">City</p>
              <p className="font-medium text-gray-900">{donationResult.data?.patient.city}</p>
            </div>
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Your donation request has been successfully submitted and is now pending approval.
          <br />
          Once approved, please visit <strong>{donationResult.data?.donor.bloodBank}</strong> to complete your donation.
          <br />
          Don't forget to bring a valid ID. Your courage is saving lives — thank you!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <InfoCard 
            icon={HeartPulse} 
            title="Before Donation" 
            text="Eat a healthy meal and drink water beforehand." 
          />
          <InfoCard 
            icon={Droplets} 
            title="During Donation" 
            text="Relax and follow the staff's instructions." 
          />
          <InfoCard 
            icon={Clock} 
            title="Time Required" 
            text="The process usually takes about 10–15 minutes." 
          />
          <InfoCard 
            icon={UserCheck} 
            title="After Donation" 
            text="Have refreshments and rest before leaving." 
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push("/donations")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            View My Donations
          </button>
        </div>
      </div>
    </div>
  );
}