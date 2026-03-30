"use client"

import { useState, Suspense, use, useEffect } from "react"
import { useSearchParams, notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  MapPin,
  Briefcase,
  DollarSign,
  GraduationCap,
  Languages,
  Calendar,
  Video,
  CheckCircle,
  Send,
} from "lucide-react"
import { lawyers } from "@/lib/data"

import API from "@/services/api"
import { toast } from "sonner"
import { Lawyer } from "@/lib/data"
import { useAuth } from "@/context/AuthContext"
import { Textarea } from "@/components/ui/textarea"

function ReviewForm({ lawyerId, onReviewSubmitted }: { lawyerId: string, onReviewSubmitted: () => void }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment) {
      toast.error("Please provide a comment")
      return
    }

    setIsSubmitting(true)
    try {
      await API.post('/reviews', { lawyerId, rating, comment })
      toast.success("Review submitted successfully")
      setComment("")
      setRating(5)
      onReviewSubmitted()
    } catch (error) {
      toast.error("Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mb-6 border-border">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-card-foreground">Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      s <= rating ? "fill-accent text-accent" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Textarea
              placeholder="Share your experience with this lawyer..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="self-end">
            {isSubmitting ? "Submitting..." : "Submit Review"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function LawyerProfileContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const searchParams = useSearchParams()
  const showBooking = searchParams.get("book") === "true"
  
  const { user } = useAuth()
  
  const [lawyer, setLawyer] = useState<Lawyer | null>(null)
  const [lawyerReviews, setLawyerReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isBookingOpen, setIsBookingOpen] = useState(showBooking)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [lawyerRes, reviewsRes] = await Promise.all([
        API.get(`/lawyers/${resolvedParams.id}`),
        API.get(`/reviews/${resolvedParams.id}`)
      ])
      setLawyer(lawyerRes.data)
      setLawyerReviews(reviewsRes.data)
    } catch (error) {
      console.error("Error fetching lawyer details:", error)
      toast.error("Failed to load lawyer details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [resolvedParams.id])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading lawyer profile...</div>
  }

  if (!lawyer) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Profile Header */}
              <Card className="mb-6 border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-primary/10 text-4xl font-bold text-primary">
                      {lawyer.name.split(" ").map((n) => n[0]).join("")}
                    </div>

                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h1 className="text-2xl font-bold text-card-foreground">{lawyer.name}</h1>
                          <Badge variant="secondary" className="mt-2">
                            {lawyer.specialization}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5">
                          <Star className="h-5 w-5 fill-accent text-accent" />
                          <span className="font-semibold text-foreground">{lawyer.rating}</span>
                          <span className="text-muted-foreground">({lawyer.reviewCount} reviews)</span>
                        </div>
                      </div>

                      <div className="mb-4 flex flex-wrap gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          <span>{lawyer.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4" />
                          <span>{lawyer.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4" />
                          <span>${lawyer.fees}/consultation</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button size="lg" onClick={() => setIsBookingOpen(true)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Appointment
                        </Button>
                        <Button size="lg" variant="outline">
                          <Video className="mr-2 h-4 w-4" />
                          Video Consultation
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card className="mb-6 border-border">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{lawyer.bio}</p>
                </CardContent>
              </Card>

              {/* Review Form */}
              {user?.role === 'user' && (
                <ReviewForm lawyerId={resolvedParams.id} onReviewSubmitted={fetchData} />
              )}

              {/* Reviews */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Client Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    {lawyerReviews.length > 0 ? (
                      lawyerReviews.map((review: any) => (
                        <div key={review._id || review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                {review.user?.name?.[0] || 'U'}
                              </div>
                              <div>
                                <p className="font-medium text-card-foreground">{review.user?.name || 'Anonymous'}</p>
                                <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex gap-0.5">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment || review.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="py-8 text-center text-muted-foreground">No reviews yet for this lawyer.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-border">
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-card-foreground">Education</p>
                      <p className="text-sm text-muted-foreground">{lawyer.education}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Languages className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-card-foreground">Languages</p>
                      <p className="text-sm text-muted-foreground">{lawyer.languages.join(", ")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-card-foreground">Verified Attorney</p>
                      <p className="text-sm text-muted-foreground">Background & credentials verified</p>
                    </div>
                  </div>

                  <hr className="my-2 border-border" />

                  <div>
                    <p className="mb-2 font-medium text-card-foreground">Consultation Fee</p>
                    <p className="text-3xl font-bold text-primary">${lawyer.fees}</p>
                    <p className="text-sm text-muted-foreground">per session</p>
                  </div>

                  <Button className="w-full" size="lg" onClick={() => setIsBookingOpen(true)}>
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <BookingModal
        lawyer={lawyer}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  )
}

export default function LawyerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LawyerProfileContent params={params} />
    </Suspense>
  )
}
