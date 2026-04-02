"use client"

import { useState, useMemo, Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LawyerCard } from "@/components/lawyer-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react"
import { toast } from "sonner"
import { dummyLawyers } from "@/data/lawyers"

function LawyersContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [lawyersList, setLawyersList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Local state for filters
  const [specialization, setSpecialization] = useState(searchParams.get("specialization") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [minExperience, setMinExperience] = useState(searchParams.get("minExperience") || "")
  const [maxFees, setMaxFees] = useState(searchParams.get("maxFees") || "")
  
  const [showFilters, setShowFilters] = useState(false)

  const fetchLawyersSimulated = async () => {
    setLoading(true)
    setError(null)
    
    // 1.5s delay simulation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // Frontend-only filtering logic
      let filtered = [...dummyLawyers]

      if (specialization) {
        filtered = filtered.filter(l => 
          l.specialization.toLowerCase().includes(specialization.toLowerCase())
        )
      }

      if (location) {
        filtered = filtered.filter(l => 
          l.location.toLowerCase().includes(location.toLowerCase())
        )
      }

      if (minExperience) {
        filtered = filtered.filter(l => 
          l.experience >= Number(minExperience)
        )
      }

      if (maxFees) {
        filtered = filtered.filter(l => 
          l.fees <= Number(maxFees)
        )
      }

      setLawyersList(filtered)
      
      // Update URL without refreshing
      const urlParams = new URLSearchParams()
      if (specialization) urlParams.set("specialization", specialization)
      if (location) urlParams.set("location", location)
      if (minExperience) urlParams.set("minExperience", minExperience)
      if (maxFees) urlParams.set("maxFees", maxFees)
      
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`
      window.history.pushState({}, '', newUrl)
    } catch (err: any) {
      console.error("Filter error:", err)
      setError("An error occurred while filtering data.")
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount and when filters change (debounced for inputs)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLawyersSimulated()
    }, 500)
    return () => clearTimeout(timer)
  }, [specialization, location, minExperience, maxFees])

  const clearFilters = () => {
    setSpecialization("")
    setLocation("")
    setMinExperience("")
    setMaxFees("")
  }

  const hasFilters = specialization || location || minExperience || maxFees

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Find a Lawyer (Demo Mode)</h1>
            <p className="text-muted-foreground">
              Explore our verified network of legal professionals using static test data.
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filters Sidebar */}
            <aside
              className={`w-full shrink-0 lg:block lg:w-72 ${
                showFilters ? "block" : "hidden"
              }`}
            >
              <Card className="sticky top-24 border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  {hasFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 gap-1 text-sm text-primary"
                    >
                      <X className="h-3 w-3" />
                      Clear all
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="specialization"
                        placeholder="e.g. Criminal"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="e.g. Delhi"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="experience">Min Experience (Years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      placeholder="e.g. 5"
                      value={minExperience}
                      onChange={(e) => setMinExperience(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="maxFees">Max Fees per Session</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        id="maxFees"
                        type="number"
                        placeholder="e.g. 5000"
                        value={maxFees}
                        onChange={(e) => setMaxFees(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {loading ? "Searching..." : `Showing ${lawyersList.length} lawyer${lawyersList.length !== 1 ? "s" : ""}`}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="h-40 animate-pulse bg-muted/30" />
                  ))}
                </div>
              ) : error ? (
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center text-destructive">
                    <p className="mb-2 font-semibold">Error</p>
                    <p>{error}</p>
                    <Button variant="outline" className="mt-4" onClick={fetchLawyersSimulated}>
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              ) : lawyersList.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {lawyersList.map((lawyer: any) => (
                    <LawyerCard key={lawyer._id} lawyer={lawyer} />
                  ))}
                </div>
              ) : (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
                      <Search className="h-8 w-8" />
                    </div>
                    <p className="mb-2 text-xl font-semibold text-foreground">
                      No lawyers found
                    </p>
                    <p className="mb-6 text-muted-foreground">
                      No static data matches your current criteria.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear all filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function LawyersPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>}>
      <LawyersContent />
    </Suspense>
  )
}
