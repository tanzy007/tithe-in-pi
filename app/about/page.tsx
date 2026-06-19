import { Navigation } from "@/components/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        <main className="container mx-auto px-4 py-6 max-w-lg">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" />Back
            </Link>
          </div>

          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Tithe in Pi" className="w-40 h-auto mx-auto" />
          </div>

          {/* Mission */}
          <div className="bg-card rounded-2xl p-6 border border-border mb-4">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Our Mission</p>
            <p className="text-base leading-relaxed text-foreground">
              Tithe in Pi is on a mission to connect Pi Network pioneers with churches worldwide — and to equip pioneers with everything they need to bring their own local church into the directory.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-card rounded-2xl p-6 border border-border mb-4">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Our Vision</p>
            <p className="text-base leading-relaxed text-foreground">
              A world where every church that accepts Pi is findable, verified, and trusted. Where a pioneer in the Philippines can tithe to their parish on Sunday the same way a pioneer in Nigeria or Canada can. Where digital giving and faithful giving are the same thing.
            </p>
          </div>

          {/* How it works */}
          <div className="bg-card rounded-2xl p-6 border border-border mb-4">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">How It Works</p>
            <p className="text-base leading-relaxed text-foreground mb-3">
              Churches register for free, add their Pi wallet, and get independently verified. Donors browse the directory and give directly — wallet to wallet. Tithe in Pi never touches the funds. No fees. No middlemen.
            </p>
            <p className="text-base leading-relaxed text-foreground">
              Pioneers who want to bring their church on board will find everything they need in the Resources section — step by step guides covering the full journey from first conversation to verified listing.
            </p>
          </div>

          {/* Footer note */}
          <p className="text-xs text-muted-foreground text-center leading-relaxed mt-6 px-4">
            Built by a Canadian catechumen. Independent. Not affiliated with Pi Network Core Team. 🙏
          </p>
        </main>
      </div>
      <Navigation />
    </>
  )
}
