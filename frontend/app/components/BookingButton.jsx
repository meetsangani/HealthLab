"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function BookingButton({ testId, variant = "default", size, className, children }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleBooking = () => {
    if (isAuthenticated) {
      router.push(testId ? `/booking?test=${testId}` : '/tests')
    } else {
      router.push(testId ? `/auth/login?redirect=/booking?test=${testId}` : '/auth/login?redirect=/tests')
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleBooking}
    >
      {children || "Book Now"}
    </Button>
  )
}
