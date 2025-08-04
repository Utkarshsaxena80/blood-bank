"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2 } from "lucide-react"
import { z } from "zod"

const adminSchema = z.object({
  adminName: z.string().min(2, "Name is too short"),
  licenseNumber: z.string().min(2, "License number required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Invalid phone number"),
  bloodBank: z.string().min(1, "Blood bank is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
})

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    adminName: "",
    licenseNumber: "",
    email: "",
    password: "",
    phone: "",
    bloodBank: "",
    city: "",
    state: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = adminSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    alert("Admin registration successful (mock)!")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center space-x-2 mb-6">
          <Building2 className="h-7 w-7 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bank Admin Registration</h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <input className="block w-full px-4 py-2 text-base rounded-lg border border-input bg-background text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="Full Name" name="adminName" value={formData.adminName} onChange={handleChange} />
          {errors.adminName && <p className="text-red-600 text-xs mt-1">{errors.adminName}</p>}
          <input className="block w-full px-4 py-2 text-base rounded-lg border border-input bg-background text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} />
          {errors.licenseNumber && <p className="text-red-600 text-xs mt-1">{errors.licenseNumber}</p>}
          <input className="block w-full px-4 py-2 text-base rounded-lg border border-input bg-background text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          <input className="block w-full px-4 py-2 text-base rounded-lg border border-input bg-background text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="Password" name="password" value={formData.password} onChange={handleChange} type="password" />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          <input className="block w-full px-4 py-2 text-base rounded-lg border border-input bg-background text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
          <input className="block w-full px-4 py-2 text-base rounded-lg border border-input bg-background text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="Blood Bank Name" name="bloodBank" value={formData.bloodBank} onChange={handleChange} />
          {errors.bloodBank && <p className="text-red-600 text-xs mt-1">{errors.bloodBank}</p>}
          <input className="block w-full px-4 py-2 text-base rounded-lg border border-input bg-background text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="City" name="city" value={formData.city} onChange={handleChange} />
          {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
          <input className="block w-full px-4 py-2 text-base rounded-lg border border-input bg-background text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="State" name="state" value={formData.state} onChange={handleChange} />
          {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login/admin" className="text-red-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}