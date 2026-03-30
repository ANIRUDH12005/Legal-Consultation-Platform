"use client"

import { useState, useMemo, Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
import { Search, SlidersHorizontal, X } from "lucide-react"
import API from "@/services/api"
import { toast } from "sonner"
import { Lawyer, specializations, locations } from "@/lib/data"

function LawyersContent() {
  const searchParams = useSearchParams()
  const initialSpecialization = searchParams.get("specialization") || ""
  const initialLocation = searchParams.get("location") || ""

  const [lawyersList, setLawyersList] = useState<Lawyer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [specialization, setSpecialization] = useState(initialSpecialization)
  const [location, setLocation] = useState(initialLocation)
  const [experience, setExperience] = useState("")
  const [maxFees, setMaxFees] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const fetchLawyers = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (search) params.search = search
      if (specialization && specialization !== 'all') params.specialization = specialization
      if (location && location !== 'all') params.location = location
      if (experience && experience !== 'all') params.experience = experience
      if (maxFees) params.maxFees = maxFees

      const response = await API.get('/lawyers', { params })
      setLawyersList(response.data)
    } catch (error) {
      console.error("Error fetching lawyers:", error)
      toast.error("Failed to fetch lawyers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLawyers()
  }, [specialization, location, experience, maxFees])

  // Call fetch on search submit or debounce
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchLawyers()
  }

  const clearFilters = () => {
    setSearch("")
    setSpecialization("")
    setLocation("")
    setExperience("")
    setMaxFees("")
    // Fetch will be triggered by useEffect for dropdowns, but for search we might need manual trigger
  }

  const hasFilters = search || specialization || location || experience || maxFees

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Find a Lawyer</h1>
            <p className="text-muted-foreground">
              Browse through our network of verified legal professionals
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button
              variant="outline"
              type="button"
              className="h-12 gap-2 lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </form>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filters Sidebar */}
            <aside
              className={`w-full shrink-0 lg:block lg:w-72 ${
                showFilters ? "block" : "hidden"
              }`}
            >
              <Card className="sticky top-24 border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  {hasFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 gap-1 text-sm"
                    >
                      <X className="h-3 w-3" />
                      Clear all
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <Label>Specialization</Label>
                    <Select value={specialization} onValueChange={setSpecialization}>
                      <SelectTrigger>
                        <SelectValue placeholder="All specializations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All specializations</SelectItem>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Location</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All locations</SelectItem>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Experience</Label>
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any experience</SelectItem>
                        <SelectItem value="0-5">0-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Max Fees (per consultation)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 200"
                      value={maxFees}
                      onChange={(e) => setMaxFees(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {lawyersList.length} lawyer{lawyersList.length !== 1 ? "s" : ""}
                </p>
              </div>

              {loading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-48 animate-pulse bg-muted/50" />
                  ))}
                </div>
              ) : lawyersList.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {lawyersList.map((lawyer: any) => (
                    <LawyerCard key={lawyer._id || lawyer.id} lawyer={lawyer} />
                  ))}
                </div>
              ) : (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="mb-2 text-lg font-medium text-card-foreground">
                      No lawyers found
                    </p>
                    <p className="mb-4 text-muted-foreground">
                      Try adjusting your filters or search terms
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear filters
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
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LawyersContent />
    </Suspense>
  )
}
