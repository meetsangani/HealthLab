import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search } from "lucide-react"

export default function TestsPage() {
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

  // Mock tests data
  const tests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      category: "blood",
      price: 500,
      turnaround: "24 hours",
      description: "Measures red and white blood cells, platelets, hemoglobin, and hematocrit.",
      popular: true,
    },
    {
      id: 2,
      name: "Lipid Profile",
      category: "blood",
      price: 800,
      turnaround: "24 hours",
      description: "Measures cholesterol levels including HDL, LDL, and triglycerides.",
      popular: true,
    },
    {
      id: 3,
      name: "Liver Function Test",
      category: "blood",
      price: 1200,
      turnaround: "24 hours",
      description: "Assesses liver function by measuring enzymes, proteins, and bilirubin.",
      popular: false,
    },
    {
      id: 4,
      name: "Thyroid Profile",
      category: "hormonal",
      price: 1500,
      turnaround: "48 hours",
      description: "Measures thyroid hormones (T3, T4) and thyroid-stimulating hormone (TSH).",
      popular: true,
    },
    {
      id: 5,
      name: "Urinalysis",
      category: "urine",
      price: 400,
      turnaround: "24 hours",
      description: "Analyzes physical, chemical, and microscopic properties of urine.",
      popular: false,
    },
    {
      id: 6,
      name: "Comprehensive Health Checkup",
      category: "full-body",
      price: 5000,
      turnaround: "72 hours",
      description: "Complete health assessment including blood, urine tests, and vital measurements.",
      popular: true,
    },
    {
      id: 7,
      name: "COVID-19 RT-PCR Test",
      category: "covid",
      price: 1800,
      turnaround: "24 hours",
      description: "Gold standard test for detecting active COVID-19 infection.",
      popular: true,
    },
    {
      id: 8,
      name: "Food Allergy Panel",
      category: "allergy",
      price: 3500,
      turnaround: "72 hours",
      description: "Tests for allergic reactions to common food allergens.",
      popular: false,
    },
    {
      id: 9,
      name: "Vitamin D Test",
      category: "blood",
      price: 1200,
      turnaround: "48 hours",
      description: "Measures the level of vitamin D in your blood.",
      popular: false,
    },
  ]

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
                          <Link href={`/booking?test=${test.id}`} className="flex-1">
                            <Button className="w-full">Book Now</Button>
                          </Link>
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
