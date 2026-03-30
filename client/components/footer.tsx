import Link from "next/link"
import { Scale } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Scale className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold text-foreground">LegalConnect</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting you with verified legal professionals for all your legal needs.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/lawyers" className="text-muted-foreground transition-colors hover:text-foreground">
                  Find Lawyers
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-muted-foreground transition-colors hover:text-foreground">
                  Register as Lawyer
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Legal Areas</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/lawyers?specialization=corporate" className="text-muted-foreground transition-colors hover:text-foreground">
                  Corporate Law
                </Link>
              </li>
              <li>
                <Link href="/lawyers?specialization=family" className="text-muted-foreground transition-colors hover:text-foreground">
                  Family Law
                </Link>
              </li>
              <li>
                <Link href="/lawyers?specialization=criminal" className="text-muted-foreground transition-colors hover:text-foreground">
                  Criminal Law
                </Link>
              </li>
              <li>
                <Link href="/lawyers?specialization=property" className="text-muted-foreground transition-colors hover:text-foreground">
                  Property Law
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Contact</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>support@legalconnect.com</li>
              <li>1-800-LEGAL-HELP</li>
              <li>Mon - Fri, 9am - 6pm EST</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LegalConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
