"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { getSupabase } from "@/lib/supabase"
import type { Church, TrustLevel } from "@/lib/supabase"
import { TRUST_LEVEL_LABELS, TRUST_LEVEL_ORDER } from "@/lib/supabase"
import { Search, MapPin, ChurchIcon, Clock, ShieldCheck, Star, Wallet, FileText } from "lucide-react"

const TRUST_BADGE_STYLES: Record<TrustLevel, string> = {
  listed: "bg-gray-100 text-gray-500 border border-gray-200",
  pi_ready: "bg-blue-50 text-blue-600 border border-blue-200",
  pending: "bg-amber-50 text-amber-600 border border-amber-200",
  verified: "bg-green-50 text-green-700 border border-green-200",
  highly_verified: "bg-purple-50 text-purple-700 border border-purple-200",
}

const TrustBadge = ({ level }: { level: TrustLevel }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${TRUST_BADGE_STYLES[level]}`}>
    {level === "listed" && <FileText className="w-3 h-3" />}
    {level === "pi_ready" && <Wallet className="w-3 h-3" />}
    {level === "pending" && <Clock className="w-3 h-3" />}
    {level === "verified" && <ShieldCheck className="w-3 h-3" />}
    {level === "highly_verified" && <Star className="w-3 h-3" />}
    {TRUST_LEVEL_LABELS[level]}
  </span>
)

const PAGE_SIZE = 20

export default function DirectoryPage() {
  const [churches, setChurches] = useState<Church[]>([])
  const [filteredChurches, setFilteredChurches] = useState<Church[]>([])
  const [displayedChurches, setDisplayedChurches] = useState<Church[]>([])
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [denominationFilter, setDenominationFilter] = useState("")
  const [trustFilter, setTrustFilter] = useState<TrustLevel | "">("")
  const [cities, setCities] = useState<string[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [countryFilter, setCountryFilter] = useState("")
  const [denominations, setDenominations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { loadChurches() }, [])
  useEffect(() => { filterChurches() }, [searchTerm, countryFilter, cityFilter, denominationFilter, trustFilter, churches])
  useEffect(() => { setDisplayedChurches(filteredChurches.slice(0, page * PAGE_SIZE)) }, [filteredChurches, page])

  const loadChurches = async () => {
    setIsLoading(true)
    const supabase = getSupabase()
    const { data } = await supabase.from("churches").select("*")
    if (data) {
      const sorted = data.sort((a, b) => {
        const aLevel = (a.trust_level || "listed") as TrustLevel
        const bLevel = (b.trust_level || "listed") as TrustLevel
        return TRUST_LEVEL_ORDER[aLevel] - TRUST_LEVEL_ORDER[bLevel]
      })
      setChurches(sorted)
      setFilteredChurches(sorted)
      setCities([...new Set(data.map((c) => c.city).filter(Boolean))].sort())
      setCountries([...new Set(data.map((c) => c.country).filter(Boolean))].sort())
      setDenominations([...new Set(data.map((c) => c.denomination).filter(Boolean))].sort())
    }
    setIsLoading(false)
  }

  const filterChurches = () => {
    let filtered = [...churches]
    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (countryFilter) filtered = filtered.filter((c) => c.country === countryFilter)
    if (cityFilter) filtered = filtered.filter((c) => c.city === cityFilter)
    if (denominationFilter) filtered = filtered.filter((c) => c.denomination === denominationFilter)
    if (trustFilter) filtered = filtered.filter((c) => (c.trust_level || "listed") === trustFilter)
    setFilteredChurches(filtered)
    setPage(1)
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        <main className="container mx-auto px-4 py-6 max-w-lg">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Church Directory</h1>
            <p className="text-muted-foreground text-sm">Discover Pi-accepting ministries</p>
          </div>

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search churches..." className="pl-10" />
          </div>

          <div className="space-y-3 mb-6">
            <select value={countryFilter} onChange={(e) => { setCountryFilter(e.target.value); setCityFilter("") }}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm font-medium">
              <option value="">🌍  All Countries</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
                <option value="">All Cities</option>
                {(countryFilter
                  ? cities.filter(city => churches.some(c => c.city === city && c.country === countryFilter))
                  : cities
                ).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={denominationFilter} onChange={(e) => setDenominationFilter(e.target.value)}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
                <option value="">All Denominations</option>
                {denominations.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <select value={trustFilter} onChange={(e) => setTrustFilter(e.target.value as TrustLevel | "")}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
              <option value="">All Trust Levels</option>
              <option value="highly_verified">⭐ Highly Verified</option>
              <option value="verified">✅ Verified</option>
              <option value="pending">🕐 Pending Review</option>
              <option value="pi_ready">💙 Pi-Ready</option>
              <option value="listed">📋 Listed</option>
            </select>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">{filteredChurches.length} {filteredChurches.length === 1 ? "church" : "churches"} found</div>
            <Link href="/request" className="text-sm text-primary hover:underline">+ Request a church</Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="bg-card rounded-xl p-4 border border-border animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {displayedChurches.map((church) => {
                  const level = (church.trust_level || "listed") as TrustLevel
                  return (
                    <Link key={church.id} href={`/church/${church.id}`}
                      className="block bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <ChurchIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-base truncate">{church.name}</h3>
                            <TrustBadge level={level} />
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{church.city}, {church.country}</span>
                          </div>
                          {church.denomination && <div className="text-xs text-muted-foreground">{church.denomination}</div>}
                        </div>
                      </div>
                      {church.description && <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{church.description}</p>}
                    </Link>
                  )
                })}
                {filteredChurches.length === 0 && (
                  <div className="text-center py-12">
                    <ChurchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No churches found</p>
                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                  </div>
                )}
              </div>
              {displayedChurches.length < filteredChurches.length && (
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="w-full mt-4 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  Load more ({filteredChurches.length - displayedChurches.length} remaining)
                </button>
              )}
            </>
          )}
        </main>
      </div>
      <Navigation />
    </>
  )
}
