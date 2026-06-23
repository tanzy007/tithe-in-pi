export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SANDBOX: false,
} as const;

export const BACKEND_CONFIG = {
  BASE_URL: "",
  BLOCKCHAIN_BASE_URL: "https://api.minepi.com",
} as const;

export const BACKEND_URLS = {
  LOGIN: "/api/login",
  LOGIN_PREVIEW: "/api/login",
  GET_PRODUCTS: function(appId: string) { return "/api/products/" + appId; },
  GET_PAYMENT: function(paymentId: string) { return "/api/payments/" + paymentId; },
  APPROVE_PAYMENT: function(paymentId: string) { return "/api/payments/" + paymentId + "/approve"; },
  COMPLETE_PAYMENT: function(paymentId: string) { return "/api/payments/" + paymentId + "/complete"; },
} as const;

export const PI_PLATFORM_URLS = {} as const;

export const PI_BLOCKCHAIN_URLS = {
  GET_TRANSACTION: function(txid: string) { return "https://api.minepi.com/transactions/" + txid + "/effects"; },
} as const;