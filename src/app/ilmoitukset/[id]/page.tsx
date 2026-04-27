import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ListingPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    success?: string;
  }>;
};

type ListingRow = {
  id: string;
  title: string;
  description: string;
  price_eur: number;
  year: number;
  mileage_km: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  drivetrain: string;
  power_hp: number | null;
  engine_size_l: number | null;
  color: string | null;
  city: string;
  condition: string;
  registration_number: string | null;
  equipment: string[] | null;
  status: "draft" | "published" | "sold" | "archived";
  created_at: string;
};

const topBackgroundImage = "/volkswagen-hero.png";

const conditionLabels: Record<string, string> = {
  Excellent: "Erinomainen",
  Good: "Hyva",
  Fair: "Tyydyttava",
};

function formatNumber(value: number) {
  return value.toLocaleString("fi-FI");
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-[#f3f3f1] px-4 py-3">
      <p className="text-[12px] font-extrabold uppercase text-[#777777]">{label}</p>
      <p className="mt-1 text-[15px] font-extrabold text-[#111111]">{value}</p>
    </div>
  );
}

export default async function ListingPage({
  params,
  searchParams,
}: ListingPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: listing } = await supabase
    .from("listings")
    .select(
      "id, title, description, price_eur, year, mileage_km, fuel_type, transmission, body_type, drivetrain, power_hp, engine_size_l, color, city, condition, registration_number, equipment, status, created_at",
    )
    .eq("id", id)
    .maybeSingle<ListingRow>();

  if (!listing) {
    notFound();
  }

  const equipment = listing.equipment ?? [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#111111]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-cover bg-center opacity-45"
        style={{ backgroundImage: `url("${topBackgroundImage}")` }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[430px] bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.58)_52%,#ffffff_100%)]" />

      <section className="relative mx-auto min-h-screen max-w-[1138px] border-b-[5px] border-[#e4d6c1] px-3 pb-10 pt-8 sm:px-4">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <article className="overflow-hidden rounded-[8px] border border-white/60 bg-white/92 shadow-[0_18px_45px_rgba(0,0,0,0.1)] backdrop-blur-[4px]">
            <div className="border-b border-[#e8e8e8] px-5 py-5 md:px-7">
              {query.success ? (
                <div className="mb-4 flex flex-col gap-3 rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] font-bold text-emerald-800 sm:flex-row sm:items-center sm:justify-between">
                  <span>{query.success}</span>
                  {listing.status === "draft" ? (
                    <Link
                      href={`/ilmoitukset/${listing.id}/kuvat`}
                      className="inline-flex h-10 items-center justify-center rounded-full bg-[#111111] px-4 text-[12px] font-extrabold text-white"
                    >
                      Jatka kuviin
                    </Link>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-extrabold uppercase leading-none text-[#d54b17]">
                    {listing.status === "draft" ? "Luonnos" : "Ilmoitus"}
                  </p>
                  <h1 className="mt-3 text-[34px] font-extrabold leading-[1.03] md:text-[44px]">
                    {listing.title}
                  </h1>
                  <p className="mt-3 text-[17px] font-bold text-[#666666]">
                    {listing.city} - {listing.year} - {formatNumber(listing.mileage_km)} km
                  </p>
                </div>
                <div className="rounded-[8px] bg-[#111111] px-5 py-4 text-white">
                  <p className="text-[12px] font-extrabold uppercase text-white/60">Hinta</p>
                  <p className="mt-1 text-[24px] font-extrabold">
                    {formatNumber(listing.price_eur)} EUR
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 px-5 py-6 md:px-7">
              <section>
                <h2 className="text-[22px] font-extrabold">Kuvaus</h2>
                <p className="mt-3 whitespace-pre-line text-[15px] font-semibold leading-7 text-[#555555]">
                  {listing.description}
                </p>
              </section>

              <section>
                <h2 className="text-[22px] font-extrabold">Auton tiedot</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <StatTile label="Kayttovoima" value={listing.fuel_type} />
                  <StatTile label="Vaihteisto" value={listing.transmission} />
                  <StatTile label="Korimalli" value={listing.body_type} />
                  <StatTile label="Vetotapa" value={listing.drivetrain} />
                  <StatTile label="Teho" value={listing.power_hp ? `${listing.power_hp} hv` : "-"} />
                  <StatTile label="Moottori" value={listing.engine_size_l ? `${listing.engine_size_l} l` : "-"} />
                  <StatTile label="Vari" value={listing.color ?? "-"} />
                  <StatTile label="Kunto" value={conditionLabels[listing.condition] ?? listing.condition} />
                  <StatTile label="Rekisteri" value={listing.registration_number ?? "-"} />
                </div>
              </section>

              <section>
                <h2 className="text-[22px] font-extrabold">Varusteet</h2>
                {equipment.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {equipment.map((item) => (
                      <span
                        key={item}
                        className="rounded-[8px] border border-[#111111] bg-white px-3 py-2 text-[13px] font-extrabold text-[#111111]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-[14px] font-semibold text-[#777777]">
                    Varusteita ei ole viela lisatty.
                  </p>
                )}
              </section>
            </div>
          </article>

          <aside className="grid content-start gap-4">
            <section className="rounded-[8px] border border-white/60 bg-white/88 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.1)] backdrop-blur-[4px]">
              <p className="text-[12px] font-extrabold uppercase text-[#d54b17]">Myyjan nakyma</p>
              <h2 className="mt-2 text-[24px] font-extrabold leading-tight">Ilmoituksen tila</h2>
              <div className="mt-4 rounded-[8px] bg-[#f3f3f1] px-3 py-3 text-[13px] font-bold">
                {listing.status === "draft" ? "Luonnos, ei julkinen" : listing.status}
              </div>
              {listing.status === "draft" ? (
                <Link
                  href={`/ilmoitukset/${listing.id}/kuvat`}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#d54b17] text-[13px] font-extrabold text-white"
                >
                  Jatka kuviin
                </Link>
              ) : null}
              <Link
                href="/ilmoitukset/uusi"
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#111111] text-[13px] font-extrabold text-white"
              >
                Luo uusi ilmoitus
              </Link>
            </section>

            <section className="rounded-[8px] border border-white/60 bg-[#111111]/92 p-5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.16)] backdrop-blur-[4px]">
              <p className="text-[12px] font-extrabold uppercase text-[#d54b17]">Seuraavaksi</p>
              <h2 className="mt-2 text-[24px] font-extrabold leading-tight">Kuvat ja julkaisu</h2>
              <p className="mt-3 text-[14px] font-semibold leading-6 text-white/70">
                Kun kuvaupload lisataan, tama sivu nayttaa ilmoituksen paakuvan ja kuvagallerian.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
