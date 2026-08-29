const LOCAL_DEV_ORIGINS = ["localhost", "127.0.0.1", "0.0.0.0"];

export function getAllowedDevOrigins(configuredOrigins = process.env.OUTREACH_ALLOWED_DEV_ORIGINS) {
  return (configuredOrigins ?? LOCAL_DEV_ORIGINS.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
