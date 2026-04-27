"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function toInt(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number.parseInt(String(value ?? fallback), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function toFloat(value: FormDataEntryValue | null) {
  const parsed = Number.parseFloat(String(value ?? ""));
  return Number.isNaN(parsed) ? null : parsed;
}

function normalizeEquipment(formData: FormData) {
  const selectedEquipment = formData
    .getAll("equipment")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const customEquipment = String(formData.get("equipment_custom") ?? "")
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean);

  return Array.from(new Set([...selectedEquipment, ...customEquipment]));
}

export async function createListingDraftAction(formData: FormData) {
  const user = await requireUser("/ilmoitukset/uusi");
  const supabase = await createSupabaseServerClient();

  const equipment = normalizeEquipment(formData);

  const payload = {
    seller_id: user.id,
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price_eur: toInt(formData.get("price_eur")),
    year: toInt(formData.get("year")),
    mileage_km: toInt(formData.get("mileage_km")),
    fuel_type: String(formData.get("fuel_type") ?? "").trim(),
    transmission: String(formData.get("transmission") ?? "").trim(),
    body_type: String(formData.get("body_type") ?? "").trim(),
    drivetrain: String(formData.get("drivetrain") ?? "").trim(),
    power_hp: toInt(formData.get("power_hp")),
    engine_size_l: toFloat(formData.get("engine_size_l")),
    color: String(formData.get("color") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim(),
    condition: String(formData.get("condition") ?? "").trim(),
    registration_number:
      String(formData.get("registration_number") ?? "").trim() || null,
    equipment,
    status: "draft",
  };

  const { data, error } = await supabase
    .from("listings")
    .insert(payload)
    .select("id")
    .single<{ id: string }>();

  if (error) {
    redirect(`/ilmoitukset/uusi?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/ilmoitukset");
  revalidatePath("/oma-profiili");
  redirect(`/ilmoitukset/${data.id}?success=Luonnos%20tallennettu`);
}
