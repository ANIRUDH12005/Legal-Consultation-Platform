import { Shield, Clock, Video, FileText, CreditCard, Headphones } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Shield,
    title: "Verified Lawyers",
    description: "All lawyers on our platform are thoroughly verified with credentials and background checks.",
  },
  {
    icon: Clock,
    title: "Instant Booking",
    description: "Book appointments instantly with available slots that fit your schedule.",
  },
  {
    icon: Video,
    title: "Video Consultations",
    description: "Connect with lawyers through secure video calls from the comfort of your home.",
  },
  {
    icon: FileText,
    title: "Document Review",
    description: "Get your legal documents reviewed and verified by experienced professionals.",
  },
  {
    icon: CreditCard,
    title: "Transparent Pricing",
    description: "Clear fee structures with no hidden costs. Pay only for what you need.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist you with any queries.",
  },
]

export function Features() {
  return (
    <section className="bg-secondary/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Choose LegalConnect?
          </h2>
          <p className="text-lg text-muted-foreground">
            We make legal consultation simple, accessible, and trustworthy for everyone.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
