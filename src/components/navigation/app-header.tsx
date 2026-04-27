import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/auth";

const navItems = [
  { label: "Koti", href: "/" },
  { label: "Katalogi", href: "/ilmoitukset" },
  { label: "Myy", href: "/ilmoitukset/uusi" },
  { label: "Yritykset", href: "/yritykset" },
  { label: "Boostit", href: "/ilmoitukset/uusi" },
  { label: "Tuki", href: "/oma-profiili" },
];

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M4 11.5 12 5l8 6.5V20h-5v-5H9v5H4v-8.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 21a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

export async function AppHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-black/8 bg-white/92 text-[#111111] shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-md">
      <div className="mx-auto grid min-h-[58px] max-w-[1138px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 sm:px-4">
        <nav className="hidden items-center gap-5 text-[13px] font-bold text-[#141414] md:flex lg:gap-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 leading-none transition hover:text-[#d54b17]"
            >
              {item.label === "Koti" ? <HomeIcon /> : null}
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="display text-[18px] font-extrabold leading-none">
          AUTO<span className="text-[#d54b17]">K</span>AUPPA
        </Link>

        <div className="flex items-center justify-end gap-3 text-[#111111]">
          <Link href="/" aria-label="Koti" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 md:hidden">
            <HomeIcon />
          </Link>
          <Link href="/ilmoitukset" aria-label="Hae autoja" className="hidden h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#f3f3f1] sm:inline-flex">
            <SearchIcon />
          </Link>
          <Link href={user ? "/oma-profiili" : "/auth/kirjaudu"} aria-label="Profiili" className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#f3f3f1]">
            <UserIcon />
          </Link>
          {user ? (
            <form action={signOutAction} className="hidden sm:block">
              <button className="h-9 rounded-full border border-black/10 px-4 text-[12px] font-extrabold transition hover:bg-[#f3f3f1]">
                Ulos
              </button>
            </form>
          ) : (
            <Link
              href="/auth/kirjaudu"
              className="hidden h-9 items-center rounded-full border border-black/10 px-4 text-[12px] font-extrabold transition hover:bg-[#f3f3f1] sm:inline-flex"
            >
              Kirjaudu
            </Link>
          )}
          <Link
            href="/ilmoitukset/uusi"
            className="hidden h-9 items-center rounded-full bg-[#111111] px-4 text-[12px] font-extrabold text-white transition hover:bg-[#d54b17] sm:inline-flex"
          >
            Myy auto
          </Link>
        </div>
      </div>
    </header>
  );
}
