"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search } from "lucide-react"
import BookingButton from "@/app/components/BookingButton"
import { useState, useEffect } from "react"
import { testsAPI } from "@/lib/api"

export default function TestsPage() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch real tests from API instead of using mock data
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await testsAPI.getAllTests()
        setTests(data)
      } catch (err) {
        console.error("Error fetching tests:", err)
        setError("Failed to load tests")
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  // Mock test categories
  const categories = [
    { id: "all", name: "All Tests" },
    { id: "blood", name: "Blood Tests" },
    { id: "urine", name: "Urine Tests" },
    { id: "hormonal", name: "Hormonal Panels" },
    { id: "full-body", name: "Full Body Checkups" },
    { id: "covid", name: "COVID-19 Tests" },
    { id: "allergy", name: "Allergy Tests" },
  ]

  if (loading) {
    return <div>Loading tests...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Diagnostic Tests</h1>
          <p className="text-muted-foreground">
            Browse our comprehensive range of diagnostic tests and health packages.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search tests..." className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="px-3 py-1 text-sm rounded-full">Filter</Button>
            <Button variant="outline" className="px-3 py-1 text-sm rounded-full">Sort by</Button>
          </div>
        </div>

        {/* Test Categories Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-full h-auto flex flex-wrap justify-start overflow-auto py-1">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="my-1">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests
                  .filter((test) => category.id === "all" || test.category === category.id)
                  .map((test) => (
                    <Card key={test.id} className="h-full flex flex-col">
                      <CardContent className="pt-6 flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">{test.name}</h3>
                          {test.popular && <Badge variant="secondary">Popular</Badge>}
                        </div>
                        <p className="text-muted-foreground mb-4">{test.description}</p>
                        <div className="flex flex-col gap-2 mt-auto">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-medium">₹{test.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Results in:</span>
                            <span>{test.turnaround}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex gap-2 w-full">
                          <Link href={`/tests/${test.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              Details
                            </Button>
                          </Link>
                          <div className="flex-1">
                            <BookingButton testId={test.id} className="w-full">
                              Book Now
                            </BookingButton>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
