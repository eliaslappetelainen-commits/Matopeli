"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const bucketName = "listing-images";

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function uploadListingImagesAction(formData: FormData) {
  const listingId = String(formData.get("listing_id") ?? "");
  const user = await requireUser(`/ilmoitukset/${listingId}/kuvat`);
  const supabase = await createSupabaseServerClient();

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("id, seller_id")
    .eq("id", listingId)
    .eq("seller_id", user.id)
    .maybeSingle<{ id: string; seller_id: string }>();

  if (listingError || !listing) {
    redirect(`/ilmoitukset/${listingId}/kuvat?error=${encodeURIComponent("Ilmoitusta ei loytynyt tai sinulla ei ole oikeutta muokata sita.")}`);
  }

  const files = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length === 0) {
    redirect(`/ilmoitukset/${listingId}/kuvat?error=${encodeURIComponent("Valitse vahintaan yksi kuva.")}`);
  }

  const { count } = await supabase
    .from("listing_images")
    .select("id", { count: "exact", head: true })
    .eq("listing_id", listingId);

  const currentCount = count ?? 0;

  for (const [index, file] of files.entries()) {
    if (!file.type.startsWith("image/")) {
      redirect(`/ilmoitukset/${listingId}/kuvat?error=${encodeURIComponent("Kaikkien tiedostojen tulee olla kuvia.")}`);
    }

    const fileName = sanitizeFileName(file.name || `image-${index + 1}.jpg`);
    const storagePath = `${user.id}/${listingId}/${Date.now()}-${index}-${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      redirect(`/ilmoitukset/${listingId}/kuvat?error=${encodeURIComponent(uploadError.message)}`);
    }

    const { error: imageError } = await supabase.from("listing_images").insert({
      listing_id: listingId,
      storage_path: storagePath,
      sort_order: currentCount + index,
      is_primary: currentCount === 0 && index === 0,
    });

    if (imageError) {
      redirect(`/ilmoitukset/${listingId}/kuvat?error=${encodeURIComponent(imageError.message)}`);
    }
  }

  revalidatePath(`/ilmoitukset/${listingId}`);
  revalidatePath(`/ilmoitukset/${listingId}/kuvat`);
  redirect(`/ilmoitukset/${listingId}/kuvat?success=${encodeURIComponent("Kuvat ladattu onnistuneesti.")}`);
}
