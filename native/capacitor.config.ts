import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Sideload experiment only. The live JustSpin web app stays at the repo root
 * (and in /original-web). This shell loads the production site in a WebView.
 */
const config: CapacitorConfig = {
  appId: "com.northfold.justspin",
  appName: "JustSpin",
  webDir: "www",
  server: {
    url: "https://justspin.app",
    androidScheme: "https",
    allowNavigation: [
      "justspin.app",
      "www.justspin.app",
      "*.justspin.app",
      "*.vercel.app",
      "accounts.google.com",
      "*.google.com",
      "x.com",
      "*.x.com",
      "twitter.com",
      "api.twitter.com",
      "*.paypal.com",
    ],
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
  },
};

export default config;
