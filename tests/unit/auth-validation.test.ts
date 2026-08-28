import { describe, expect, it } from "vitest";

import { registerSchema } from "../../lib/validation/auth";

const validRegistration = {
  confirmPassword: "long-enough-password",
  email: "new-owner@example.com",
  name: "New Owner",
  password: "long-enough-password",
};

describe("registration validation", () => {
  it("accepts a valid first-account registration", () => {
    expect(registerSchema.safeParse(validRegistration).success).toBe(true);
  });

  it("rejects registrations with mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      confirmPassword: "different-password",
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ["confirmPassword"] })]),
    );
  });
});