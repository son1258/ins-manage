type RuntimeConfig = {
  BASE_URL?: string;
  APP_ENV?: string;
};

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

export const getRuntimeConfig = (): RuntimeConfig => {
  if (typeof window === "undefined") return {};
  return window.__RUNTIME_CONFIG__ || {};
};