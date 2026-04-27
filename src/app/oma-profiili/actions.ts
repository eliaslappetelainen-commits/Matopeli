"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser("/oma-profiili");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const role = String(formData.get("role") ?? "private_seller");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      city,
      phone,
      role,
      is_dealer: role === "business_seller",
    })
    .eq("id", user.id);

  if (error) {
    redirect(`/oma-profiili?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/oma-profiili");
  redirect("/oma-profiili?success=Profiili%20paivitetty");
}
