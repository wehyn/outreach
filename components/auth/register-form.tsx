"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type RegisterFormProps = {
  redirectTo: string;
};

type RegisterState = "idle" | "submitting" | "error";

function errorMessage(payload: unknown) {
  if (typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  return "Registration could not be completed.";
}

export function RegisterForm({ redirectTo }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState<RegisterState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        body: JSON.stringify({ confirmPassword, email, name, password }),
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
      setMessage(error instanceof Error ? error.message : "Registration could not be completed.");
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="form-field" htmlFor="register-name">
        <span>Name</span>
        <input
          autoComplete="name"
          id="register-name"
          onChange={(event) => setName(event.target.value)}
          required
          type="text"
          value={name}
        />
      </label>
      <label className="form-field" htmlFor="register-email">
        <span>Email</span>
        <input
          autoComplete="email"
          id="register-email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <label className="form-field" htmlFor="register-password">
        <span>Password</span>
        <input
          autoComplete="new-password"
          id="register-password"
          minLength={12}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>
      <label className="form-field" htmlFor="register-confirm-password">
        <span>Confirm password</span>
        <input
          autoComplete="new-password"
          id="register-confirm-password"
          minLength={12}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          type="password"
          value={confirmPassword}
        />
      </label>
      <button className="button button-primary auth-submit" disabled={state === "submitting"} type="submit">
        {state === "submitting" ? "Creating account…" : "Create account"}
      </button>
      <p aria-live="polite" className={`form-status form-status-${state}`}>
        {state === "error" ? message : ""}
      </p>
      <p className="auth-switch">
        Already registered? <Link href="/login">Sign in</Link>
      </p>
    </form>
  );
}
