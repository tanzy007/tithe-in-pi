"use client"
import React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { getSupabase } from "@/lib/supabase"
import type { Church, TrustLevel } from "@/lib/supabase"
import { TRUST_LEVEL_LABELS, TRUST_LEVEL_DESCRIPTIONS } from "@/lib/supabase"
import { ArrowLeft, Check, Clock, Shield, ShieldCheck, Star, Wallet, FileText, Lock } from "lucide-react"
import Link from "next/link"

const TRUST_COLORS: Record<TrustLevel, string> = {
  listed: "bg-gray-100 text-gray-600 border-gray-200",
  pi_ready: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  verified: "bg-green-50 text-green-700 border-green-200",
  highly_verified: "bg-purple-50 text-purple-700 border-purple-200",
}

export default function OnboardPage() {
  const searchParams = useSearchParams()
  const churchIdFromUrl = searchParams.get("id")

  const [pinEntry, setPinEntry] = useState("")
  const [pinError, setPinError] = useState("")
  const [pinVerified, setPinVerified] = useState(false)
  const [pinChurch, setPinChurch] = useState<Church | null>(null)
  const [pinLoading, setPinLoading] = useState(false)

  const [churches, setChurches] = useState<Church[]>([])
  const [selectedChurch, setSelectedChurch] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [leaderName, setLeaderName] = useState("")
  const [leaderTitle, setLeaderTitle] = useState("")
  const [charityNumber, setCharityNumber] = useState("")
  const [physicalAddress, setPhysicalAddress] = useState("")
  const [walletConfirmChecked, setWalletConfirmChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState("")

  useEffect(() => {
    if (pinVerified && pinChurch) {
      loadChurches()
    }
  }, [pinVerified])

  const verifyPin = async () => {
    if (!pinEntry || pinEntry.length < 4) {
      setPinError("Please enter your PIN")
      return
    }
    setPinLoading(true)
    setPinError("")
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("churches")
        .select("*")
        .eq("onboard_pin", pinEntry.trim())
        .single()

      if (error || !data) {
        setPinError("Invalid PIN. Please contact hello.titheinpi@gmail.com if you need help.")
        setPinLoading(false)
        return
      }

      setPinChurch(data)
      setPinVerified(true)
      setSelectedChurch(data.id)
      prefillChurch(data)
    } catch (e) {
      setPinError("Something went wrong. Please try again.")
    } finally {
      setPinLoading(false)
    }
  }

  const resendPin = async () => {
    if (!pinEntry || pinEntry.length < 4) {
      setResendSuccess("")
      return
    }
    setResendLoading(true)
    try {
      const response = await fetch("/api/resend-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinEntry.trim() }),
      })

      if (!response.ok) {
        setPinError("Could not resend PIN. Please check your PIN and try again.")
        setResendLoading(false)
        return
      }

      setResendSuccess("PIN resent! Check your email.")
      setTimeout(() => setResendSuccess(""), 4000)
    } catch (e) {
      setPinError("Something went wrong. Please try again.")
    } finally {
      setResendLoading(false)
    }
  }

  const loadChurches = async () => {
    const supabase = getSupabase()
    const { data } = await supabase.from("churches").select("*").order("created_at", { ascending: false })
    if (data) {
      setChurches(data)
    }
  }

  const prefillChurch = (church: Church) => {
    setWalletAddress(church.wallet_address || "")
    setLeaderName(church.leader_name || "")
    setLeaderTitle(church.leader_title || "")
    setCharityNumber(church.charity_number || "")
    setPhysicalAddress(church.physical_address || "")
  }

  const handleSaveWallet = async () => {
    if (!walletAddress.trim()) { setError("Please enter a wallet address"); return }
    if (!walletConfirmChecked) { setError("Please confirm the wallet address is correct"); return }
    setLoading(true); setError(""); setSuccess("")
    try {
      const supabase = getSupabase()
      const currentChurch = churches.find(c => c.id === selectedChurch)
      const newTrustLevel = currentChurch?.trust_level === "listed" ? "pi_ready" : currentChurch?.trust_level
      const { error: updateError } = await supabase.from("churches").update({
        wallet_address: walletAddress.trim(),
        trust_level: newTrustLevel,
        last_updated: new Date().toISOString(),
      }).eq("id", selectedChurch)
      if (updateError) throw updateError
      setSuccess("Wallet address saved successfully!")
      loadChurches()
    } catch (err) {
      setError("Failed to save wallet address. Please try again.")
    } finally { setLoading(false) }
  }

  const [verificationLink, setVerificationLink] = React.useState("")
  const [verificationMethod, setVerificationMethod] = React.useState("")

  const handleSubmitVerification = async () => {
    if (!verificationMethod) { setError("Please select where you posted your wallet address."); return }
    if (!verificationLink.trim()) { setError("Please paste a link to where you posted your wallet address."); return }
    setLoading(true); setError(""); setSuccess("")
    try {
      const supabase = getSupabase()
      const { error: updateError } = await supabase.from("churches").update({
        trust_level: "pending",
        verification_method: verificationMethod,
        verification_link: verificationLink.trim(),
        last_updated: new Date().toISOString(),
      }).eq("id", selectedChurch)
      if (updateError) throw updateError
      setSuccess("Verification proof submitted! We'll review and update your status within a few days.")
      loadChurches()
    } catch (err) {
      setError("Failed to submit verification. Please try again.")
    } finally { setLoading(false) }
  }

  const handleUpdateProfile = async () => {
    setLoading(true); setError(""); setSuccess("")
    try {
      const supabase = getSupabase()
      const { error: updateError } = await supabase.from("churches").update({
        leader_name: leaderName || null,
        leader_title: leaderTitle || null,
        charity_number: charityNumber || null,
        physical_address: physicalAddress || null,
        last_updated: new Date().toISOString(),
      }).eq("id", selectedChurch)
      if (updateError) throw updateError
      setSuccess("Profile updated successfully!")
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    } finally { setLoading(false) }
  }

  // PIN gate
  if (!pinVerified) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center px-4 pb-20">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Church Onboarding</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enter the PIN sent to you by Tithe in Pi to access your church onboarding.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="pin">Your PIN</Label>
                <Input
                  id="pin"
                  type="number"
                  placeholder="Enter your PIN"
                  value={pinEntry}
                  onChange={e => setPinEntry(e.target.value)}
                  className="text-center text-lg tracking-widest mt-1"
                />
              </div>

              {pinError && <p className="text-sm text-red-500 text-center">{pinError}</p>}
              {resendSuccess && <p className="text-sm text-green-500 text-center">{resendSuccess}</p>}

              <Button className="w-full h-12" onClick={verifyPin} disabled={pinLoading}>
                {pinLoading ? "Verifying..." : "Access Onboarding"}
              </Button>

              <Button 
                variant="outline" 
                className="w-full h-10" 
                onClick={resendPin} 
                disabled={resendLoading || !pinEntry}
              >
                {resendLoading ? "Sending..." : "📧 Resend PIN to Email"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                If you don't see the email, check your spam folder or contact{" "}
                <span className="text-primary">hello.titheinpi@gmail.com</span>
              </p>
            </div>
          </div>
        </div>
        <Navigation />
      </>
    )
  }

  const currentChurch = churches.find(c => c.id === selectedChurch) || pinChurch

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        <main className="container mx-auto px-4 py-6 max-w-lg">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" />Back to Home
            </Link>
            <h1 className="text-2xl font-bold mb-1">Church Onboarding</h1>
            <p className="text-muted-foreground text-sm">Build donor trust step by step</p>
          </div>

          {currentChurch && (
            <div className="mb-6 p-4 bg-card border border-border rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{currentChurch.name}</div>
                  <div className="text-sm text-muted-foreground">{currentChurch.city}, {currentChurch.country}</div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TRUST_COLORS[currentChurch.trust_level]}`}>
                  {TRUST_LEVEL_LABELS[currentChurch.trust_level]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{TRUST_LEVEL_DESCRIPTIONS[currentChurch.trust_level]}</p>
            </div>
          )}

          {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{success}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

          <div className="space-y-4">
            {/* Step 1 - Wallet */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentChurch?.wallet_address ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}>
                  {currentChurch?.wallet_address ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <div>
                  <div className="font-semibold text-sm">Add Pi Wallet</div>
                  <div className="text-xs text-muted-foreground">Required to receive donations</div>
                </div>
                {currentChurch?.wallet_address && <span className="ml-auto text-xs text-green-600 font-semibold">Done</span>}
              </div>
              {currentChurch?.wallet_address && (
                <div className="mb-3 p-2 bg-muted/50 rounded-lg text-xs font-mono text-muted-foreground truncate">{currentChurch.wallet_address}</div>
              )}
              <div className="space-y-3">
                <Input placeholder="Your Pi wallet address" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} className="font-mono text-sm" />
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={walletConfirmChecked} onChange={e => setWalletConfirmChecked(e.target.checked)} className="mt-0.5" />
                  <span className="text-xs text-muted-foreground">I confirm this is the correct wallet address and I control it</span>
                </label>
                <Button onClick={handleSaveWallet} disabled={loading} className="w-full">Save Wallet Address</Button>
              </div>
            </div>

            {/* Step 2 - Verification */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentChurch?.trust_level === "pending" || currentChurch?.trust_level === "verified" || currentChurch?.trust_level === "highly_verified" ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}>
                  {currentChurch?.trust_level === "pending" || currentChurch?.trust_level === "verified" || currentChurch?.trust_level === "highly_verified" ? <Check className="w-4 h-4" /> : "2"}
                </div>
                <div>
                  <div className="font-semibold text-sm">Submit Verification Proof</div>
                  <div className="text-xs text-muted-foreground">Post your wallet address publicly</div>
                </div>
                {(currentChurch?.trust_level === "pending") && <span className="ml-auto text-xs text-amber-600 font-semibold">Under Review</span>}
                {(currentChurch?.trust_level === "verified" || currentChurch?.trust_level === "highly_verified") && <span className="ml-auto text-xs text-green-600 font-semibold">Verified</span>}
              </div>
              {(currentChurch?.trust_level === "verified" || currentChurch?.trust_level === "highly_verified") ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-sm font-semibold text-green-700 mb-1">✓ Your church is verified</p>
                  <p className="text-xs text-green-600 leading-relaxed">Your listing shows a verified badge. Donors can give with full confidence.</p>
                </div>
              ) : currentChurch?.trust_level === "pending" ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <p className="text-sm font-semibold text-amber-700 mb-1">⏳ Under review</p>
                  <p className="text-xs text-amber-600 leading-relaxed">We received your verification proof and are reviewing it. This usually takes 2 to 5 days. We will email you when it is approved.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Post your Pi wallet address on your church website or official social media so we can independently verify it belongs to your ministry.
                  </p>
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground font-semibold">Where did you post it?</p>
                    <div className="space-y-2">
                      {[
                        { value: "website", label: "Posted on our website" },
                        { value: "facebook", label: "Posted on Facebook page" },
                        { value: "other", label: "Posted elsewhere" },
                      ].map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setVerificationMethod(option.value)}
                          className={`w-full text-sm text-left px-4 py-3 rounded-lg border transition-colors ${
                            verificationMethod === option.value
                              ? "border-primary bg-primary/10 text-primary font-semibold"
                              : "border-border bg-card text-foreground hover:border-primary/50"
                          }`}
                        >
                          {verificationMethod === option.value ? "✓  " : ""}{option.label}
                        </button>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Paste a direct link to the post <span className="text-red-500">*</span></p>
                      <Input
                        placeholder="https://yourchurch.com/pi-donations"
                        value={verificationLink}
                        onChange={e => setVerificationLink(e.target.value)}
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1 opacity-70">Required — helps us verify quickly</p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleSubmitVerification}
                      disabled={loading || !verificationMethod || !verificationLink.trim()}
                    >
                      {loading ? "Submitting..." : "Submit Verification Proof"}
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Step 3 - Profile */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-primary/10 text-primary">3</div>
                <div>
                  <div className="font-semibold text-sm">Enhance Your Profile</div>
                  <div className="text-xs text-muted-foreground">Optional — builds more donor trust</div>
                </div>
              </div>
              <div className="space-y-3">
                <Input placeholder="Leader name (e.g. Father John Smith)" value={leaderName} onChange={e => setLeaderName(e.target.value)} />
                <Input placeholder="Title (e.g. Pastor, Father, Reverend)" value={leaderTitle} onChange={e => setLeaderTitle(e.target.value)} />
                <Input placeholder="Charity registration number (if applicable)" value={charityNumber} onChange={e => setCharityNumber(e.target.value)} />
                <Input placeholder="Physical address" value={physicalAddress} onChange={e => setPhysicalAddress(e.target.value)} />
                <Button onClick={handleUpdateProfile} disabled={loading} variant="outline" className="w-full">Update Profile</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Navigation />
    </>
  )
}
