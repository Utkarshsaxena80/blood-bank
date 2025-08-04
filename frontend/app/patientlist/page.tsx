"use client"

import { useState, useEffect } from "react";
import axios from "axios";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  BloodBank: string;
  BloodType: string;
  city: string;
  status: boolean;
}

export default function PatientListPage() {
  const [cityFilter, setCityFilter] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityFilter) {
      setPatients([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get("http://localhost:3001/getBycity", {
        params: {
          field: 1,
          city: cityFilter,
        },
      })
      .then((res) => {
        const data = res.data;
        if (data.success) {
          setPatients(data.data || []);
        } else {
          setPatients([]);
          setError(data.message || "No patients found");
        }
      })
      .catch(() => {
        setError("Failed to fetch patients");
        setPatients([]);
      })
      .finally(() => setLoading(false));
  }, [cityFilter]);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Patients Seeking Blood</h1>
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <a
            href="/register/donor"
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl text-center"
          >
            Become a Donor
          </a>
          <a
            href="/blood-banks"
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl text-center"
          >
            Find Blood Banks
          </a>
        </div>
        <input
          type="text"
          placeholder="Filter by city..."
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        {loading && <div className="text-gray-500 mb-4">Loading...</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <ul className="space-y-4">
          {patients.map((patient) => (
            <li
              key={patient.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <span className="font-medium text-gray-900 dark:text-white">{patient.name}</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">({patient.BloodType})</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <span className="text-gray-500 dark:text-gray-400">{patient.city}</span>
                <span className="text-gray-500 dark:text-gray-400">{patient.BloodBank}</span>
                {/* Optionally show email/phone if you want */}
              </div>
            </li>
          ))}
          {!loading && patients.length === 0 && !error && (
            <li className="text-gray-500 dark:text-gray-400">No patients found for this city.</li>
          )}
        </ul>
      </div>
    </div>
  );
}