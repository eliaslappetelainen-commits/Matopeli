import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/auth";

const navItems = [
  { href: "/ilmoitukset", label: "Ilmoitukset" },
  { href: "/yritykset", label: "Yritysmyyjat" },
  { href: "/suosikit", label: "Suosikit" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[rgba(251,247,239,0.84)] backdrop-blur">
      <div className="shell flex items-center justify-between py-4">
        <Link href="/" className="display text-xl font-bold tracking-tight">
          Matopeli
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[var(--color-muted)] md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[var(--color-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/oma-profiili"
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold"
              >
                Oma profiili
              </Link>
              <form action={signOutAction}>
                <button className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold">
                  Kirjaudu ulos
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/auth/kirjaudu"
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold"
            >
              Kirjaudu
            </Link>
          )}
          <Link
            href="/ilmoitukset/uusi"
            className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-strong)]"
          >
            Jata ilmoitus
          </Link>
        </div>
      </div>
    </header>
  );
}
