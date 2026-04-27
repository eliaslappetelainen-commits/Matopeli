import Link from "next/link";
import { featuredListings } from "@/data/mock-listings";

const categories = [
  "Farmarit",
  "Sahkoautot",
  "Neliveto",
  "Perheautot",
  "Premium",
  "Yritysmyyjat",
];

const heroImage =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85";
const topBackgroundImage = "/volkswagen-hero.png";

const productImages = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=700&q=85",
];

const heroListing = featuredListings[0];
const productGrid = featuredListings.slice(0, 4);

const heroDetails = [
  "128 tkm",
  "Diesel",
  "Automaatti",
  "Neliveto",
];

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M12 20s-7-4.4-7-10.1A4 4 0 0 1 12 7a4 4 0 0 1 7 2.9C19 15.6 12 20 12 20Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="m13 2-8 12h6l-1 8 9-13h-6l0-7Z" fill="currentColor" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M4 8.5h3l1.5-2h7l1.5 2h3v10H4v-10Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="13.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function ShowroomHome() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#111111]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[350px] bg-cover bg-center opacity-72 sm:h-[410px] lg:h-[520px]"
        style={{
          backgroundImage: `url("${topBackgroundImage}")`,
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[390px] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.32)_58%,#ffffff_100%)] sm:h-[470px] lg:h-[590px]" />

      <section className="relative mx-auto min-h-screen max-w-[1138px] overflow-hidden rounded-b-[8px] border-b-[5px] border-[#e4d6c1] bg-transparent px-3 pb-8 pt-5 sm:px-4 lg:px-4">
        <section className="grid gap-3 sm:grid-cols-[1.62fr_0.98fr]">
          <article
            className="relative h-[294px] overflow-hidden rounded-[8px] bg-[#dedbd6] bg-cover bg-center sm:h-[314px] lg:h-[432px]"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(36, 34, 31, 0.48), rgba(36, 34, 31, 0.04) 63%), url("${heroImage}")`,
            }}
          >
            <div className="absolute left-5 top-5 flex max-w-[250px] items-start gap-3 text-white lg:left-6 lg:top-6 lg:max-w-[270px] lg:gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white/18 backdrop-blur lg:h-11 lg:w-11">
                <BoltIcon />
              </span>
              <p className="text-[13px] font-semibold leading-[1.24] text-white lg:text-[15px]">
                Featured-auto etusivun parhaalla paikalla
              </p>
            </div>

            <div className="absolute right-5 top-5 hidden gap-2 lg:flex">
              {heroDetails.map((detail) => (
                <span
                  key={detail}
                  className="rounded-full bg-white/16 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur"
                >
                  {detail}
                </span>
              ))}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex min-h-[56px] items-center justify-between gap-3 rounded-[8px] bg-[#6f6f6f]/78 px-3 text-white backdrop-blur-md lg:bottom-5 lg:left-5 lg:right-5 lg:min-h-[64px] lg:px-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-[6px] bg-white/88 text-[#d54b17] lg:h-11 lg:w-11">
                  <BoltIcon />
                </div>
                <div>
                  <p className="max-w-[230px] truncate text-[13px] font-semibold leading-none lg:max-w-none lg:text-[15px]">
                    {heroListing.title}
                  </p>
                  <p className="mt-2 text-[11px] text-white/78 lg:text-[12px]">
                    {heroListing.city} - {heroListing.priceEur.toLocaleString("fi-FI")} EUR
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-4 md:flex">
                <button
                  type="button"
                  aria-label="Edellinen featured-auto"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/30 text-[13px] text-white"
                >
                  {"<"}
                </button>
                <span className="text-[12px] text-white/82">1/5</span>
                <button
                  type="button"
                  aria-label="Seuraava featured-auto"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/30 text-[13px] text-white"
                >
                  {">"}
                </button>
              </div>
            </div>
          </article>

          <Link
            href="/ilmoitukset/uusi"
            className="group relative block h-[294px] overflow-hidden rounded-[8px] border border-white/45 bg-[#f3f3f1]/88 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)] backdrop-blur-[3px] transition duration-200 hover:bg-[#eeeeea]/90 sm:h-[314px] lg:h-[432px]"
            aria-label="Luo oma autoilmoitus"
          >
            <div className="absolute left-5 top-5 flex gap-1.5">
              <span className="h-5 w-5 rounded-full bg-[#868783]" />
              <span className="h-5 w-5 rounded-full bg-[#6f6f69]" />
              <span className="h-5 w-5 rounded-full bg-[#a86622]" />
            </div>

            <div className="absolute inset-x-5 top-16 rounded-[8px] bg-white/88 px-4 py-4 shadow-[0_18px_38px_rgba(30,26,20,0.08)] backdrop-blur-[2px] sm:top-[70px] md:inset-x-7 lg:top-[92px] lg:px-5 lg:py-5">
              <div className="grid grid-cols-[72px_1fr] gap-4 lg:grid-cols-[96px_1fr]">
                <div className="grid aspect-square place-items-center rounded-[8px] bg-[#111111] text-white transition group-hover:scale-[0.98]">
                  <PlusIcon />
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase leading-none text-[#d54b17]">
                    Aloita myynti
                  </p>
                  <h2 className="mt-2 text-[20px] font-extrabold leading-[1.05] lg:text-[28px]">
                    Luo oma autoilmoitus
                  </h2>
                  <p className="mt-2 hidden text-[12px] font-medium leading-5 text-[#747474] lg:block">
                    Lisaa kuvat, hinta ja auton tiedot. Voit julkaista heti tai tallentaa luonnoksena.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <span className="rounded-[7px] bg-[#f3f3f1] px-3 py-2 text-[11px] font-bold text-[#111111]">
                  10 kuvaa
                </span>
                <span className="rounded-[7px] bg-[#f3f3f1] px-3 py-2 text-[11px] font-bold text-[#111111]">
                  Boost valmis
                </span>
                <span className="rounded-[7px] bg-[#f3f3f1] px-3 py-2 text-[11px] font-bold text-[#111111]">
                  SEO URL
                </span>
              </div>
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <div>
                <p className="max-w-[210px] text-[13px] font-bold leading-[1.2] lg:max-w-none lg:text-[15px]">
                  Ilmoitus auki alle minuutissa
                </p>
                <p className="mt-2 flex items-center gap-2 text-[12px] font-medium text-[#777777]">
                  <CameraIcon />
                  Kuvien lataus seuraavaksi
                </p>
              </div>

              <span
                className="inline-flex h-10 min-w-[104px] shrink-0 items-center justify-center rounded-full bg-[#111111] px-4 text-[11px] font-bold lg:h-12 lg:min-w-[122px] lg:px-6 lg:text-[12px]"
                style={{ color: "#ffffff" }}
              >
                Luo ilmoitus
              </span>
            </div>
          </Link>
        </section>

        <section className="mt-16 sm:mt-[76px] lg:mt-[104px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-[28px] font-extrabold leading-none sm:text-[30px]">
              Popular cars
            </h1>

            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Link
                  key={category}
                  href="/ilmoitukset"
                  className={`rounded-full border px-4 py-2 text-[11px] font-semibold leading-none ${
                    index === 1
                      ? "border-[#111111] bg-[#111111]"
                      : "border-[#111111] bg-white text-[#111111]"
                  }`}
                  style={{ color: index === 1 ? "#ffffff" : "#111111" }}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {productGrid.map((listing, index) => (
              <Link key={listing.id} href="/ilmoitukset" className="group block">
                <div
                  className="relative aspect-[1.05] rounded-[8px] bg-[#f1f1f1] bg-[length:112%_112%] bg-center bg-no-repeat transition duration-200 group-hover:scale-[0.99]"
                  style={{
                    backgroundImage: `url("${productImages[index]}")`,
                  }}
                >
                  <span
                    className={`absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white ${
                      index === 2 ? "text-[#ff6a1a]" : "text-[#111111]"
                    }`}
                  >
                    <HeartIcon filled={index === 2} />
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-[14px] font-extrabold leading-none">
                    {listing.priceEur.toLocaleString("fi-FI")} EUR
                  </p>
                  <p className="mt-2 text-[14px] font-semibold leading-[1.2]">{listing.title}</p>
                  <p className="mt-1 text-[12px] font-medium text-[#777777]">
                    {listing.city}, {listing.year}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
