"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, AlertCircle, FileText, Beaker, ArrowLeft } from "lucide-react"
import BookingButton from "@/app/components/BookingButton"
import { testsAPI } from "@/lib/api"

export default function TestDetailPage({ params }) {
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await testsAPI.getTestById(params.id)
        setTest(data)
      } catch (err) {
        console.error("Error fetching test:", err)
        setError("Failed to load test details")
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [params.id])

  if (loading) {
    return <div className="container py-10">Loading...</div>
  }

  if (error) {
    return <div className="container py-10">{error}</div>
  }

  if (!test) {
    return <div className="container py-10">Test not found</div>
  }

  return (
    <div className="container py-10">
      <Link href="/tests" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tests
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{test.name}</h1>
                {test.popular && <Badge variant="secondary">Popular</Badge>}
              </div>
              <p className="text-muted-foreground">{test.description}</p>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="preparation">Preparation</TabsTrigger>
                <TabsTrigger value="procedure">Procedure</TabsTrigger>
                <TabsTrigger value="report">Report Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start">
                          <Beaker className="h-5 w-5 mr-2 text-primary" />
                          <div>
                            <h3 className="font-medium">Sample Type</h3>
                            <p>{test.sampleType}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 mr-2 text-primary" />
                          <div>
                            <h3 className="font-medium">Turnaround Time</h3>
                            <p>{test.turnaround}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">When is this test recommended?</h3>
                    <p className="text-muted-foreground">
                      A CBC is often performed as part of a routine medical examination. It may also be recommended when
                      you're experiencing fatigue, weakness, fever, inflammation, bruising, or bleeding. The test helps
                      diagnose various conditions and monitor ongoing health issues or treatments.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preparation" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-2">Preparation Instructions</h3>
                      <p className="text-muted-foreground">{test.preparation}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="procedure" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">How the test is performed</h3>
                  <p className="text-muted-foreground">{test.procedure}</p>
                </div>
              </TabsContent>

              <TabsContent value="report" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-2">Your report will include:</h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {test.reportIncludes.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {test.relatedTests && test.relatedTests.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Related Tests</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {test.relatedTests.map((relatedTest) => (
                    <Link key={relatedTest.id} href={`/tests/${relatedTest.id}`}>
                      <Card className="h-full hover:bg-muted/50 transition-colors">
                        <CardContent className="pt-6">
                          <h4 className="font-medium">{relatedTest.name}</h4>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-6">Book This Test</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-bold text-lg">₹{test.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Results in:</span>
                  <span>{test.turnaround}</span>
                </div>
              </div>

              <div className="space-y-3">
                <BookingButton testId={test.id} className="w-full px-3 py-1 text-sm rounded-full">
                  Book Now
                </BookingButton>
                <Link href="/contact">
                  <Button variant="outline" className="w-full px-3 py-1 text-sm rounded-full">
                    Contact for Queries
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
