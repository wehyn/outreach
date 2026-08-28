import { redirect } from "next/navigation";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { getSession, hasRegisteredUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function safeRedirectPath(value: string | undefined) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  if (await getSession()) {
    redirect("/");
  }

  const params = await searchParams;
  const accountRegistered = hasRegisteredUser();

  return (
    <main className="auth-page">
      <section aria-labelledby="login-heading" className="auth-card panel">
        <div className="auth-brand">
          <span className="brand-mark">o</span>
          <span>outreach<span className="brand-dot">.</span></span>
        </div>
        <p className="eyebrow">Private workspace</p>
        <h1 id="login-heading">Sign in to Outreach.</h1>
        <p className="auth-intro">Use the local workspace credentials for this database.</p>
        {!accountRegistered ? (
          <p className="auth-notice" role="status">
            No account is registered in this local database yet. <Link href="/register">Create one</Link> to get started.
          </p>
        ) : null}
        <LoginForm redirectTo={safeRedirectPath(params?.next)} />
      </section>
    </main>
  );
}
