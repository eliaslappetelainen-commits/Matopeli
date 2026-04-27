import type { ListingCardData } from "@/types/listing";

type ListingCardProps = {
  listing: ListingCardData;
};

export function ListingCard({ listing }: ListingCardProps) {
  const imageBackground =
    listing.favoriteTier === "featured"
      ? "bg-[linear-gradient(135deg,#c5b59f,#8f7764_56%,#5f4a39)]"
      : "bg-[linear-gradient(135deg,#d8dfe4,#a7b4bf_56%,#7e8d97)]";

  return (
    <article className="rounded-[24px] border border-black/8 bg-white p-3 shadow-[0_18px_40px_rgba(24,18,12,0.08)]">
      <div className={`mb-4 aspect-[4/3] rounded-[20px] ${imageBackground} relative overflow-hidden`}>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-[linear-gradient(180deg,transparent,rgba(7,9,11,0.82))] p-4">
          <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
            {listing.imageHint ?? "featured"}
          </span>
          {listing.favoriteTier === "watchlist" ? (
            <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/90">
              Suosikeissa
            </span>
          ) : null}
        </div>
      </div>
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            {listing.city}
          </p>
          <h3 className="text-base font-bold text-stone-900">{listing.title}</h3>
        </div>
        {listing.featured ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
            Featured
          </span>
        ) : null}
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-stone-500">
        <span>{listing.year}</span>
        <span>{listing.mileageKm.toLocaleString("fi-FI")} km</span>
        <span>{listing.fuelType}</span>
        <span>{listing.transmission}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-lg font-extrabold text-stone-950">{listing.priceEur.toLocaleString("fi-FI")} EUR</p>
        <button className="rounded-full border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700">
          Tallenna
        </button>
      </div>
    </article>
  );
}
