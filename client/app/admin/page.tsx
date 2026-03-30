"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import API from "@/services/api"
import { toast } from "sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
} from "lucide-react"

export default function AdminDashboard() {
  const { user: currentUser, loading: authLoading } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [lawyers, setLawyers] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const [usersRes, lawyersRes, statsRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/lawyers'),
        API.get('/dashboard/admin')
      ])
      setUsers(usersRes.data)
      setLawyers(lawyersRes.data)
      setStats(statsRes.data)
    } catch (error) {
      console.error("Error fetching admin data:", error)
      toast.error("Failed to load admin dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && currentUser?.role === 'admin') {
      fetchData()
    }
  }, [currentUser, authLoading])

  const handleApproveLawyer = async (lawyerId: string) => {
    try {
      await API.put(`/admin/approve/${lawyerId}`)
      toast.success("Lawyer approved successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to approve lawyer")
    }
  }

  const handleRejectLawyer = async (lawyerId: string) => {
    try {
      await API.put(`/admin/reject/${lawyerId}`)
      toast.success("Lawyer application rejected")
      fetchData()
    } catch (error) {
      toast.error("Failed to reject lawyer")
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredLawyers = lawyers.filter(
    (lawyer) =>
      lawyer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (authLoading || loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading admin dashboard...</div>
  }

  if (currentUser?.role !== 'admin') {
    return <div className="flex min-h-screen items-center justify-center">Access Denied</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage users, lawyers, and platform analytics</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats?.totalUsers || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Briefcase className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Lawyers</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats?.totalLawyers || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                  <Clock className="h-6 w-6 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats?.pendingApprovals || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                  <DollarSign className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-card-foreground">${(stats?.totalRevenue || 0).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users or lawyers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-10"
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="lawyers" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="lawyers">Lawyers ({lawyers.length})</TabsTrigger>
              <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="lawyers">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Lawyer Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Specialization</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Experience</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Bar Number</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLawyers.map((lawyer) => (
                          <tr key={lawyer._id || lawyer.id} className="border-b border-border last:border-0">
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-medium text-card-foreground">{lawyer.name}</p>
                                <p className="text-sm text-muted-foreground">{lawyer.email}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-card-foreground">{lawyer.specialization}</td>
                            <td className="px-4 py-4 text-card-foreground">{lawyer.experience} years</td>
                            <td className="px-4 py-4 text-card-foreground">{lawyer.barNumber}</td>
                            <td className="px-4 py-4">
                              <Badge
                                variant={
                                  lawyer.status === "approved"
                                    ? "default"
                                    : lawyer.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {lawyer.status.charAt(0).toUpperCase() + lawyer.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              {lawyer.status === "pending" ? (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRejectLawyer(lawyer._id || lawyer.id)}
                                  >
                                    <XCircle className="mr-1 h-4 w-4" />
                                    Reject
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveLawyer(lawyer._id || lawyer.id)}
                                  >
                                    <CheckCircle className="mr-1 h-4 w-4" />
                                    Approve
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Registered Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Join Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user._id || user.id} className="border-b border-border last:border-0">
                            <td className="px-4 py-4 font-medium text-card-foreground">{user.name}</td>
                            <td className="px-4 py-4 text-card-foreground">{user.email}</td>
                            <td className="px-4 py-4 text-card-foreground">{new Date(user.createdAt || user.joinDate).toLocaleDateString()}</td>
                            <td className="px-4 py-4">
                              <Badge
                                variant={
                                  user.status === "active"
                                    ? "default"
                                    : user.status === "suspended"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      Platform Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                        <span className="text-muted-foreground">New Users (This Month)</span>
                        <span className="text-xl font-bold text-card-foreground">+24</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                        <span className="text-muted-foreground">New Lawyers (This Month)</span>
                        <span className="text-xl font-bold text-card-foreground">+8</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                        <span className="text-muted-foreground">Appointments (This Month)</span>
                        <span className="text-xl font-bold text-card-foreground">156</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-accent" />
                      Revenue Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                        <span className="text-muted-foreground">This Month</span>
                        <span className="text-xl font-bold text-primary">$12,450</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                        <span className="text-muted-foreground">Last Month</span>
                        <span className="text-xl font-bold text-card-foreground">$10,800</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                        <span className="text-muted-foreground">Growth</span>
                        <span className="text-xl font-bold text-accent">+15.3%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
