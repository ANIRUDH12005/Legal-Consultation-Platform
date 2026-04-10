"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
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
  User,
  CalendarDays,
  CheckCircle,
  XCircle,
  Search,
  DollarSign,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import API from "@/services/api"
import { toast } from "sonner"
import { Appointment } from "@/lib/data"

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
  accepted: { label: "Accepted", variant: "default" as const, icon: CheckCircle },
  rejected: { label: "Rejected", variant: "destructive" as const, icon: XCircle },
  completed: { label: "Completed", variant: "outline" as const, icon: CheckCircle },
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    if (!user) return
    setLoading(true)
    try {
      const endpoint = user.role === 'lawyer' ? '/appointments/lawyer' : '/appointments/user'
      const apptsRes = await API.get(endpoint)
      setAppointments(apptsRes.data)

      if (user.role === 'lawyer') {
        const statsRes = await API.get('/dashboard/lawyer')
        setStats(statsRes.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData()
    }
  }, [user, authLoading])

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    try {
      await API.put(`/appointments/${appointmentId}`, { status })
      toast.success(`Appointment ${status}`)
      fetchDashboardData()
    } catch (error) {
      toast.error("Failed to update appointment status")
    }
  }

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "pending" || apt.status === "accepted"
  )
  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed" || apt.status === "rejected"
  )

  const dashboardStats = useMemo(() => {
    if (user?.role === 'lawyer' && stats) {
      return {
        total: appointments.length,
        upcoming: upcomingAppointments.length,
        earnings: stats.totalEarnings || 0,
        pending: appointments.filter((apt) => apt.status === "pending").length,
      }
    }
    return {
      total: appointments.length,
      upcoming: upcomingAppointments.length,
      completed: appointments.filter((apt) => apt.status === "completed").length,
      pending: appointments.filter((apt) => apt.status === "pending").length,
    }
  }, [appointments, stats, user])

  if (authLoading || loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading dashboard...</div>
  }

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center">Redirecting to login...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {user.role === 'lawyer' ? 'Lawyer Dashboard' : 'My Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {user.role === 'lawyer' ? 'Manage your client requests and earnings' : 'Manage your legal consultations'}
              </p>
            </div>
            {user.role === 'user' && (
              <Button asChild>
                <Link href="/lawyers">
                  <Search className="mr-2 h-4 w-4" />
                  Find a Lawyer
                </Link>
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Appointments</p>
                  <p className="text-2xl font-bold text-card-foreground">{dashboardStats.total}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-card-foreground">{dashboardStats.upcoming}</p>
                </div>
              </CardContent>
            </Card>

            {user.role === 'lawyer' ? (
              <Card className="border-border">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                    <DollarSign className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold text-card-foreground">${dashboardStats.earnings || 0}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                    <CheckCircle className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-card-foreground">{dashboardStats.completed}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                  <Clock className="h-6 w-6 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-card-foreground">{dashboardStats.pending}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>{user.role === 'lawyer' ? 'Client Appointments' : 'My Appointments'}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="upcoming">
                    Upcoming ({upcomingAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="past">
                    Past ({pastAppointments.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  {upcomingAppointments.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {upcomingAppointments.map((appointment: any) => {
                        const status = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.pending
                        // Data from populated backend objects
                        const clientName = appointment.user?.name || "Unknown Client"
                        const lawyerName = appointment.lawyer?.user?.name || "Unknown Lawyer"
                        const displayName = user.role === 'lawyer' ? clientName : lawyerName
                        
                        return (
                          <div
                            key={appointment._id || appointment.id}
                            className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                                {displayName?.split(" ").map((n: string) => n[0]).join("") || 'U'}
                              </div>
                              <div>
                                <h3 className="font-semibold text-card-foreground">
                                  {displayName}
                                </h3>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(appointment.date).toLocaleDateString()}
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
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    {appointment.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={status.variant}>
                                <status.icon className="mr-1 h-3 w-3" />
                                {status.label}
                              </Badge>
                              {user.role === 'lawyer' && appointment.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleUpdateStatus(appointment._id, 'accepted')}>
                                    Accept
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(appointment._id, 'rejected')}>
                                    Reject
                                  </Button>
                                </div>
                              )}
                              {appointment.status === "accepted" && (
                                <Button size="sm" asChild={appointment.type === "video"}>
                                  {appointment.type === "video" ? (
                                    <Link href={`/video/${appointment._id}`}>
                                      <Video className="mr-2 h-4 w-4" />
                                      Join Call
                                    </Link>
                                  ) : (
                                    <span>View Details</span>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-medium text-card-foreground">
                        No upcoming appointments
                      </h3>
                      <p className="mb-4 text-muted-foreground">
                        {user.role === 'lawyer' ? 'Wait for clients to book consultations' : 'Book a consultation with a lawyer to get started'}
                      </p>
                      {user.role === 'user' && (
                        <Button asChild>
                          <Link href="/lawyers">Find a Lawyer</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="past">
                  {pastAppointments.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {pastAppointments.map((appointment: any) => {
                        const status = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.pending
                        // Data from populated backend objects
                        const clientName = appointment.user?.name || "Unknown Client"
                        const lawyerName = appointment.lawyer?.user?.name || "Unknown Lawyer"
                        const displayName = user.role === 'lawyer' ? clientName : lawyerName
                        
                        return (
                          <div
                            key={appointment._id || appointment.id}
                            className="flex flex-col gap-4 rounded-lg border border-border p-4 opacity-75 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground">
                                {displayName?.split(" ").map((n: string) => n[0]).join("") || 'U'}
                              </div>
                              <div>
                                <h3 className="font-semibold text-card-foreground">
                                  {displayName}
                                </h3>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(appointment.date).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {appointment.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant={status.variant}>
                              <status.icon className="mr-1 h-3 w-3" />
                              {status.label}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">No past appointments</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
