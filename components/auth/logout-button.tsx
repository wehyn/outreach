"use client";

import { useState } from "react";

type LogoutState = "idle" | "submitting" | "error";

export function LogoutButton() {
  const [state, setState] = useState<LogoutState>("idle");

  async function handleLogout() {
    setState("submitting");

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      window.location.assign("/login");
    } catch {
      setState("error");
    }
  }

  return (
    <button className="logout-button" disabled={state === "submitting"} onClick={handleLogout} type="button">
      {state === "submitting" ? "Signing out…" : state === "error" ? "Retry sign out" : "Sign out"}
    </button>
  );
}
