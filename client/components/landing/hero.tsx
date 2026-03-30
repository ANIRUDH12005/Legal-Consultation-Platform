"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Shield, Clock, Users } from "lucide-react"

export function Hero() {
  const router = useRouter()
  const [specialization, setSpecialization] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (specialization) params.set("specialization", specialization)
    if (location) params.set("location", location)
    router.push(`/lawyers?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-secondary-foreground">
            <Shield className="h-4 w-4 text-accent" />
            <span>Trusted by 10,000+ clients nationwide</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <span className="text-balance">Find Verified Lawyers</span>
            <br />
            <span className="text-primary">Instantly</span>
          </h1>
          
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
            Connect with experienced, verified legal professionals. Get expert advice for your legal matters with just a few clicks.
          </p>

          <form onSubmit={handleSearch} className="mx-auto mb-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by specialization..."
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="h-12 pl-10"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 pl-10"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8">
              Find Lawyer
            </Button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <span>Verified Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              <span>Quick Response</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              <span>5000+ Lawyers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
