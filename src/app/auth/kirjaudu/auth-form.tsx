import { env } from "@/lib/env";
import { signInAction, signUpAction } from "@/app/auth/actions";
import { GoogleSignInButton } from "@/app/auth/kirjaudu/google-sign-in-button";

type AuthFormProps = {
  defaultMode: "sign-in" | "sign-up";
  nextPath: string;
};

export function AuthForm({ defaultMode, nextPath }: AuthFormProps) {
  const isSignUp = defaultMode === "sign-up";

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="card rounded-[32px] p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Kirjautuminen
        </p>
        <h2 className="display mt-3 text-3xl font-bold">Jatka ilmoitusten hallintaan</h2>
        <p className="mt-4 max-w-xl text-[var(--color-muted)]">
          Kirjautunut kayttaja voi tallentaa suosikkeja, julkaista autoilmoituksia ja hallita omaa tai
          yrityksen myyjatilia.
        </p>

        <div className="mt-8">
          <GoogleSignInButton
            nextPath={nextPath}
            supabaseUrl={env.nextPublicSupabaseUrl}
            supabaseKey={env.nextPublicSupabaseKey}
          />
        </div>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          <span className="h-px flex-1 bg-white/10" />
          tai sahkopostilla
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form action={signInAction} className="grid gap-4">
          <input type="hidden" name="next" value={nextPath} />
          <label className="grid gap-2">
            <span className="text-sm font-semibold">Sahkoposti</span>
            <input
              name="email"
              type="email"
              required
              className="rounded-2xl border border-white/10 bg-[var(--color-card-soft)] px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
              placeholder="sinun@email.fi"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold">Salasana</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="rounded-2xl border border-white/10 bg-[var(--color-card-soft)] px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
              placeholder="Vahva salasana"
            />
          </label>
          <button className="mt-2 rounded-full bg-[var(--color-accent)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--color-accent-strong)]">
            Kirjaudu sisaan
          </button>
        </form>
      </section>

      <section className="card rounded-[32px] border-[var(--color-accent)]/10 bg-[color-mix(in_srgb,var(--color-card)_92%,black_8%)] p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Rekisteroityminen
        </p>
        <h2 className="display mt-3 text-3xl font-bold">Luo myyjatili</h2>
        <p className="mt-4 max-w-xl text-[var(--color-muted)]">
          Alkuun riittaa kevyt tili. Yritystili, premium-profiili ja boost-tuotteet rakennetaan saman
          perustan paalle.
        </p>

        <form action={signUpAction} className="mt-8 grid gap-4">
          <input type="hidden" name="next" value={nextPath} />
          <label className="grid gap-2">
            <span className="text-sm font-semibold">Nimi</span>
            <input
              name="full_name"
              type="text"
              required
              className="rounded-2xl border border-white/10 bg-[var(--color-card-soft)] px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
              placeholder="Matti Meikalainen"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold">Sahkoposti</span>
            <input
              name="email"
              type="email"
              required
              className="rounded-2xl border border-white/10 bg-[var(--color-card-soft)] px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
              placeholder="myyja@email.fi"
            />
          </label>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            Kayta oikeaa sahkopostiosoitetta, johon paasee vastaanottamaan vahvistusviestin.
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold">Salasana</span>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="rounded-2xl border border-white/10 bg-[var(--color-card-soft)] px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
                placeholder="Vahva salasana"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold">Tilin tyyppi</span>
              <select
                name="role"
                defaultValue={isSignUp ? "private_seller" : "private_seller"}
                className="rounded-2xl border border-white/10 bg-[var(--color-card-soft)] px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"
              >
                <option value="private_seller">Yksityismyyja</option>
                <option value="business_seller">Yritysmyyja</option>
              </select>
            </label>
          </div>
          <button className="mt-2 rounded-full border border-white/10 bg-[var(--color-card-soft)] px-5 py-3 font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface-strong)]">
            Luo tili
          </button>
          {isSignUp ? (
            <p className="text-sm text-[var(--color-muted)]">
              Rekisteroitymisen jalkeen palaat vahvistuksen kautta samaan tavoitesivuun.
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
