"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarIcon, Clock, MapPin, Video, CheckCircle, ChevronLeft } from "lucide-react"
import API from "@/services/api"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"


const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
]

const getNextSevenDays = () => {
  const days = []
  const today = new Date()
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push(date)
  }
  return days
}

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  
  const [lawyer, setLawyer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [consultationType, setConsultationType] = useState<"video" | "in-person">("video")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const days = getNextSevenDays()

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const response = await API.get(`/lawyers/${resolvedParams.id}`)
        setLawyer(response.data)
      } catch (error) {
        console.error("Error fetching lawyer:", error)
        toast.error("Failed to load lawyer details")
      } finally {
        setLoading(false)
      }
    }
    fetchLawyer()
  }, [resolvedParams.id])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    })
  }

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time")
      return
    }

    setIsSubmitting(true)
    try {
      const bookingData = {
        lawyerId: lawyer._id,
        date: selectedDate.toISOString().split('T')[0], // Just the date part
        time: selectedTime,
        type: consultationType,
        notes: notes
      }
      await API.post('/appointments', bookingData)
      setIsConfirmed(true)
      toast.success("Appointment booked successfully!")
    } catch (error: any) {
      console.error("Booking error:", error)
      const message = error.response?.data?.message || 'Failed to book appointment'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3 text-lg">Loading booking details...</span>
        </div>
        <Footer />
      </div>
    )
  }

  if (!lawyer) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold">Lawyer Not Found</h2>
          <p className="text-muted-foreground mt-2">The lawyer you are looking for does not exist or has been removed.</p>
          <Button onClick={() => router.push('/lawyers')} className="mt-6">Back to Lawyers</Button>
        </div>
        <Footer />
      </div>
    )
  }

  const lawyerName = lawyer.user?.name || lawyer.name

  if (isConfirmed) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-background py-12">
          <div className="mx-auto max-w-2xl px-4">
            <Card className="border-border shadow-lg">
              <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
                  <CheckCircle className="h-10 w-10 text-accent" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Booking Confirmed!</h1>
                  <p className="text-muted-foreground mt-2 text-lg">
                    Your appointment with <span className="font-semibold text-foreground">{lawyerName}</span> is scheduled.
                  </p>
                </div>
                
                <div className="w-full rounded-lg bg-muted/50 p-6 text-left">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{selectedDate && formatDate(selectedDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{selectedTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{consultationType === "video" ? "Video Call" : "In-Person Consultation"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location/Platform</p>
                      <p className="font-medium">{consultationType === "video" ? "Online Video Room" : lawyer.location}</p>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row">
                  <Button variant="outline" className="flex-1" onClick={() => router.push('/dashboard')}>
                    View Dashboard
                  </Button>
                  <Button className="flex-1" onClick={() => router.push('/lawyers')}>
                    Find More Lawyers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="mb-6 gap-2" 
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Book Your Consultation</h1>
                <p className="text-muted-foreground mt-2">
                  Complete the steps below to schedule a session with {lawyerName}.
                </p>
              </div>

              {/* Step 1: Consultation Type */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</div>
                  <h2 className="text-xl font-semibold">Consultation Type</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setConsultationType("video")}
                    className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                      consultationType === "video"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className={`rounded-full p-3 ${consultationType === "video" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                      <Video className="h-6 w-6" />
                    </div>
                    <div>
                      <p className={`font-bold ${consultationType === "video" ? "text-primary" : "text-foreground"}`}>Video Call</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Consult from anywhere</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationType("in-person")}
                    className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                      consultationType === "in-person"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className={`rounded-full p-3 ${consultationType === "in-person" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className={`font-bold ${consultationType === "in-person" ? "text-primary" : "text-foreground"}`}>In-Person</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Visit lawyer's office</p>
                    </div>
                  </button>
                </div>
              </section>

              {/* Step 2: Date & Time */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</div>
                  <h2 className="text-xl font-semibold">Select Date & Time</h2>
                </div>
                
                <Card className="border-border">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <Label className="mb-3 block text-sm font-medium">Available Dates</Label>
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                        {days.map((date) => (
                          <button
                            key={date.toISOString()}
                            type="button"
                            onClick={() => setSelectedDate(date)}
                            className={`flex flex-col items-center justify-center rounded-lg border py-3 px-2 transition-all ${
                              selectedDate?.toDateString() === date.toDateString()
                                ? "border-primary bg-primary text-primary-foreground shadow-sm scale-105"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold tracking-tighter opacity-80">{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                            <span className="text-xl font-bold mt-1">{date.getDate()}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-3 block text-sm font-medium">Available Time Slots</Label>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                              selectedTime === time
                                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Step 3: Additional Notes */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">3</div>
                  <h2 className="text-xl font-semibold">Additional Details</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">Briefly describe your case (Optional)</Label>
                    <div className="relative">
                      <Textarea
                        id="notes"
                        placeholder="Please provide some context about your legal matter so the lawyer can prepare..."
                        className="min-h-[120px] focus-visible:ring-primary"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-border shadow-lg overflow-hidden">
                <div className="bg-primary px-6 py-4">
                  <h3 className="text-lg font-bold text-primary-foreground">Summary</h3>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                      {lawyerName?.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-bold text-foreground leading-tight">{lawyerName}</p>
                      <p className="text-xs text-muted-foreground">{lawyer.specialization}</p>
                    </div>
                  </div>

                  <div className="space-y-3 py-4 border-y border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <CalendarIcon className="h-3.5 w-3.5" /> Date
                      </span>
                      <span className="font-semibold">{selectedDate ? formatDate(selectedDate).split(',')[1] : "Not selected"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" /> Time
                      </span>
                      <span className="font-semibold">{selectedTime || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Video className="h-3.5 w-3.5" /> Type
                      </span>
                      <span className="font-semibold capitalize">{consultationType}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium">Consultation Fee</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-primary">₹{lawyer.fees}</span>
                      <p className="text-[10px] text-muted-foreground">Incl. all taxes</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full text-base font-bold h-12" 
                    disabled={!selectedDate || !selectedTime || isSubmitting}
                    onClick={handleConfirmBooking}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Processing...
                      </div>
                    ) : (
                      "Confirm & Pay"
                    )}
                  </Button>
                  
                  <p className="text-[10px] text-center text-muted-foreground">
                    By confirming, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
