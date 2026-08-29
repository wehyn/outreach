import type { NextConfig } from "next";

import { getAllowedDevOrigins } from "./lib/config/dev-origins";

const allowedDevOrigins = getAllowedDevOrigins();

const nextConfig: NextConfig = {
  allowedDevOrigins,
};

export default nextConfig;
