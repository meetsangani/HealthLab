"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqSection() {
  const faqs = [
    {
      question: "Do I need to fast before my blood test?",
      answer:
        "For many blood tests like lipid profile and glucose tests, fasting for 8-12 hours is recommended. However, not all tests require fasting. Our staff will inform you about any preparation needed when you book your test.",
    },
    {
      question: "How can I get my test results?",
      answer:
        "You can access your test results through our online portal by logging into your account. We also provide the option to receive results via email or collect physical copies from our center.",
    },
    {
      question: "Do you offer home sample collection?",
      answer:
        "Yes, we offer home sample collection services. You can book this service online or by calling our customer service. Our trained phlebotomists will visit your home at the scheduled time to collect samples.",
    },
    {
      question: "How long does it take to get test results?",
      answer:
        "Most routine tests are processed within 24-48 hours. Some specialized tests may take longer. The exact turnaround time will be communicated to you when you book your test.",
    },
    {
      question: "Are your tests covered by insurance?",
      answer:
        "Many of our diagnostic tests are covered by health insurance. We work with most major insurance providers. Please check with your insurance company or our customer service for specific coverage details.",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-[700px] mx-auto">
            Find answers to common questions about our services, test procedures, and more.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
