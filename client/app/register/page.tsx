"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, Eye, EyeOff, User, Briefcase } from "lucide-react"
import API from "@/services/api"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

type UserRole = "user" | "lawyer"

export default function RegisterPage() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<UserRole>("user")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Lawyer specific fields
    specialization: "",
    experience: "",
    barNumber: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name) {
      newErrors.name = "Name is required"
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (role === "lawyer") {
      if (!formData.specialization) {
        newErrors.specialization = "Specialization is required"
      }
      if (!formData.experience) {
        newErrors.experience = "Experience is required"
      }
      if (!formData.barNumber) {
        newErrors.barNumber = "Bar registration number is required"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      const registrationData = {
        ...formData,
        role: role
      }
      const response = await API.post('/auth/register', registrationData)
      const { token, user } = response.data
      login(token, user)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Scale className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold text-foreground">LegalConnect</span>
      </Link>

      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Join LegalConnect to find verified legal help</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Role Selection */}
          <div className="mb-6 flex gap-3">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                role === "user"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <User className={`h-6 w-6 ${role === "user" ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-sm font-medium ${role === "user" ? "text-primary" : "text-muted-foreground"}`}>
                Client
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole("lawyer")}
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                role === "lawyer"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Briefcase className={`h-6 w-6 ${role === "lawyer" ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-sm font-medium ${role === "lawyer" ? "text-primary" : "text-muted-foreground"}`}>
                Lawyer
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {role === "lawyer" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    type="text"
                    placeholder="e.g., Corporate Law, Family Law"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className={errors.specialization ? "border-destructive" : ""}
                  />
                  {errors.specialization && (
                    <p className="text-sm text-destructive">{errors.specialization}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className={errors.experience ? "border-destructive" : ""}
                  />
                  {errors.experience && (
                    <p className="text-sm text-destructive">{errors.experience}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="barNumber">Bar Registration Number</Label>
                  <Input
                    id="barNumber"
                    type="text"
                    placeholder="Enter your bar number"
                    value={formData.barNumber}
                    onChange={(e) => setFormData({ ...formData, barNumber: e.target.value })}
                    className={errors.barNumber ? "border-destructive" : ""}
                  />
                  {errors.barNumber && (
                    <p className="text-sm text-destructive">{errors.barNumber}</p>
                  )}
                </div>
              </>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
