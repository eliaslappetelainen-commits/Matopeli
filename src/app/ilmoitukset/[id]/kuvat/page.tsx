import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { uploadListingImagesAction } from "@/app/ilmoitukset/[id]/kuvat/actions";

type ListingImagesPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

type ListingRow = {
  id: string;
  seller_id: string;
  title: string;
  status: "draft" | "published" | "sold" | "archived";
};

type ListingImageRow = {
  id: string;
  storage_path: string;
  sort_order: number;
  is_primary: boolean;
};

const topBackgroundImage = "/volkswagen-hero.png";

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
      <path d="M12 16V4m0 0 5 5m-5-5L7 9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M5 16v3h14v-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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

export default async function ListingImagesPage({
  params,
  searchParams,
}: ListingImagesPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const user = await requireUser(`/ilmoitukset/${id}/kuvat`);
  const supabase = await createSupabaseServerClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("id, seller_id, title, status")
    .eq("id", id)
    .eq("seller_id", user.id)
    .maybeSingle<ListingRow>();

  if (!listing) {
    notFound();
  }

  const { data: images } = await supabase
    .from("listing_images")
    .select("id, storage_path, sort_order, is_primary")
    .eq("listing_id", id)
    .order("sort_order")
    .returns<ListingImageRow[]>();

  const imageRows = images ?? [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#111111]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-cover bg-center opacity-45"
        style={{ backgroundImage: `url("${topBackgroundImage}")` }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[430px] bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.58)_52%,#ffffff_100%)]" />

      <section className="relative mx-auto min-h-screen max-w-[1138px] border-b-[5px] border-[#e4d6c1] px-3 pb-10 pt-8 sm:px-4">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <section className="overflow-hidden rounded-[8px] border border-white/60 bg-white/92 shadow-[0_18px_45px_rgba(0,0,0,0.1)] backdrop-blur-[4px]">
            <div className="border-b border-[#e8e8e8] px-5 py-5 md:px-7">
              <p className="text-[12px] font-extrabold uppercase leading-none text-[#d54b17]">
                Vaihe 2
              </p>
              <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-[34px] font-extrabold leading-[1.03] md:text-[44px]">
                    Lisaa kuvat
                  </h1>
                  <p className="mt-3 max-w-[620px] text-[15px] font-semibold leading-6 text-[#666666]">
                    {listing.title}
                  </p>
                </div>
                <span className="inline-flex h-10 self-start rounded-full bg-[#111111] px-4 text-[12px] font-extrabold leading-10 text-white">
                  {imageRows.length} kuvaa
                </span>
              </div>
            </div>

            {query.error ? (
              <div className="mx-5 mt-5 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-bold text-red-800 md:mx-7">
                {query.error}
              </div>
            ) : null}

            {query.success ? (
              <div className="mx-5 mt-5 rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] font-bold text-emerald-800 md:mx-7">
                {query.success}
              </div>
            ) : null}

            <form action={uploadListingImagesAction} className="grid gap-6 px-5 py-6 md:px-7">
              <input type="hidden" name="listing_id" value={listing.id} />

              <label className="grid min-h-[260px] cursor-pointer place-items-center rounded-[8px] border-2 border-dashed border-[#d8d8d8] bg-white/82 px-6 py-8 text-center transition hover:border-[#d54b17] hover:bg-white">
                <input name="images" type="file" accept="image/*" multiple className="sr-only" />
                <span className="grid justify-items-center">
                  <span className="grid h-16 w-16 place-items-center rounded-[8px] bg-[#111111] text-white">
                    <UploadIcon />
                  </span>
                  <span className="mt-5 text-[24px] font-extrabold">Valitse kuvat</span>
                  <span className="mt-2 max-w-[520px] text-[14px] font-semibold leading-6 text-[#666666]">
                    Voit valita useita kuvia kerralla. Ensimmainen ladattu kuva merkitseyy paakuvaksi, jos ilmoituksella ei ole viela kuvia.
                  </span>
                </span>
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[12px] font-semibold leading-5 text-[#777777]">
                  Suositus: lataa ulkokuvat, sisakuva, mittaristo ja huoltokirjan kuva.
                </p>
                <button className="inline-flex h-12 items-center justify-center rounded-full bg-[#111111] px-7 text-[14px] font-extrabold text-white transition hover:bg-[#d54b17]">
                  Lataa kuvat
                </button>
              </div>
            </form>

            {imageRows.length > 0 ? (
              <section className="border-t border-[#e8e8e8] px-5 py-6 md:px-7">
                <h2 className="text-[22px] font-extrabold">Ladatut kuvat</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {imageRows.map((image) => {
                    const publicUrl = supabase.storage
                      .from("listing-images")
                      .getPublicUrl(image.storage_path).data.publicUrl;

                    return (
                      <div
                        key={image.id}
                        className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-[#f3f3f1] bg-cover bg-center"
                        style={{ backgroundImage: `url("${publicUrl}")` }}
                      >
                        {image.is_primary ? (
                          <span className="absolute left-3 top-3 rounded-full bg-[#111111] px-3 py-1 text-[11px] font-extrabold text-white">
                            Paakuva
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </section>

          <aside className="grid content-start gap-4">
            <section className="rounded-[8px] border border-white/60 bg-white/88 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.1)] backdrop-blur-[4px]">
              <p className="text-[12px] font-extrabold uppercase text-[#d54b17]">Seuraava askel</p>
              <h2 className="mt-2 text-[24px] font-extrabold leading-tight">Tarkista ilmoitus</h2>
              <p className="mt-3 text-[14px] font-semibold leading-6 text-[#666666]">
                Kun kuvat ovat mukana, palaa esikatseluun ja julkaisu voidaan lisata seuraavaksi.
              </p>
              <Link
                href={`/ilmoitukset/${listing.id}`}
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#111111] text-[13px] font-extrabold text-white"
              >
                Jatka esikatseluun
              </Link>
            </section>

            <section className="rounded-[8px] border border-white/60 bg-[#111111]/92 p-5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.16)] backdrop-blur-[4px]">
              <p className="text-[12px] font-extrabold uppercase text-[#d54b17]">Muistilista</p>
              <div className="mt-5 grid gap-3 text-[13px] font-bold text-white/85">
                {["Terava paakuva", "Rehelliset kuntokuvat", "Sisatilat ja mittaristo"].map((item) => (
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
