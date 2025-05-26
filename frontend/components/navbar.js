"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogIn, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()

  const baseRoutes = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ]

  const authenticatedRoutes = [
    { href: "/tests", label: "Tests" },
    { href: "/bookings", label: "My Bookings" },
  ]

  const routes = isAuthenticated ? [...baseRoutes, ...authenticatedRoutes] : baseRoutes

  const isActive = (path) => pathname === path

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card-glass shadow-glass backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Toggle Menu" className="btn-enhanced btn-ripple">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-card-glass shadow-glass p-0">
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsOpen(false)}
                    className={`fancy-card text-lg font-medium transition-colors hover:text-primary rounded-lg px-3 py-2 interactive-hover ${
                      isActive(route.href) ? "bg-primary text-primary-foreground shadow-float border-glow" : "text-muted-foreground"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4">
                  {isAuthenticated ? (
                    <>
                      <Link href="/dashboard">
                        <Button className="btn-enhanced btn-shine">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button variant="outline" className="btn-enhanced btn-shine" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login">
                        <Button variant="outline" className="btn-enhanced btn-shine">
                          <LogIn className="mr-2 h-4 w-4" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button className="btn-enhanced btn-shine">Register</Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">HealthLab</span>
          </Link>
        </div>
        <nav className="hidden lg:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`fancy-card text-sm font-medium transition-colors hover:text-primary rounded-lg px-3 py-2 interactive-hover ${
                isActive(route.href) ? "bg-primary text-primary-foreground shadow-float border-glow" : "text-muted-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
              <Link href="/dashboard">
                <Button className="btn-enhanced btn-shine">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" className="btn-enhanced btn-shine" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" className="btn-enhanced btn-shine">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="btn-enhanced btn-shine">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
