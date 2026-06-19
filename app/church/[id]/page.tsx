import { getSupabase } from "@/lib/supabase"
import type { TrustLevel } from "@/lib/supabase"
import { TRUST_LEVEL_LABELS, TRUST_LEVEL_DESCRIPTIONS } from "@/lib/supabase"
import { Navigation } from "@/components/navigation"
import { DonateButton } from "@/components/donate-button"
import { ArrowLeft, MapPin, Globe, Mail, Building2, Clock, ShieldCheck, Star, Wallet, FileText, Flag, User } from "lucide-react"
import Link from "next/link"
import { ReportButton } from "@/components/report-button"
import { notFound } from "next/navigation"

const TRUST_BADGE_STYLES: Record<TrustLevel, string> = {
  listed: "bg-gray-100 text-gray-600 border-gray-200",
  pi_ready: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  verified: "bg-green-50 text-green-700 border-green-200",
  highly_verified: "bg-purple-50 text-purple-700 border-purple-200",
}

export default async function ChurchProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = getSupabase()
  const { data: church } = await supabase.from("churches").select("*").eq("id", id).single()

  if (!church) notFound()

  const trustLevel = (church.trust_level || "listed") as TrustLevel
  const hasWallet = !!church.wallet_address

  const trustIcon = {
    listed: <FileText className="w-4 h-4" />,
    pi_ready: <Wallet className="w-4 h-4" />,
    pending: <Clock className="w-4 h-4" />,
    verified: <ShieldCheck className="w-4 h-4" />,
    highly_verified: <Star className="w-4 h-4" />,
  }[trustLevel]

  const lastUpdated = church.last_updated
    ? new Date(church.last_updated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        <main className="container mx-auto px-4 py-6 max-w-lg">
          <div className="mb-6">
            <Link href="/directory" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" />Back to Directory
            </Link>
          </div>

          {/* Church Header */}
          <div className="bg-card rounded-2xl p-6 border border-border mb-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold mb-2 text-balance">{church.name}</h1>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${TRUST_BADGE_STYLES[trustLevel]}`}>
                  {trustIcon}
                  {TRUST_LEVEL_LABELS[trustLevel]}
                </div>
              </div>
            </div>

            {church.description && <p className="text-muted-foreground leading-relaxed mb-4">{church.description}</p>}

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>{church.city}, {church.country}</span>
              </div>
              {church.denomination && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{church.denomination}</span>
                </div>
              )}
              {(church.leader_name || church.leader_title) && (
                <div className="flex items-center gap-2.5 text-sm">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{[church.leader_title, church.leader_name].filter(Boolean).join(" ")}</span>
                </div>
              )}
              {church.email && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a href={`mailto:${church.email}`} className="text-primary hover:underline truncate">{church.email}</a>
                </div>
              )}
              {church.website && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a href={church.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{church.website}</a>
                </div>
              )}
              {lastUpdated && (
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground pt-1">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Last updated {lastUpdated}</span>
                </div>
              )}
            </div>
          </div>

          {/* Trust Level Explanation */}
          <div className={`rounded-xl p-4 border mb-4 ${TRUST_BADGE_STYLES[trustLevel]}`}>
            <p className="text-xs font-semibold mb-1">About this badge: {TRUST_LEVEL_LABELS[trustLevel]}</p>
            <p className="text-xs opacity-80 leading-relaxed">{TRUST_LEVEL_DESCRIPTIONS[trustLevel]}</p>
          </div>

          {/* Donation */}
          {hasWallet ? (
            <DonateButton walletAddress={church.wallet_address!} churchName={church.name} />
          ) : (
            <div className="bg-muted/50 rounded-xl p-6 text-center mb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This church hasn't added a Pi wallet yet. Check back soon.
              </p>
            </div>
          )}

          {/* Safety notice */}
          <div className="bg-muted/30 rounded-xl p-4 text-xs text-muted-foreground text-center leading-relaxed mb-4 mt-4">
            Donations go directly to the ministry's Pi wallet. This platform does not hold or control funds. Please donate responsibly.
          </div>

          {/* Report button */}
          <ReportButton churchId={church.id} churchName={church.name} />
        </main>
      </div>
      <Navigation />
    </>
  )
}
