import { afterEach, describe, expect, it, vi } from "vitest";

import { getAllowedDevOrigins } from "../../lib/config/dev-origins";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("development origin configuration", () => {
  it("uses local origins by default even when remote origins are configured", () => {
    vi.stubEnv("OUTREACH_ALLOWED_DEV_ORIGINS", "100.123.45.66");

    const origins = getAllowedDevOrigins();

    expect(origins).toEqual(["localhost", "127.0.0.1", "0.0.0.0"]);
    expect(origins).not.toContain("100.123.45.66");
    expect(origins).not.toContain("192.168.2.28");
  });

  it("wires configured remote hosts into the Next.js configuration", async () => {
    vi.stubEnv("OUTREACH_ALLOWED_DEV_ORIGINS", "localhost,100.123.45.66");

    const { default: nextConfig } = await import("../../next.config");

    expect(nextConfig.allowedDevOrigins).toEqual(["localhost", "100.123.45.66"]);
  });

  it("allows configured remote hosts and rejects hosts not in the configured list", () => {
    const origins = getAllowedDevOrigins("localhost, 100.123.45.66, dev.example.test");

    expect(origins).toEqual(["localhost", "100.123.45.66", "dev.example.test"]);
    expect(origins).toContain("100.123.45.66");
    expect(origins).not.toContain("192.168.2.28");
  });

  it("ignores empty entries and surrounding whitespace", () => {
    expect(getAllowedDevOrigins(" localhost, , dev.example.test, ")).toEqual([
      "localhost",
      "dev.example.test",
    ]);
  });
});
