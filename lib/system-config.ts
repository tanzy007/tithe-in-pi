export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SANDBOX: false,
} as const;

export const BACKEND_CONFIG = {
  BASE_URL: "",
  BLOCKCHAIN_BASE_URL: "https://api.testnet.minepi.com",
} as const;

export const BACKEND_URLS = {
  LOGIN: `/api/login`,
  LOGIN_PREVIEW: `/api/login`,
  GET_PRODUCTS: (appId: string) => `/api/products/${appId}`,
  GET_PAYMENT: (paymentId: string) => `/api/payments/${paymentId}`,
  APPROVE_PAYMENT: (paymentId: string) => `/api/payments/${paymentId}/approve`,
  COMPLETE_PAYMENT: (paymentId: string) => `/api/payments/${paymentId}/complete`,
} as const;

export const PI_PLATFORM_URLS = {} as const;

export const PI_BLOCKCHAIN_URLS = {
  GET_TRANSACTION: (txid: string) =>