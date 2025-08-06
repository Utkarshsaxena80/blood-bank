"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface DonationRequest {
  id: string;
  donor: string;
  donorBloodType: string;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
}

export default function DonationRequestsTable() {
  const [donations, setDonations] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch("/getDonations", {
          credentials: "include", // send authToken cookie
        });

        if (res.status === 401) {
          // Not authenticated → redirect to login
          router.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch donation requests");
        }

        const body = await res.json();
        setDonations(body.data || []);
      } catch (err: any) {
        console.error("Error fetching donations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [router]);

  const getStatusBadge = (status: DonationRequest["status"]) => {
    const base = "inline-flex items-center px-2 py-1 text-xs rounded-full";
    switch (status) {
      case "approved":
        return `${base} bg-green-100 text-green-800`;
      case "pending":
        return `${base} bg-yellow-100 text-yellow-800`;
      case "rejected":
        return `${base} bg-red-100 text-red-800`;
      case "completed":
        return `${base} bg-blue-100 text-blue-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status: DonationRequest["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="mr-1 h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="mr-1 h-4 w-4 text-yellow-600" />;
      case "rejected":
        return <XCircle className="mr-1 h-4 w-4 text-red-600" />;
      case "completed":
        return <CheckCircle className="mr-1 h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="mr-1 h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Donor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Blood Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Requested At
            </th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {donations.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {d.donor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {d.donorBloodType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getStatusBadge(d.status)}>
                  {getStatusIcon(d.status)}
                  {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(d.createdAt).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button className="text-indigo-600 hover:text-indigo-900">View</button>
                <button className="text-green-600 hover:text-green-900">Approve</button>
                <button className="text-red-600 hover:text-red-900">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
