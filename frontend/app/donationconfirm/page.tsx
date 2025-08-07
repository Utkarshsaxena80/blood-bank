"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function DonationConfirmationPage() {
  const searchParams = useSearchParams();
  const patientName = searchParams.get("name");
  const bloodType = searchParams.get("bloodType");

  useEffect(() => {
    toast.success("Donation registered successfully!", { duration: 3000 });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-10">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl max-w-2xl w-full p-8 border border-red-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 text-center mb-4">
          🎉 Thank You, Hero!
        </h1>
        
        <div className="bg-red-50 dark:bg-gray-700 rounded-lg p-4 mb-6 border border-red-100 dark:border-red-900">
          <p className="text-lg text-gray-700 dark:text-gray-200 text-center">
            Your donation will help <strong className="text-red-600 dark:text-red-400">
              {patientName || "a patient in need"}
              {bloodType && ` (${bloodType})`}
            </strong>.
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-100">
          <h2 className="text-xl font-semibold text-red-500 mb-2">🩸 What to Expect</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>The process takes only about 10 minutes.</li>
            <li>Bring a valid ID and donor card (if any).</li>
            <li>Stay hydrated and have a light meal before donating.</li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <h2 className="text-xl font-semibold text-green-600 mb-2">✅ Quick Precautions</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Do not donate on an empty stomach.</li>
            <li>Inform staff of any recent illness or medication.</li>
            <li>Avoid heavy physical activity after donation.</li>
          </ul>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">Please proceed to the nearest blood bank to complete your donation. Your small act of kindness saves lives!</p>
        </div>
      </div>
    </div>
  );
}
