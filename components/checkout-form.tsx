"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CheckoutFormProps {
  onSubmit: (data: { name: string; email: string }) => Promise<void>
  loading: boolean
}

export default function CheckoutForm({ onSubmit, loading }: CheckoutFormProps) {
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      await onSubmit(formData)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John Doe"
              disabled={loading}
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="john@example.com"
              disabled={loading}
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Complete Purchase"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
