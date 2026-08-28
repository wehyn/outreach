import type { NextConfig } from "next";

const allowedDevOrigins = (process.env.OUTREACH_ALLOWED_DEV_ORIGINS ?? "localhost,127.0.0.1,0.0.0.0,100.123.45.66,192.168.2.28")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  allowedDevOrigins,
};

export default nextConfig;
