"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"

export default function BookingButton({ testId, children, className, variant = "default", size, ...props }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to book a test",
        variant: "destructive",
      })
      router.push('/auth/login?redirect=/booking')
      return
    }

    // Navigate to booking page with test ID if provided
    const queryParams = testId ? `?test=${testId}` : ''
    router.push(`/booking${queryParams}`)
  }

  return (
    <Button 
      onClick={handleBookingClick} 
      className={className} 
      variant={variant}
      size={size}
      {...props}
    >
      {children || "Book Now"}
    </Button>
  )
}
