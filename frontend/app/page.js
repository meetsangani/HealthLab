import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Microscope, FlaskRoundIcon as Flask, Droplet, Heart, Activity, Shield, Clock, CheckCircle } from "lucide-react"
import TestimonialCard from "@/components/testimonial-card"
import FaqSection from "@/components/faq-section"

export default function Home() {
  const testCategories = [
    {
      icon: <Microscope className="h-10 w-10" />,
      name: "Blood Tests",
      description: "Complete blood count, lipid profile, glucose tests and more",
      href: "/tests?category=blood",
    },
    {
      icon: <Flask className="h-10 w-10" />,
      name: "Urine Tests",
      description: "Urinalysis, culture, pregnancy tests and more",
      href: "/tests?category=urine",
    },
    {
      icon: <Droplet className="h-10 w-10" />,
      name: "Hormonal Panels",
      description: "Thyroid, reproductive, stress hormones and more",
      href: "/tests?category=hormonal",
    },
    {
      icon: <Heart className="h-10 w-10" />,
      name: "Full Body Checkups",
      description: "Comprehensive health assessments for all ages",
      href: "/tests?category=full-body",
    },
    {
      icon: <Activity className="h-10 w-10" />,
      name: "COVID-19 Tests",
      description: "RT-PCR, antibody, and antigen tests",
      href: "/tests?category=covid",
    },
    {
      icon: <Shield className="h-10 w-10" />,
      name: "Allergy Tests",
      description: "Food, environmental, and skin allergy panels",
      href: "/tests?category=allergy",
    },
  ]

  const testimonials = [
    {
      quote:
        "The online booking system made it so easy to schedule my tests. The staff was professional and the results were delivered promptly.",
      author: "Priya Sharma",
      role: "Regular Customer",
    },
    {
      quote:
        "I've been using HealthLab for all my family's testing needs. Their home collection service is a lifesaver for my elderly parents.",
      author: "Rajesh Kumar",
      role: "Family Healthcare Manager",
    },
    {
      quote:
        "As a healthcare professional, I appreciate the accuracy and reliability of HealthLab's test results. I recommend them to all my patients.",
      author: "Dr. Anita Desai",
      role: "General Physician",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <Badge className="px-3 py-1 text-sm">Trusted by 10,000+ patients</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Your Health, Our <span className="text-primary">Priority</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto md:mx-0">
              Accurate diagnostics with state-of-the-art technology and experienced professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/auth/login">
                <Button size="lg" className="w-full sm:w-auto px-3 py-1 text-sm rounded-full">
                  Book a Test
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-3 py-1 text-sm rounded-full">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative w-full max-w-[500px] aspect-square">
            <Image
              src="/placeholder.svg?height=500&width=500"
              alt="Medical professionals in a lab"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose HealthLab?</h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              We are committed to providing the highest quality diagnostic services with accuracy, reliability, and
              convenience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Accurate Results</h3>
                  <p className="text-muted-foreground">
                    State-of-the-art equipment and rigorous quality control for precise diagnostics.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Quick Turnaround</h3>
                  <p className="text-muted-foreground">
                    Fast processing with results available online within 24-48 hours for most tests.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Certified Lab</h3>
                  <p className="text-muted-foreground">
                    NABL accredited laboratory with experienced pathologists and technicians.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Test Categories Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Test Categories</h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              Explore our comprehensive range of diagnostic tests designed to meet all your healthcare needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testCategories.map((category, index) => (
              <Link key={index} href="/auth/login">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex flex-col h-full">
                      <div className="mb-4 text-primary">{category.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                      <p className="text-muted-foreground mb-4">{category.description}</p>
                      <div className="mt-auto">
                        <Button variant="link" className="p-0">
                          View Tests
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/auth/login">
              <Button size="lg" className="px-3 py-1 text-sm rounded-full">View All Tests</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              Our simple 4-step process makes getting your tests done quick and hassle-free.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Book Your Test",
                description: "Select your tests online or call our customer service.",
              },
              {
                step: "2",
                title: "Sample Collection",
                description: "Visit our center or opt for home collection service.",
              },
              {
                step: "3",
                title: "Lab Processing",
                description: "Your samples are analyzed by our expert technicians.",
              },
              {
                step: "4",
                title: "Get Results",
                description: "Access your reports online or collect from our center.",
              },
            ].map((item, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-[2px] bg-border" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/auth/login">
              <Button size="lg" className="px-3 py-1 text-sm rounded-full">Book Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Patients Say</h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              Don't just take our word for it. Here's what our patients have to say about their experience with
              HealthLab.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Test?</h2>
          <p className="max-w-[700px] mx-auto mb-8">
            Take the first step towards better health monitoring. Book your diagnostic test today and get accurate
            results quickly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" variant="secondary" className="px-3 py-1 text-sm rounded-full">
                Book a Test
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary px-3 py-1 text-sm rounded-full"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
