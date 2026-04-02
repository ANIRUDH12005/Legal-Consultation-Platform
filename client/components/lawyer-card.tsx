import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Briefcase, DollarSign } from "lucide-react"
import type { Lawyer } from "@/lib/data"

interface LawyerCardProps {
  lawyer: any // Using any for now to facilitate backend structure
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  const name = lawyer.user?.name || lawyer.name || "Unknown Lawyer"
  const rating = lawyer.avgRating || 0
  const totalReviews = lawyer.totalReviews || 0

  return (
    <Card className="overflow-hidden border-border transition-shadow hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {name.split(" ").map((n: string) => n[0]).join("")}
          </div>
          
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">{name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {lawyer.specialization}
                </Badge>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({totalReviews})</span>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{lawyer.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{lawyer.experience} years exp</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>₹{lawyer.fees}/consultation</span>
              </div>
            </div>

            {lawyer.bio && (
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {lawyer.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href={`/lawyers/${lawyer._id}`}>View Profile</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/lawyers/${lawyer._id}?book=true`}>Book Appointment</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
