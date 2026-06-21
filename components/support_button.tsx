"use client";

import { Button } from "@/components/ui/button";
import { usePiAuth } from "@/contexts/pi-auth-context";
import { Heart } from "lucide-react";

export function SupportButton() {
  const { isAuthenticated } = usePiAuth();

  const handleDonate = () => {
    if (typeof window === "undefined" || !window.Pi) return;

    window.Pi.createPayment(
      {
        amount: 1,
        memo: "Support Tithe in Pi",
        metadata: { type: "platform_support" },
      },
      {
        onReadyForServerApproval: async (paymentId: string) => {
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
          console.log("Payment cancelled", paymentId);
        },
        onError: (error: Error) => {
          console.error("Payment error", error);
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