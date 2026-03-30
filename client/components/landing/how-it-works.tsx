import { Search, Calendar, MessageSquare, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search Lawyers",
    description: "Browse through our extensive list of verified lawyers. Filter by specialization, location, experience, and fees.",
  },
  {
    icon: Calendar,
    step: "02",
    title: "Book Appointment",
    description: "Select a convenient time slot and book your appointment instantly with your preferred lawyer.",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "Consultation",
    description: "Connect with your lawyer via video call or in-person meeting and discuss your legal matters.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Get Resolution",
    description: "Receive expert legal advice and guidance to resolve your legal issues effectively.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get legal help in four simple steps. Our platform makes it easy to connect with the right lawyer.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border lg:block" />
              )}
              <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <item.icon className="h-10 w-10 text-primary" />
                <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
