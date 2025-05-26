"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, Download } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"

export default function AdminDashboardPage() {
  // Mock statistics
  const stats = {
    totalBookings: 156,
    pendingBookings: 23,
    completedBookings: 133,
    totalCustomers: 98,
    totalRevenue: 125000,
  }

  // Mock recent bookings
  const recentBookings = [
    {
      id: "BK12345",
      customerName: "Priya Sharma",
      testName: "Complete Blood Count (CBC)",
      date: "2023-08-15",
      time: "09:00 AM",
      status: "pending",
    },
    {
      id: "BK12346",
      customerName: "Rajesh Kumar",
      testName: "Lipid Profile",
      date: "2023-08-14",
      time: "10:30 AM",
      status: "sample_collected",
    },
    {
      id: "BK12347",
      customerName: "Anita Desai",
      testName: "Thyroid Profile",
      date: "2023-08-13",
      time: "11:00 AM",
      status: "report_ready",
    },
    {
      id: "BK12348",
      customerName: "Vikram Singh",
      testName: "Vitamin D Test",
      date: "2023-08-12",
      time: "09:30 AM",
      status: "completed",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of lab operations and bookings</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pendingBookings}</div>
                <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">+15% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest test bookings</CardDescription>
                </div>
                <Link href="/admin/bookings">
                  <Button variant="outline" size="sm" className="px-3 py-1 text-xs rounded-full">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{booking.testName}</p>
                          <Badge variant="outline">{booking.id}</Badge>
                        </div>
                        <p className="text-sm">{booking.customerName}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3.5 w-3.5" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                          <Clock className="ml-3 mr-1 h-3.5 w-3.5" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Link href="/admin/bookings/new">
                  <Button className="w-full justify-start px-3 py-1 text-sm rounded-full" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Create New Booking
                  </Button>
                </Link>
                <Link href="/admin/tests/new">
                  <Button className="w-full justify-start px-3 py-1 text-sm rounded-full" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Add New Test
                  </Button>
                </Link>
                <Link href="/admin/reports/upload">
                  <Button className="w-full justify-start px-3 py-1 text-sm rounded-full" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Test Report
                  </Button>
                </Link>
                <Link href="/admin/bookings/export">
                  <Button className="w-full justify-start px-3 py-1 text-sm rounded-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Booking Data
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Booking Status Overview</CardTitle>
              <CardDescription>Current status of all bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatusCard
                  title="Pending"
                  count={23}
                  description="Awaiting sample collection"
                  color="bg-yellow-100 text-yellow-800"
                />
                <StatusCard
                  title="Sample Collected"
                  count={18}
                  description="Processing in lab"
                  color="bg-blue-100 text-blue-800"
                />
                <StatusCard
                  title="Report Ready"
                  count={12}
                  description="Ready for delivery"
                  color="bg-green-100 text-green-800"
                />
                <StatusCard
                  title="Completed"
                  count={133}
                  description="All time completed"
                  color="bg-gray-100 text-gray-800"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function BookingStatusBadge({ status }) {
  const statusMap = {
    pending: { label: "Pending", variant: "outline" },
    sample_collected: { label: "Sample Collected", variant: "secondary" },
    report_ready: { label: "Report Ready", variant: "default" },
    completed: { label: "Completed", variant: "default" },
  }

  const statusInfo = statusMap[status]

  return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
}

function StatusCard({ title, count, description, color }) {
  return (
    <div className={`p-4 rounded-lg ${color}`}>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs mt-1">{description}</p>
    </div>
  )
}

function Upload(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
