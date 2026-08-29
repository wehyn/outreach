import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import { getSession, hasRegisteredUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function safeRedirectPath(value: string | undefined) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  if (await getSession()) {
    redirect("/");
  }

  const params = await searchParams;
  const accountRegistered = await hasRegisteredUser();

  return (
    <main className="auth-page">
      <section aria-labelledby="register-heading" className="auth-card panel">
        <div className="auth-brand">
          <span className="brand-mark">o</span>
          <span>
            outreach<span className="brand-dot">.</span>
          </span>
        </div>
        <p className="eyebrow">Private workspace</p>
        <h1 id="register-heading">Create your Outreach account.</h1>
        <p className="auth-intro">Create the first local account for this SQLite workspace. Your password is stored as a secure hash.</p>
        {accountRegistered ? (
          <p className="auth-notice" role="status">
            An account is already registered for this local workspace. <Link href="/login">Sign in</Link> with that account.
          </p>
        ) : (
          <RegisterForm redirectTo={safeRedirectPath(params?.next)} />
        )}
      </section>
    </main>
  );
}
