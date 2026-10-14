import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/routing/legacy-redirects";

const nextConfig: NextConfig = {
  // Retired v3.0-alignment paths. An explicit status code gives 301 (not Next's 308 default).
  async redirects() {
    return legacyRedirects.map(({ source, destination }) => ({ source, destination, statusCode: 301 }));
  },
};

export default nextConfig;
