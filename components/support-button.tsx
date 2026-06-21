"use client";

import { Button } from "@/components/ui/button";
import { usePiAuth } from "@/contexts/pi-auth-context";
import { Heart } from "lucide-react";

export function SupportButton() {
  const { isAuthenticated } = usePiAuth();

  const handleDonate = () => {
    console.log("Button clicked");
    console.log("Window Pi:", typeof window.Pi);

    if (typeof window === "undefined" || !window.Pi) {
      alert("Pi SDK not available");
      return;
    }

    alert("Starting payment...");

    window.Pi.createPayment(
      {
        amount: 1,
        memo: "Support Tithe in Pi",
        metadata: { type: "platform_support" },
      },
      {
        onReadyForServerApproval: async (paymentId: string) => {
          alert("Approving: " + paymentId);
          await fetch("/api/payments/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId }),
          });
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          await fetch("/api/payments/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid }),
          });
        },
        onCancel: (paymentId: string) => {
          alert("Cancelled: " + paymentId);
        },
        onError: (error: Error) => {
          alert("Error: " + error.message);
        },
      }
    );
  };

  if (!isAuthenticated) return null;

  return (
    <Button onClick={handleDonate} variant="outline" size="sm" className="gap-2">
      <Heart className="w-4 h-4" />
      Donate Pi
    </Button>
  );
}