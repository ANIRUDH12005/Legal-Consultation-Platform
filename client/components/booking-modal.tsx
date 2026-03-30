"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Video, MapPin, CheckCircle } from "lucide-react"
import type { Lawyer } from "@/lib/data"

interface BookingModalProps {
  lawyer: Lawyer
  isOpen: boolean
  onClose: () => void
}

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

import API from "@/services/api"
import { toast } from "sonner"

export function BookingModal({ lawyer, isOpen, onClose }: BookingModalProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [consultationType, setConsultationType] = useState<"video" | "in-person">("video")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const days = getNextSevenDays()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) return

    setIsLoading(true)
    try {
      const bookingData = {
        lawyerId: lawyer._id || (lawyer as any).id,
        date: selectedDate.toISOString(),
        time: selectedTime,
        type: consultationType,
        notes: notes
      }
      await API.post('/appointments', bookingData)
      setStep(3)
    } catch (error: any) {
      console.error("Booking error:", error)
      const message = error.response?.data?.message || 'Failed to book appointment. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setSelectedDate(null)
    setSelectedTime("")
    setNotes("")
    onClose()
  }

  const goToDashboard = () => {
    handleClose()
    router.push("/dashboard")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === 3 ? "Booking Confirmed!" : "Book Appointment"}
          </DialogTitle>
          <DialogDescription>
            {step === 3
              ? "Your appointment has been successfully booked."
              : `Schedule a consultation with ${lawyer.name}`}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="flex flex-col gap-6">
            {/* Consultation Type */}
            <div>
              <Label className="mb-3 block">Consultation Type</Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConsultationType("video")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    consultationType === "video"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Video className={`h-5 w-5 ${consultationType === "video" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`font-medium ${consultationType === "video" ? "text-primary" : "text-muted-foreground"}`}>
                    Video Call
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationType("in-person")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    consultationType === "in-person"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <MapPin className={`h-5 w-5 ${consultationType === "in-person" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`font-medium ${consultationType === "in-person" ? "text-primary" : "text-muted-foreground"}`}>
                    In Person
                  </span>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <Label className="mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Select Date
              </Label>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {days.map((date) => (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center rounded-lg border p-2 transition-colors ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-xs">{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                    <span className="text-lg font-semibold">{date.getDate()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <Label className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Select Time
              </Label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                      selectedTime === time
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="mb-2 block">
                Additional Notes (optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Describe your legal matter briefly..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(2)}
            >
              Continue to Review
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <h4 className="mb-4 font-semibold text-card-foreground">Booking Summary</h4>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lawyer</span>
                  <span className="font-medium text-card-foreground">{lawyer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialization</span>
                  <span className="font-medium text-card-foreground">{lawyer.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-card-foreground">{selectedDate && formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-card-foreground">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-card-foreground capitalize">{consultationType === "video" ? "Video Call" : "In Person"}</span>
                </div>
                {notes && (
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Notes</span>
                    <span className="text-card-foreground">{notes}</span>
                  </div>
                )}
                <hr className="my-2 border-border" />
                <div className="flex justify-between text-base">
                  <span className="font-medium text-card-foreground">Consultation Fee</span>
                  <span className="font-bold text-primary">${lawyer.fees}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirmBooking}
                disabled={isLoading}
              >
                {isLoading ? "Confirming..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center gap-6 py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                Appointment Booked Successfully!
              </h3>
              <p className="text-muted-foreground">
                Your appointment with {lawyer.name} is confirmed for{" "}
                {selectedDate && formatDate(selectedDate)} at {selectedTime}.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              You will receive a confirmation email with the meeting details shortly.
            </p>
            <div className="flex w-full gap-3">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Close
              </Button>
              <Button className="flex-1" onClick={goToDashboard}>
                View Dashboard
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
