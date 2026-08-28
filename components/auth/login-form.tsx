"use client";

import { useState, type FormEvent } from "react";

type LoginFormProps = {
  redirectTo: string;
};

type LoginState = "idle" | "submitting" | "error";

function errorMessage(payload: unknown) {
  if (typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  return "Sign in could not be completed.";
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<LoginState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(errorMessage(payload));
      }

      window.location.assign(redirectTo);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Sign in could not be completed.");
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="form-field" htmlFor="auth-email">
        <span>Email</span>
        <input
          autoComplete="email"
          id="auth-email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <label className="form-field" htmlFor="auth-password">
        <span>Password</span>
        <input
          autoComplete="current-password"
          id="auth-password"
          minLength={12}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>
      <button className="button button-primary auth-submit" disabled={state === "submitting"} type="submit">
        {state === "submitting" ? "Signing in…" : "Sign in"}
      </button>
      <p aria-live="polite" className={`form-status form-status-${state}`}>
        {state === "error" ? message : ""}
      </p>
    </form>
  );
}
