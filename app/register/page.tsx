"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { getSupabase } from "@/lib/supabase"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    denomination: "",
    city: "",
    country: "",
    website: "",
    email: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = getSupabase()

      // Check for duplicate church
      const { data: existing } = await supabase
        .from("churches")
        .select("id")
        .ilike("name", formData.name.trim())
        .ilike("city", formData.city.trim())
        .ilike("country", formData.country.trim())
        .limit(1)

      if (existing && existing.length > 0) {
        setError("A church with this name in this city and country is already registered. If this is your church, use the Onboarding page to access your listing.")
        setLoading(false)
        return
      }

      const { data, error: insertError } = await supabase.from("churches").insert([{
        ...formData,
        name: formData.name.trim(),
        city: formData.city.trim(),
        country: formData.country.trim(),
        email: formData.email.trim(),
        trust_level: "listed",
        wallet_confirmed: false,
        email_verified: false,
        last_updated: new Date().toISOString(),
      }]).select()

      if (insertError) throw insertError

      // Send verification email with PIN
      if (data && data.length > 0) {
        const churchId = data[0].id
        const verifyResponse = await fetch('/api/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            churchId,
            email: formData.email.trim(),
          }),
        })

        if (!verifyResponse.ok) {
          console.error('Failed to send PIN email')
          // Don't fail registration if email fails - user can request resend
        }
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register church")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (success) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center px-4 pb-20">
          <div className="text-center max-w-md px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Registration Successful!</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Your church has been listed in the directory.
            </p>
            <div className="bg-card border border-border rounded-xl p-5 text-left mb-6">
              <p className="text-sm font-semibold mb-2">📬 Check your email</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We've sent your onboarding PIN to <strong>{formData.email}</strong>. Check your inbox (and spam folder just in case). Use that PIN on the Onboarding page to add your Pi wallet and complete your listing.
              </p>
            </div>
            <Link href="/onboard" className="inline-flex items-center justify-center w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              Go to Onboarding
            </Link>
          </div>
        </div>
        <Navigation />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        <main className="container mx-auto px-4 py-6 max-w-lg">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold mb-2">Register Your Church</h1>
            <p className="text-muted-foreground text-sm">Join the Pi-ready ministry directory</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Church Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="First Baptist Church"
              />
            </div>

            <div>
              <Label htmlFor="denomination">Denomination</Label>
              <Input
                id="denomination"
                name="denomination"
                value={formData.denomination}
                onChange={handleChange}
                placeholder="Baptist, Catholic, Non-denominational..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Dallas"
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  placeholder="USA"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="contact@church.org"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://church.org"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your ministry..."
                rows={4}
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? "Registering..." : "Register Church"}
            </Button>
          </form>
        </main>
      </div>
      <Navigation />
    </>
  )
}
