"use client"

import { useState } from "react"
import { Flag } from "lucide-react"
import { getSupabase } from "@/lib/supabase"

export function ReportButton({ churchId, churchName }: { churchId: string; churchName: string }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!reason) return
    setLoading(true)
    try {
      const supabase = getSupabase()
      await supabase.from("church_reports").insert([{
        church_id: churchId,
        reason,
        details: details || null,
        reporter_email: email || null,
      }])
      setDone(true)
    } catch (e) {
      // fail silently
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="w-full p-3 rounded-xl border border-border text-sm text-muted-foreground text-center">
        ✓ Report submitted. Thank you.
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
      >
        <Flag className="w-4 h-4" />
        Report this listing
      </button>
    )
  }

  return (
    <div className="w-full rounded-xl border border-border p-4 space-y-3">
      <div className="text-sm font-semibold">Report {churchName}</div>

      <select
        value={reason}
        onChange={e => setReason(e.target.value)}
        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
      >
        <option value="">Select a reason...</option>
        <option value="fake_listing">Fake or fraudulent listing</option>
        <option value="wrong_wallet">Incorrect wallet address</option>
        <option value="not_a_church">Not a real church</option>
        <option value="scam">Potential scam</option>
        <option value="other">Other</option>
      </select>

      <textarea
        value={details}
        onChange={e => setDetails(e.target.value)}
        placeholder="Additional details (optional)"
        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background resize-none"
        rows={3}
      />

      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email (optional)"
        type="email"
        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
      />

      <div className="flex gap-2">
        <button
          onClick={() => setOpen(false)}
          className="flex-1 p-2 rounded-lg border border-border text-sm text-muted-foreground"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!reason || loading}
          className="flex-1 p-2 rounded-lg bg-destructive text-white text-sm disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  )
}
