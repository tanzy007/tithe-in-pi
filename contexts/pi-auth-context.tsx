"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { PI_NETWORK_CONFIG, BACKEND_URLS } from "@/lib/system-config";
import { api, setApiAuthToken } from "@/lib/api";

export type LoginDTO = {
  id: string;
  username: string;
  credits_balance: number;
  terms_accepted: boolean;
};

interface PiAuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
}

export type PiPaymentCallbacks = {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: unknown) => void;
};

export type PiPaymentData = {
  amount: number;
  memo: string;
  metadata?: Record<string, unknown>;
};

declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (scopes: string[], onIncompletePaymentFound?: (payment: unknown) => Promise<void>) => Promise<PiAuthResult>;
      createPayment: (paymentData: PiPaymentData, callbacks: PiPaymentCallbacks) => void;
    };
  }
}

const COMMUNICATION_REQUEST_TYPE = '@pi:app:sdk:communication_information_request';
const DEFAULT_ERROR_MESSAGE = 'Failed to authenticate or login. Please refresh and try again.';

function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === 'SecurityError' || error.code === DOMException.SECURITY_ERR || error.code === 18)
    ) {
      return true;
    }
    if (error instanceof Error && /Permission denied/i.test(error.message)) {
      return true;
    }
    throw error;
  }
}

function parseJsonSafely(value: any): any {