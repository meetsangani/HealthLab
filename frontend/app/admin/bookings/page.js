"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AdminSidebar from "@/components/admin-sidebar"

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock bookings data
  const bookings = [
    {
      id: "BK12345",
      customerName: "Priya Sharma",
      customerPhone: "+91 98765 43210",
      testName: "Complete Blood Count (CBC)",
      date: "2023-08-15",
      time: "09:00 AM",
      status: "pending",
      price: 500,
    },
    {
      id: "BK12346",
      customerName: "Rajesh Kumar",
      customerPhone: "+91 98765 43211",
      testName: "Lipid Profile",
      date: "2023-08-14",
      time: "10:30 AM",
      status: "sample_collected",
      price: 800,
    },
    {
      id: "BK12347",
      customerName: "Anita Desai",
      customerPhone: "+91 98765 43212",
      testName: "Thyroid Profile",
      date: "2023-08-13",
      time: "11:00 AM",
      status: "report_ready",
      price: 1500,
    },
    {
      id: "BK12348",
      customerName: "Vikram Singh",
      customerPhone: "+91 98765 43213",
      testName: "Vitamin D Test",
      date: "2023-08-12",
      time: "09:30 AM",
      status: "completed",
      price: 1200,
    },
    {
      id: "BK12349",
      customerName: "Meera Patel",
      customerPhone: "+91 98765 43214",
      testName: "Comprehensive Health Checkup",
      date: "2023-08-11",
      time: "08:00 AM",
      status: "completed",
      price: 5000,
    },
    {
      id: "BK12350",
      customerName: "Arjun Reddy",
      customerPhone: "+91 98765 43215",
      testName: "COVID-19 RT-PCR Test",
      date: "2023-08-10",
      time: "02:00 PM",
      status: "completed",
      price: 1800,
    },
    {
      id: "BK12351",
      customerName: "Neha Gupta",
      customerPhone: "+91 98765 43216",
      testName: "Liver Function Test",
      date: "2023-08-16",
      time: "11:30 AM",
      status: "pending",
      price: 1200,
    },
    {
      id: "BK12352",
      customerName: "Sanjay Mehta",
      customerPhone: "+91 98765 43217",
      testName: "Food Allergy Panel",
      date: "2023-08-17",
      time: "10:00 AM",
      status: "pending",
      price: 3500,
    },
  ]

  // Filter bookings based on search query and status filter
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.testName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Bookings</h1>
              <p className="text-muted-foreground">Manage all test bookings</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/bookings/new">
                <Button className="px-3 py-1 text-sm rounded-full">New Booking</Button>
              </Link>
              <Button variant="outline" className="px-3 py-1 text-sm rounded-full">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by ID, name, or test..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sample_collected">Sample Collected</SelectItem>
                <SelectItem value="report_ready">Report Ready</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                Showing {filteredBookings.length} of {bookings.length} bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Booking ID</th>
                      <th className="text-left py-3 px-4 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 font-medium">Test</th>
                      <th className="text-left py-3 px-4 font-medium">Date & Time</th>
                      <th className="text-left py-3 px-4 font-medium">Price</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b">
                        <td className="py-3 px-4">
                          <Link href={`/admin/bookings/${booking.id}`} className="font-medium hover:underline">
                            {booking.id}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{booking.customerName}</p>
                            <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{booking.testName}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                            <span className="text-sm text-muted-foreground">{booking.time}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">₹{booking.price.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <BookingStatusBadge status={booking.status} />
                        </td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Link href={`/admin/bookings/${booking.id}`} className="w-full">
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Update Status</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {booking.status === "report_ready" || booking.status === "completed" ? (
                                <DropdownMenuItem>Download Report</DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem className="text-destructive">Cancel Booking</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
