export type ListingCardData = {
  id: string;
  title: string;
  priceEur: number;
  year: number;
  mileageKm: number;
  fuelType: "Bensiini" | "Diesel" | "Hybridi" | "Sahko";
  transmission: "Manuaali" | "Automaatti";
  city: string;
  featured?: boolean;
  favoriteTier?: "featured" | "watchlist";
  imageHint?: string;
};
