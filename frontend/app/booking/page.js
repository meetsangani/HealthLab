"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { Upload, ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const testId = searchParams.get("test")

  const [step, setStep] = useState(1)
  const [date, setDate] = useState()
  const [isLoading, setIsLoading] = useState(false)

  // Add state for user input fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [address, setAddress] = useState("")
  const [collectionType, setCollectionType] = useState("center")
  const [timeSlot, setTimeSlot] = useState("")
  const [errors, setErrors] = useState({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [bookingReference, setBookingReference] = useState("")

  // Define time slots
  const timeSlots = [
    "9:00 AM - 10:00 AM", 
    "10:00 AM - 11:00 AM", 
    "11:00 AM - 12:00 PM", 
    "12:00 PM - 1:00 PM", 
    "1:00 PM - 2:00 PM", 
    "2:00 PM - 3:00 PM", 
    "3:00 PM - 4:00 PM", 
    "4:00 PM - 5:00 PM", 
    "5:00 PM - 6:00 PM"
  ];

  // Mock tests data (should be shared or imported in real app)
  const tests = [
    {
      id: "1",
      name: "Complete Blood Count (CBC)",
      price: 500,
      turnaround: "24 hours",
    },
    {
      id: "2",
      name: "Lipid Profile",
      price: 800,
      turnaround: "24 hours",
    },
    {
      id: "3",
      name: "Liver Function Test",
      price: 1200,
      turnaround: "24 hours",
    },
    {
      id: "4",
      name: "Thyroid Profile",
      price: 1500,
      turnaround: "48 hours",
    },
    {
      id: "5",
      name: "Urinalysis",
      price: 400,
      turnaround: "24 hours",
    },
    {
      id: "6",
      name: "Comprehensive Health Checkup",
      price: 5000,
      turnaround: "72 hours",
    },
    {
      id: "7",
      name: "COVID-19 RT-PCR Test",
      price: 1800,
      turnaround: "24 hours",
    },
    {
      id: "8",
      name: "Food Allergy Panel",
      price: 3500,
      turnaround: "72 hours",
    },
    {
      id: "9",
      name: "Vitamin D Test",
      price: 1200,
      turnaround: "48 hours",
    },
  ];

  // Find the test based on testId from query param
  const test = tests.find(t => t.id === testId) || tests[0];

  const validateStep1 = () => {
    const newErrors = {}
    
    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"
    
    if (!mobile.trim()) newErrors.mobile = "Mobile number is required"
    else if (!/^\d{10}$/.test(mobile.replace(/\D/g, ''))) newErrors.mobile = "Enter valid 10-digit number"
    
    if (!address.trim()) newErrors.address = "Address is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    
    if (!date) newErrors.date = "Date selection is required"
    if (!timeSlot) newErrors.timeSlot = "Time slot selection is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const validateStep3 = () => {
    const newErrors = {}
    
    if (!termsAccepted) newErrors.terms = "You must accept the terms and conditions"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    let isValid = false;
    
    if (step === 1) {
      isValid = validateStep1()
    } else if (step === 2) {
      isValid = validateStep2()
    }
    
    if (isValid) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevStep = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep3()) return;
    
    setIsLoading(true)

    try {
      // Create booking data
      const bookingData = {
        testId: test.id,
        testName: test.name,
        price: test.price,
        turnaround: test.turnaround,
        date: date ? format(date, "yyyy-MM-dd") : null,
        timeSlot,
        collectionType,
        customer: {
          name,
          email,
          mobile,
          address,
        },
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      // In a real app, you would use an API call like this:
      // const response = await fetch('/api/bookings', {
      //   method: 'POST',
      //   body: JSON.stringify(bookingData),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const data = await response.json();

      // For now, we'll simulate saving to localStorage
      const bookingId = `BK${Math.floor(10000 + Math.random() * 90000)}`;
      bookingData.id = bookingId;
      setBookingReference(bookingId);
      
      // Save to localStorage (in a real app this would be in your database)
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      localStorage.setItem('bookings', JSON.stringify([...existingBookings, bookingData]));
      
      // Show success notification
      toast({
        title: "Booking Confirmed",
        description: `Your booking reference is ${bookingId}`,
      });
      
      // Move to success step
      setStep(4);
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/tests" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tests
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Book Your Test</CardTitle>
            <CardDescription>
              {step === 1 && "Enter your personal details"}
              {step === 2 && "Select your preferred date and time"}
              {step === 3 && "Review and confirm your booking"}
              {step === 4 && "Booking confirmed successfully"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    className={errors.mobile ? "border-red-500" : ""}
                  />
                  {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Collection Type</Label>
                  <RadioGroup value={collectionType} onValueChange={setCollectionType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="center" id="center" />
                      <Label htmlFor="center">Visit Center</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="home" id="home" />
                      <Label htmlFor="home">Home Collection (Additional ₹100)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 2: Date and Time Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <div className={`border rounded-md p-4 ${errors.date ? "border-red-500" : ""}`}>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => {
                        // Disable past dates and Sundays
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today || date.getDay() === 0
                      }}
                      className="mx-auto"
                    />
                  </div>
                  {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Select Time Slot</Label>
                  <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${errors.timeSlot ? "border border-red-500 rounded-md p-2" : ""}`}>
                    {timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`slot-${index}`}
                          name="timeSlot"
                          value={slot}
                          checked={timeSlot === slot}
                          onChange={() => setTimeSlot(slot)}
                          className="mr-2"
                        />
                        <Label htmlFor={`slot-${index}`} className="text-sm cursor-pointer">
                          {slot}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.timeSlot && <p className="text-sm text-red-500">{errors.timeSlot}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prescription">Upload Prescription (Optional)</Label>
                  <div className="border border-dashed rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your prescription here or click to browse
                    </p>
                    <Input id="prescription" type="file" className="hidden" />
                    <Button variant="outline" size="sm" onClick={() => document.getElementById("prescription").click()} className="px-3 py-1 text-sm rounded-full">
                      Browse Files
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review and Confirm */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Test Details</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Test:</span>
                          <span className="font-medium">{test.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium">₹{test.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Turnaround Time:</span>
                          <span>{test.turnaround}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Appointment Details</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span>{date ? format(date, "PPP") : "Not selected"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span>{timeSlot || "Not selected"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Collection Type:</span>
                          <span>
                            {collectionType === "center"
                              ? "Visit Center"
                              : collectionType === "home"
                              ? "Home Collection"
                              : "Not selected"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Personal Details</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span>{name || "Not entered"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span>{email || "Not entered"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mobile:</span>
                          <span>{mobile || "Not entered"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Address:</span>
                          <span>{address || "Not entered"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={termsAccepted}
                      onCheckedChange={setTermsAccepted}
                      className={errors.terms ? "border-red-500" : ""}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        terms and conditions
                      </Link>
                    </label>
                  </div>
                  {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Booking Confirmed!</h3>
                <p className="text-muted-foreground">
                  Your test has been booked successfully. A confirmation has been sent to your email and mobile number.
                </p>
                <div className="bg-muted p-4 rounded-md max-w-xs mx-auto">
                  <p className="font-medium">Booking Reference</p>
                  <p className="text-xl font-bold">#{bookingReference}</p>
                </div>
                <div className="pt-4">
                  <Link href={`/dashboard?bookingRef=${bookingReference}`}>
                    <Button className="px-3 py-1 text-sm rounded-full">Go to Dashboard</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>

          {step < 4 && (
            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={handlePrevStep} className="px-3 py-1 text-sm rounded-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <Button onClick={handleNextStep} className="px-3 py-1 text-sm rounded-full">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading} className="px-3 py-1 text-sm rounded-full">
                  {isLoading ? "Processing..." : "Confirm Booking"}
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

function CheckCircle(props) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
