"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react"
import { lawyerAppointments, type Appointment } from "@/lib/data"

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
  accepted: { label: "Accepted", variant: "default" as const, icon: CheckCircle },
  rejected: { label: "Rejected", variant: "destructive" as const, icon: XCircle },
  completed: { label: "Completed", variant: "outline" as const, icon: CheckCircle },
}

export default function LawyerDashboard() {
  const [appointments, setAppointments] = useState(lawyerAppointments)

  const pendingAppointments = appointments.filter((apt) => apt.status === "pending")
  const acceptedAppointments = appointments.filter((apt) => apt.status === "accepted")
  const completedAppointments = appointments.filter((apt) => apt.status === "completed")

  const totalEarnings = completedAppointments.length * 250 // Mock fee
  const monthlyEarnings = completedAppointments.length * 250

  const stats = {
    totalClients: new Set(appointments.map((apt) => apt.userId)).size,
    pendingRequests: pendingAppointments.length,
    completedSessions: completedAppointments.length,
    monthlyEarnings,
  }

  const handleAccept = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "accepted" as const } : apt
      )
    )
  }

  const handleReject = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "rejected" as const } : apt
      )
    )
  }

  const AppointmentCard = ({
    appointment,
    showActions = false,
  }: {
    appointment: Appointment
    showActions?: boolean
  }) => {
    const status = statusConfig[appointment.status]
    return (
      <div className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {appointment.userName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{appointment.userName}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {appointment.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {appointment.time}
              </span>
              <span className="flex items-center gap-1">
                {appointment.type === "video" ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {appointment.type === "video" ? "Video Call" : "In Person"}
              </span>
            </div>
            {appointment.notes && (
              <p className="mt-2 text-sm text-muted-foreground">{appointment.notes}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {showActions && appointment.status === "pending" ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(appointment.id)}
              >
                <XCircle className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button size="sm" onClick={() => handleAccept(appointment.id)}>
                <CheckCircle className="mr-1 h-4 w-4" />
                Accept
              </Button>
            </>
          ) : (
            <Badge variant={status.variant}>
              <status.icon className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Lawyer Dashboard</h1>
            <p className="text-muted-foreground">Manage your appointments and earnings</p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats.totalClients}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                  <Clock className="h-6 w-6 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats.pendingRequests}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                  <CheckCircle className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Sessions</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats.completedSessions}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                  <p className="text-2xl font-bold text-card-foreground">${stats.monthlyEarnings}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Appointments */}
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="mb-6">
                      <TabsTrigger value="pending">
                        Pending ({pendingAppointments.length})
                      </TabsTrigger>
                      <TabsTrigger value="upcoming">
                        Upcoming ({acceptedAppointments.length})
                      </TabsTrigger>
                      <TabsTrigger value="completed">
                        Completed ({completedAppointments.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending">
                      {pendingAppointments.length > 0 ? (
                        <div className="flex flex-col gap-4">
                          {pendingAppointments.map((appointment) => (
                            <AppointmentCard
                              key={appointment.id}
                              appointment={appointment}
                              showActions
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground">No pending appointment requests</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="upcoming">
                      {acceptedAppointments.length > 0 ? (
                        <div className="flex flex-col gap-4">
                          {acceptedAppointments.map((appointment) => (
                            <AppointmentCard key={appointment.id} appointment={appointment} />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground">No upcoming appointments</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="completed">
                      {completedAppointments.length > 0 ? (
                        <div className="flex flex-col gap-4">
                          {completedAppointments.map((appointment) => (
                            <AppointmentCard key={appointment.id} appointment={appointment} />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <CheckCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground">No completed appointments yet</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Earnings Summary */}
            <div className="lg:col-span-1">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Earnings Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="text-3xl font-bold text-primary">${totalEarnings}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">This Month</span>
                        <span className="font-medium text-card-foreground">${monthlyEarnings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Completed Sessions</span>
                        <span className="font-medium text-card-foreground">{completedAppointments.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Average per Session</span>
                        <span className="font-medium text-card-foreground">$250</span>
                      </div>
                    </div>

                    <hr className="border-border" />

                    <div>
                      <p className="mb-2 text-sm font-medium text-card-foreground">Recent Payments</p>
                      {completedAppointments.slice(0, 3).map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-sm font-medium text-card-foreground">{apt.userName}</p>
                            <p className="text-xs text-muted-foreground">{apt.date}</p>
                          </div>
                          <span className="text-sm font-medium text-accent">+$250</span>
                        </div>
                      ))}
                      {completedAppointments.length === 0 && (
                        <p className="text-sm text-muted-foreground">No payments yet</p>
                      )}
                    </div>
                  </div>
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
