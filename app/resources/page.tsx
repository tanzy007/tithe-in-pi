"use client"

import { Navigation } from "@/components/navigation"
import { ArrowLeft, ChevronRight, MessageCircle, BookOpen, Users, ShieldCheck, Mail } from "lucide-react"
import Link from "next/link"

const GUIDES = [
  {
    num: "1",
    title: "How to Talk to Your Pastor",
    desc: "Opening lines, conversation scripts, and handling objections.",
    url: "/resources/guide1-pastor.html",
    icon: MessageCircle,
    color: "bg-amber-500/10",
    iconColor: "text-amber-600",
  },
  {
    num: "2",
    title: "How to Register Your Church",
    desc: "Step by step from wallet setup to verified listing.",
    url: "/resources/guide2-register.html",
    icon: BookOpen,
    color: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    num: "3",
    title: "How to Tell Your Congregation",
    desc: "Sunday announcements, WhatsApp templates, and bulletin notices.",
    url: "/resources/guide3-congregation.html",
    icon: Users,
    color: "bg-green-500/10",
    iconColor: "text-green-600",
  },
  {
    num: "4",
    title: "How to Get Verified",
    desc: "All 5 trust levels explained with exact steps to reach each one.",
    url: "/resources/guide4-verification.html",
    icon: ShieldCheck,
    color: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
]

function openLink(url: string) {
  window.location.href = url
}

export default function ResourcesPage() {
  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        <main className="container mx-auto px-4 py-6 max-w-lg">

          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold mb-2">Pioneer Guides</h1>
            <p className="text-muted-foreground text-sm">Four guides. Everything you need to walk into your church, get listed, tell your congregation, and get verified — step by step.</p>
          </div>

          {/* Four Guides */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Follow the guides in order</h2>
            <div className="space-y-3">
              {GUIDES.map((guide) => {
                const Icon = guide.icon
                return (
                  <button
                    key={guide.num}
                    onClick={() => openLink(guide.url)}
                    className="w-full flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-lg ${guide.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${guide.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-muted-foreground mb-0.5">Guide {guide.num}</div>
                      <div className="font-semibold text-sm">{guide.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{guide.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tip */}
          <div className="mb-6 bg-muted/20 border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              💡 <span className="font-semibold text-foreground">Tip:</span> Start with Guide 1 and work through them in order. Each guide ends with a handoff to the next step.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-muted/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Need help?</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Contact us at{" "}
              <a href="mailto:hello.titheinpi@gmail.com" className="text-primary hover:underline">hello.titheinpi@gmail.com</a>
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Register Your Church Now
            <ChevronRight className="w-4 h-4" />
          </Link>

        </main>
      </div>
      <Navigation />
    </>
  )
}
