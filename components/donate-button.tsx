"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Coins, Copy, Check } from "lucide-react"

export function DonateButton({
  walletAddress,
  churchName,
}: {
  walletAddress: string
  churchName: string
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleOpen() {
    setCopied(false)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setTimeout(() => setCopied(false), 300)
  }

  function copyAddress() {
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <>
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="text-center mb-4">
          <h2 className="font-semibold text-lg mb-1">Support This Ministry</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Send Pi directly to this church from your Pi Wallet
          </p>
        </div>

        <Button onClick={handleOpen} className="w-full h-14 text-base gap-2" size="lg">
          <Coins className="w-5 h-5" />
          Donate in Pi
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
        <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden">
          <div className="p-5">
            <DialogHeader className="mb-4 text-left">
              <DialogTitle className="text-base">Donate to {churchName}</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                Copy the wallet address and send Pi directly from your Pi Wallet. You are sending this yourself.
              </DialogDescription>
            </DialogHeader>

            {/* Wallet address */}
            <div className="bg-muted/40 rounded-xl p-3 border border-border mb-4">
              <p className="text-xs text-muted-foreground mb-2">Church Pi Wallet Address</p>
              <p className="text-xs font-mono break-all text-foreground mb-3 leading-relaxed select-all">{walletAddress}</p>
              <button
                onClick={copyAddress}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  copied
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {copied
                  ? <><Check className="w-4 h-4" /> Copied!</>
                  : <><Copy className="w-4 h-4" /> Copy Wallet Address</>
                }
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-2 mb-4">
              {[
                "Copy the wallet address above",
                "Open your Pi Wallet app",
                "Paste the address and send your gift",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-xs text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mb-3" onClick={handleClose}>
              Done
            </Button>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              We're working on bringing in-app one-tap donations. For now your gift goes directly from your wallet to theirs.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
