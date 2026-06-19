"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { getSupabase } from "@/lib/supabase"

export default function RequestPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    church_name: "",
    city: "",
    country: "",
    website: "",
    your_email: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = getSupabase()
      const { error: dbError } = await supabase
        .from("church_requests")
        .insert([{
          church_name: formData.church_name,
          city: formData.city,
          country: formData.country,
          website: formData.website || null,
          requester_email: formData.your_email || null,
          created_at: new Date().toISOString(),
        }])

      if (dbError) throw dbError
      setSuccess(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center px-4 pb-20">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Request Received!</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Thank you — we'll reach out to {formData.church_name} and invite them to join the directory.
            </p>
            <Link href="/directory">
              <Button>Back to Directory</Button>
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
            <Link href="/directory" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" />Back to Directory
            </Link>
            <h1 className="text-2xl font-bold mb-2">Request a Church</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Can't find your church in the directory? Let us know and we'll invite them to join.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="church_name">Church Name *</Label>
              <Input id="church_name" name="church_name" value={formData.church_name} onChange={handleChange} required placeholder="St. Mary's Catholic Church" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="Toronto" />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleChange} required placeholder="Canada" />
              </div>
            </div>
            <div>
              <Label htmlFor="website">Church Website</Label>
              <Input id="website" name="website" value={formData.website} onChange={handleChange} placeholder="https://church.org" />
            </div>
            <div>
              <Label htmlFor="your_email">Your Email (optional)</Label>
              <Input id="your_email" name="your_email" type="email" value={formData.your_email} onChange={handleChange} placeholder="So we can update you" />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="bg-muted/30 rounded-xl p-4 text-xs text-muted-foreground leading-relaxed">
              We'll contact the church directly and invite them to register. We won't share your details without permission.
            </div>

            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </main>
      </div>
      <Navigation />
    </>
  )
}
