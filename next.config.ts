import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/guias", destination: "/metodologia", permanent: true }];
  },
};
export default nextConfig;
