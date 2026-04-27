import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createListingDraftAction } from "@/app/ilmoitukset/uusi/actions";

type NewListingPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

type ProfileRow = {
  full_name: string | null;
  city: string | null;
  role: "private_seller" | "business_seller" | "admin";
};

const topBackgroundImage = "/volkswagen-hero.png";

const inputClass =
  "h-12 rounded-[8px] border border-[#d8d8d8] bg-white px-4 text-[15px] font-semibold text-[#111111] outline-none transition placeholder:text-[#9a9a9a] focus:border-[#d54b17] focus:ring-2 focus:ring-[#d54b17]/15";

const selectClass =
  "h-12 rounded-[8px] border border-[#d8d8d8] bg-white px-4 text-[15px] font-semibold text-[#111111] outline-none transition focus:border-[#d54b17] focus:ring-2 focus:ring-[#d54b17]/15";

const labelClass = "grid gap-2 text-[13px] font-extrabold text-[#242424]";

const fuelOptions = ["Bensiini", "Diesel", "Hybridi", "Sahko", "Kaasu"];
const transmissionOptions = ["Automaatti", "Manuaali"];
const bodyOptions = ["Farmari", "Sedan", "Hatchback", "SUV", "Coupe", "Pakettiauto"];
const drivetrainOptions = ["Etuveto", "Takaveto", "Neliveto"];
const conditionOptions = [
  { label: "Erinomainen", value: "Excellent" },
  { label: "Hyva", value: "Good" },
  { label: "Tyydyttava", value: "Fair" },
];
const equipmentOptions = [
  "Ilmastointi",
  "Automaatti-ilmastointi",
  "Vakionopeudensaadin",
  "Mukautuva vakionopeudensaadin",
  "Navigointi",
  "Peruutuskamera",
  "360 kamera",
  "Pysakointitutkat",
  "Lohkolammitin",
  "Webasto",
  "Vetokoukku",
  "Kattoluukku",
  "Panoraamakatto",
  "Nahkasisusta",
  "Sport-istuimet",
  "Sahkosaatoiset istuimet",
  "Istuinlammitys",
  "Ratinlammitys",
  "Apple CarPlay",
  "Android Auto",
  "Bluetooth",
  "Premium audio",
  "LED-ajovalot",
  "Matrix LED",
  "Xenon-ajovalot",
  "Kaistavahti",
  "Kuolleen kulman varoitin",
  "Liikennemerkkien tunnistus",
  "Avaimeton kaynnistys",
  "Avaimeton kulku",
  "Sahkoinen takaluukku",
  "Neliveto",
  "Ilmajousitus",
  "Adaptiivinen alusta",
  "Kahdet renkaat",
  "Aluvanteet",
];

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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
    </svg>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] font-semibold leading-5 text-[#777777]">{children}</p>;
}

export default async function NewListingPage({
  searchParams,
}: NewListingPageProps) {
  const user = await requireUser("/ilmoitukset/uusi");
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, city, role")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#111111]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-cover bg-center opacity-55"
        style={{ backgroundImage: `url("${topBackgroundImage}")` }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[430px] bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.52)_52%,#ffffff_100%)]" />

      <section className="relative mx-auto min-h-screen max-w-[1138px] border-b-[5px] border-[#e4d6c1] px-3 pb-10 pt-8 sm:px-4">
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <section className="overflow-hidden rounded-[8px] border border-white/60 bg-white/92 shadow-[0_18px_45px_rgba(0,0,0,0.1)] backdrop-blur-[4px]">
            <div className="border-b border-[#e8e8e8] px-5 py-5 md:px-7">
              <p className="text-[12px] font-extrabold uppercase leading-none text-[#d54b17]">
                Uusi ilmoitus
              </p>
              <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-[34px] font-extrabold leading-[1.03] md:text-[44px]">
                    Luo autoilmoitus
                  </h1>
                  <p className="mt-3 max-w-[620px] text-[15px] font-semibold leading-6 text-[#666666]">
                    Tallenna ilmoitus ensin luonnoksena. Kuvien lataus ja julkaisu jatketaan seuraavassa vaiheessa.
                  </p>
                </div>
                <span className="inline-flex h-10 self-start rounded-full bg-[#111111] px-4 text-[12px] font-extrabold leading-10 text-white">
                  Draft
                </span>
              </div>
            </div>

            {params.error ? (
              <div className="mx-5 mt-5 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-bold text-red-800 md:mx-7">
                {params.error}
              </div>
            ) : null}

            {params.success ? (
              <div className="mx-5 mt-5 rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] font-bold text-emerald-800 md:mx-7">
                {params.success}
              </div>
            ) : null}

            <form action={createListingDraftAction} className="grid gap-8 px-5 py-6 md:px-7">
              <section>
                <div className="mb-4 flex items-center justify-between border-b border-[#e8e8e8] pb-3">
                  <h2 className="text-[20px] font-extrabold">Perustiedot</h2>
                  <span className="text-[12px] font-extrabold uppercase text-[#777777]">1 / 4</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>
                    Otsikko
                    <input
                      name="title"
                      required
                      className={inputClass}
                      placeholder="BMW 320d xDrive Touring M Sport"
                    />
                  </label>

                  <label className={labelClass}>
                    Hinta
                    <input
                      name="price_eur"
                      type="number"
                      min={0}
                      required
                      className={inputClass}
                      placeholder="22900"
                    />
                  </label>

                  <label className={`${labelClass} md:col-span-2`}>
                    Kuvaus
                    <textarea
                      name="description"
                      required
                      rows={6}
                      className="rounded-[8px] border border-[#d8d8d8] bg-white px-4 py-3 text-[15px] font-semibold leading-6 text-[#111111] outline-none transition placeholder:text-[#9a9a9a] focus:border-[#d54b17] focus:ring-2 focus:ring-[#d54b17]/15"
                      placeholder="Kerro auton kunnosta, huolloista, varusteista ja historiasta."
                    />
                  </label>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between border-b border-[#e8e8e8] pb-3">
                  <h2 className="text-[20px] font-extrabold">Auton tiedot</h2>
                  <span className="text-[12px] font-extrabold uppercase text-[#777777]">2 / 4</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <label className={labelClass}>
                    Vuosimalli
                    <input name="year" type="number" min={1900} max={2100} required className={inputClass} placeholder="2020" />
                  </label>

                  <label className={labelClass}>
                    Mittarilukema
                    <input name="mileage_km" type="number" min={0} required className={inputClass} placeholder="128000" />
                  </label>

                  <label className={labelClass}>
                    Teho
                    <input name="power_hp" type="number" min={0} required className={inputClass} placeholder="190" />
                  </label>

                  <label className={labelClass}>
                    Kayttovoima
                    <select name="fuel_type" required className={selectClass} defaultValue="Diesel">
                      {fuelOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClass}>
                    Vaihteisto
                    <select name="transmission" required className={selectClass} defaultValue="Automaatti">
                      {transmissionOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClass}>
                    Korimalli
                    <select name="body_type" required className={selectClass} defaultValue="Farmari">
                      {bodyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClass}>
                    Vetotapa
                    <select name="drivetrain" required className={selectClass} defaultValue="Neliveto">
                      {drivetrainOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClass}>
                    Moottorin koko
                    <input name="engine_size_l" type="number" step="0.1" min={0} className={inputClass} placeholder="2.0" />
                  </label>

                  <label className={labelClass}>
                    Vari
                    <input name="color" className={inputClass} placeholder="Musta" />
                  </label>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between border-b border-[#e8e8e8] pb-3">
                  <h2 className="text-[20px] font-extrabold">Varusteet</h2>
                  <span className="text-[12px] font-extrabold uppercase text-[#777777]">3 / 4</span>
                </div>

                <FieldHint>
                  Valitse kaikki ilmoituksessa nakyvat varusteet. Voit lisata harvinaisemmat varusteet itse listan lopussa.
                </FieldHint>

                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {equipmentOptions.map((equipment) => (
                    <label key={equipment} className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="equipment"
                        value={equipment}
                        className="peer sr-only"
                      />
                      <span className="flex min-h-11 items-center rounded-[8px] border border-[#d8d8d8] bg-white px-3 text-[13px] font-extrabold text-[#242424] transition peer-checked:border-[#111111] peer-checked:bg-[#111111] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#d54b17]/30">
                        {equipment}
                      </span>
                    </label>
                  ))}
                </div>

                <label className={`${labelClass} mt-4`}>
                  Muu varuste
                  <textarea
                    name="equipment_custom"
                    rows={3}
                    className="rounded-[8px] border border-[#d8d8d8] bg-white px-4 py-3 text-[15px] font-semibold leading-6 text-[#111111] outline-none transition placeholder:text-[#9a9a9a] focus:border-[#d54b17] focus:ring-2 focus:ring-[#d54b17]/15"
                    placeholder="Esim. Bowers & Wilkins audio, tehdastakuu, vetokoukun sahkolukitus"
                  />
                  <FieldHint>
                    Erottele useampi oma varuste pilkulla tai rivinvaihdolla.
                  </FieldHint>
                </label>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between border-b border-[#e8e8e8] pb-3">
                  <h2 className="text-[20px] font-extrabold">Sijainti ja kunto</h2>
                  <span className="text-[12px] font-extrabold uppercase text-[#777777]">4 / 4</span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className={labelClass}>
                    Sijainti
                    <input
                      name="city"
                      defaultValue={profile?.city ?? ""}
                      required
                      className={inputClass}
                      placeholder="Helsinki"
                    />
                  </label>

                  <label className={labelClass}>
                    Kunto
                    <select name="condition" required className={selectClass} defaultValue="Good">
                      {conditionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClass}>
                    Rekisterinumero
                    <input name="registration_number" className={inputClass} placeholder="ABC-123" />
                  </label>
                </div>
              </section>

              <div className="flex flex-col gap-3 border-t border-[#e8e8e8] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <FieldHint>
                  Luonnos nakyy vain sinulle. Julkaisu ja kuvien lataus lisataan seuraavaksi.
                </FieldHint>
                <button className="inline-flex h-12 items-center justify-center rounded-full bg-[#111111] px-7 text-[14px] font-extrabold text-white transition hover:bg-[#d54b17]">
                  Tallenna luonnos
                </button>
              </div>
            </form>
          </section>

          <aside className="grid content-start gap-4">
            <section className="rounded-[8px] border border-white/60 bg-white/88 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.1)] backdrop-blur-[4px]">
              <p className="text-[12px] font-extrabold uppercase text-[#d54b17]">Myyjatili</p>
              <h2 className="mt-2 text-[24px] font-extrabold leading-tight">
                {profile?.full_name ?? user.email}
              </h2>
              <div className="mt-4 grid gap-2 text-[13px] font-bold text-[#666666]">
                <div className="flex items-center justify-between rounded-[8px] bg-[#f3f3f1] px-3 py-3">
                  <span>Rooli</span>
                  <span className="text-[#111111]">
                    {profile?.role === "business_seller" ? "Yritysmyyja" : "Yksityismyyja"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-[8px] bg-[#f3f3f1] px-3 py-3">
                  <span>Sijainti</span>
                  <span className="text-[#111111]">{profile?.city ?? "Ei asetettu"}</span>
                </div>
              </div>
              <Link
                href="/oma-profiili"
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full border border-[#111111] text-[13px] font-extrabold"
              >
                Muokkaa profiilia
              </Link>
            </section>

            <section className="rounded-[8px] border border-white/60 bg-[#111111]/92 p-5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.16)] backdrop-blur-[4px]">
              <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-white/12 text-[#d54b17]">
                <CameraIcon />
              </div>
              <h2 className="mt-4 text-[24px] font-extrabold leading-tight">Kuvat seuraavaksi</h2>
              <p className="mt-3 text-[14px] font-semibold leading-6 text-white/70">
                Seuraava toteutus tuo Supabase Storage -uploadin, esikatselut ja paakuvan valinnan.
              </p>
              <div className="mt-5 grid gap-2 text-[13px] font-bold text-white/85">
                {["Usean kuvan upload", "Paakuvan valinta", "Jarjestyksen hallinta"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckIcon />
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
