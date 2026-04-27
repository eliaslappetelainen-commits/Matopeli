import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthForm } from "@/app/auth/kirjaudu/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { sanitizeNextPath } from "@/lib/next-path";

type SignInPageProps = {
  searchParams: Promise<{
    mode?: string;
    error?: string;
    success?: string;
    next?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const nextPath = sanitizeNextPath(
    params.next ?? cookieStore.get("matopeli-auth-next")?.value,
  );
  const user = await getCurrentUser();

  if (user) {
    redirect(nextPath);
  }

  const defaultMode = params.mode === "sign-up" ? "sign-up" : "sign-in";

  return (
    <main className="shell py-10 md:py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="display text-4xl font-bold md:text-5xl">
          Kirjaudu tai luo tili
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--color-muted)]">
          Tama vaihe avaa meille suosikit, profiilin, ilmoitusten luonnit ja
          myyjan hallinnan samalla Supabase Auth -pohjalla.
        </p>
      </div>

      {nextPath !== "/oma-profiili" ? (
        <div className="mb-6 rounded-3xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm text-sky-900">
          Kirjautumisen jalkeen sinut ohjataan sivulle{" "}
          <strong>{nextPath}</strong>.
        </div>
      ) : null}

      {params.error ? (
        <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          {params.error}
        </div>
      ) : null}

      {params.success ? (
        <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          {params.success}
        </div>
      ) : null}

      <AuthForm defaultMode={defaultMode} nextPath={nextPath} />
    </main>
  );
}
