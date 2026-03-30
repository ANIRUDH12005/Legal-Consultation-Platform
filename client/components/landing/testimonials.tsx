import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Owner",
    content: "LegalConnect made it incredibly easy to find a corporate lawyer. The booking process was seamless, and I got expert advice for my startup within 24 hours.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Property Investor",
    content: "I was struggling with a property dispute for months. Thanks to LegalConnect, I found a real estate lawyer who resolved my case efficiently. Highly recommended!",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "HR Manager",
    content: "The platform is user-friendly and the lawyers are top-notch. I&apos;ve used it multiple times for employment law consultations. Great service every time.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="bg-secondary/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of satisfied clients who found their perfect legal match.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="mb-6 text-muted-foreground">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {testimonial.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
