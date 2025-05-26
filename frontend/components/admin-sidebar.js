"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  FlaskRoundIcon as Flask,
  BarChart,
} from "lucide-react"

export default function AdminSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/bookings",
      label: "Bookings",
      icon: Calendar,
    },
    {
      href: "/admin/tests",
      label: "Test Management",
      icon: Flask,
    },
    {
      href: "/admin/customers",
      label: "Customers",
      icon: Users,
    },
    {
      href: "/admin/reports",
      label: "Reports",
      icon: FileText,
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: BarChart,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  const isActive = (path) => pathname === path

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden flex items-center h-16 px-4 border-b">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col h-full py-4">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold">Admin Panel</h2>
              </div>
              <div className="flex-1">
                <nav className="grid gap-1 px-2">
                  {routes.map((route, index) => (
                    <Link
                      key={index}
                      href={route.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                        isActive(route.href) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <route.icon className="h-4 w-4" />
                      {route.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mt-auto">
                <Button variant="ghost" className="w-full justify-start gap-3 px-3">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="ml-2 text-lg font-semibold">Admin Panel</div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-[240px] md:flex-col md:fixed md:inset-y-0 md:left-0 z-10">
        <div className="flex flex-col h-full py-4 border-r bg-background">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Admin Panel</h2>
          </div>
          <div className="flex-1">
            <nav className="grid gap-1 px-2">
              {routes.map((route, index) => (
                <Link
                  key={index}
                  href={route.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                    isActive(route.href) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto">
            <Button variant="ghost" className="w-full justify-start gap-3 px-3">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content Offset for Desktop */}
      <div className="hidden md:block md:pl-[240px] w-full"></div>
    </>
  )
}
