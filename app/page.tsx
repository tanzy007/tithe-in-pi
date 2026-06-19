import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { BookOpen, KeyRound } from "lucide-react"

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-20">
        <main className="container mx-auto px-4 py-8 max-w-lg">

          {/* Header */}
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Tithe in Pi" className="w-48 h-auto mx-auto mb-2" />
            <p className="text-muted-foreground text-balance">
              A directory for Pioneer giving
            </p>
          </div>

          {/* Primary CTA — Donors */}
          <Link href="/directory" className="block mb-3">
            <Button className="w-full h-16 text-base font-semibold" size="lg">
              Find a Church to Support
            </Button>
          </Link>

          {/* Secondary CTA — Churches */}
          <Link href="/register" className="block mb-6">
            <Button variant="outline" className="w-full h-14 text-base bg-transparent" size="lg">
              Register Your Church
            </Button>
          </Link>

          {/* Two-column cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link href="/resources" className="block">
              <div className="flex flex-col items-center gap-2 bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors text-center h-full">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Pioneer Guides</div>
                  <div className="text-xs text-muted-foreground mt-0.5">How to onboard your church</div>
                </div>
              </div>
            </Link>

            <Link href="/onboard" className="block">
              <div className="flex flex-col items-center gap-2 bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors text-center h-full">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Church Login</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Complete your onboarding</div>
                </div>
              </div>
            </Link>
          </div>

          {/* About link */}
          <div className="text-center mt-2">
            <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              About Tithe in Pi
            </Link>
          </div>

          {/* Trust note */}
          <div className="mt-4 p-4 bg-muted/50 rounded-xl">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              All donations go directly to the church Pi wallet. No payment information is stored or handled by this platform.
            </p>
          </div>

        </main>
      </div>
      <Navigation />
    </>
  )
}
