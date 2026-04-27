import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateProfileAction } from "@/app/oma-profiili/actions";

type ProfilePageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

type ProfileRow = {
  full_name: string | null;
  city: string | null;
  phone: string | null;
  role: "private_seller" | "business_seller" | "admin";
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const user = await requireUser("/oma-profiili");
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, city, phone, role")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  return (
    <main className="shell py-10 md:py-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Oma profiili
          </p>
          <h1 className="display mt-2 text-4xl font-bold md:text-5xl">Myyjatilin perusasetukset</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
            Tama on ensimmainen suojattu nakyma. Tahan rakentuvat seuraavaksi myyjan ilmoitukset,
            yritystiedot ja maksulliset nakyvyydet.
          </p>
        </div>
        <Link
          href="/ilmoitukset/uusi"
          className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-center font-semibold text-white"
        >
          Luo ilmoitus
        </Link>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="card rounded-[32px] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Profiilitiedot</h2>
          <p className="mt-3 text-[var(--color-muted)]">
            Tiedot tallennetaan `profiles`-tauluun ja niita voi muokata vain kirjautunut kayttaja itse.
          </p>

          <form action={updateProfileAction} className="mt-8 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold">Sahkoposti</span>
              <input
                value={user.email ?? ""}
                readOnly
                className="rounded-2xl border border-black/10 bg-stone-100 px-4 py-3 text-stone-500 outline-none"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold">Nimi</span>
              <input
                name="full_name"
                defaultValue={data?.full_name ?? ""}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
                placeholder="Nimi tai yrityksen yhteyshenkilo"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Kaupunki</span>
                <input
                  name="city"
                  defaultValue={data?.city ?? ""}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="Helsinki"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Puhelin</span>
                <input
                  name="phone"
                  defaultValue={data?.phone ?? ""}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="+358 40 123 4567"
                />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-semibold">Tilin tyyppi</span>
              <select
                name="role"
                defaultValue={data?.role ?? "private_seller"}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
              >
                <option value="private_seller">Yksityismyyja</option>
                <option value="business_seller">Yritysmyyja</option>
              </select>
            </label>
            <button className="mt-2 rounded-full bg-[var(--color-accent)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--color-accent-strong)]">
              Tallenna profiili
            </button>
          </form>
        </section>

        <section className="card rounded-[32px] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Seuraavat toteutukset</h2>
          <div className="mt-6 grid gap-4 text-sm leading-7 text-[var(--color-muted)]">
            <div className="rounded-3xl border border-black/8 bg-white/80 p-4">
              Yritysmyyjalle lisataan oma `business_profiles`-hallinta, logo, slug ja premium-tila.
            </div>
            <div className="rounded-3xl border border-black/8 bg-white/80 p-4">
              Tahan tulee myyjan oma ilmoituslista, luonnokset, julkaistut ja myydyt autot.
            </div>
            <div className="rounded-3xl border border-black/8 bg-white/80 p-4">
              Maksulliset tuotteet, boostit ja featured-nakyvyydet voidaan kytkea orders- ja
              listing_boosts-tauluihin ilman datamallin uusiksi tekemista.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
