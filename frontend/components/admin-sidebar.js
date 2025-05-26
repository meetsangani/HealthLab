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
      <div className="md:hidden flex items-center h-16 px-4 border-b bg-card-glass shadow-glass">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="btn-enhanced">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] sm:w-[320px] bg-card-glass shadow-glass p-0">
            <div className="flex flex-col h-full py-4">
              <div className="px-4 py-2 border-b mb-2 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gradient">Admin Panel</h2>
                <Button variant="ghost" size="icon" className="btn-enhanced" onClick={() => setOpen(false)}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-enhanced">
                <nav className="grid gap-1 px-2">
                  {routes.map((route, index) => (
                    <Link
                      key={index}
                      href={route.href}
                      onClick={() => setOpen(false)}
                      className={`fancy-card flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 interactive-hover ${
                        isActive(route.href)
                          ? "bg-primary text-primary-foreground shadow-float border-glow"
                          : "hover:bg-muted/60 text-foreground"
                      }`}
                    >
                      <route.icon className="h-4 w-4" />
                      <span className="font-medium">{route.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mt-auto px-2 pb-2 border-t pt-2">
                <Button variant="ghost" className="w-full justify-start gap-3 px-3 btn-enhanced">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="ml-2 text-lg font-semibold text-gradient">Admin Panel</div>
      </div>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-[260px] md:flex-col md:fixed md:inset-y-0 md:left-0 z-20">
        <div className="flex flex-col h-full py-4 border-r bg-card-glass shadow-glass backdrop-blur-lg">
          <div className="px-4 py-2 border-b mb-2">
            <h2 className="text-lg font-bold text-gradient">Admin Panel</h2>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-enhanced">
            <nav className="grid gap-1 px-2 mt-2">
              {routes.map((route, index) => (
                <Link
                  key={index}
                  href={route.href}
                  className={`fancy-card flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 interactive-hover ${
                    isActive(route.href)
                      ? "bg-primary text-primary-foreground shadow-float border-glow"
                      : "hover:bg-muted/60 text-foreground"
                  }`}
                >
                  <route.icon className="h-4 w-4" />
                  <span className="font-medium">{route.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto px-2 pb-2 border-t pt-2">
            <Button variant="ghost" className="w-full justify-start gap-3 px-3 btn-enhanced">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      {/* Content Offset for Desktop */}
      <div className="hidden md:block md:pl-[260px] w-full"></div>
    </>
  )
}
