"use client";

import { useTransition } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { sanitizeNextPath } from "@/lib/next-path";

type GoogleSignInButtonProps = {
  nextPath: string;
  supabaseUrl: string;
  supabaseKey: string;
};

export function GoogleSignInButton({
  nextPath,
  supabaseUrl,
  supabaseKey,
}: GoogleSignInButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleGoogleSignIn() {
    startTransition(async () => {
      const supabase = createBrowserClient(supabaseUrl, supabaseKey);
      const safeNextPath = sanitizeNextPath(nextPath);
      document.cookie = `matopeli-auth-next=${encodeURIComponent(
        safeNextPath,
      )}; path=/; max-age=600; samesite=lax`;

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            safeNextPath,
          )}`,
        },
      });
    });
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isPending}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-[var(--color-card-soft)] px-5 py-3 font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface-strong)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span className="text-base">G</span>
      {isPending ? "Avataan Google..." : "Jatka Googlella"}
    </button>
  );
}
