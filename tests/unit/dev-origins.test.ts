import { describe, expect, it } from "vitest";

import { getAllowedDevOrigins } from "../../lib/config/dev-origins";

describe("development origin configuration", () => {
  it("uses local origins by default without machine-specific addresses", () => {
    const origins = getAllowedDevOrigins();

    expect(origins).toEqual(["localhost", "127.0.0.1", "0.0.0.0"]);
    expect(origins).not.toContain("100.123.45.66");
    expect(origins).not.toContain("192.168.2.28");
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
