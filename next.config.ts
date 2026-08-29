import type { NextConfig } from "next";

import { getAllowedDevOrigins } from "./lib/config/dev-origins";

const allowedDevOrigins = getAllowedDevOrigins(process.env.OUTREACH_ALLOWED_DEV_ORIGINS);

const nextConfig: NextConfig = {
  allowedDevOrigins,
};

export default nextConfig;
