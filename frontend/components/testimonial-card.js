import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export default function TestimonialCard({ testimonial }) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6 h-full flex flex-col">
        <Quote className="h-8 w-8 text-primary/40 mb-4" />
        <p className="text-muted-foreground mb-6 flex-grow">"{testimonial.quote}"</p>
        <div>
          <p className="font-semibold">{testimonial.author}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </CardContent>
    </Card>
  )
}
