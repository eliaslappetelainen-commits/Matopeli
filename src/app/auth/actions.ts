"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/routing";

function toQueryString(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function sanitizeNextPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/oma-profiili";
  }

  return value;
}

function mapAuthErrorMessage(message: string) {
  if (message.includes("Invalid login credentials")) {
    return "Sahkoposti tai salasana oli vaarin.";
  }

  if (message.includes("Email not confirmed")) {
    return "Sahkopostiosoitetta ei ole viela vahvistettu.";
  }

  if (message.includes("Password should be at least")) {
    return "Salasanan tulee olla vahintaan 6 merkkia.";
  }

  if (message.includes("Unable to validate email address")) {
    return "Sahkopostiosoitetta ei voitu vahvistaa. Kokeile oikeaa postilaatikkoa.";
  }

  if (message.includes("is invalid")) {
    return "Sahkopostiosoite ei kelpaa. Kayta oikeaa ja vastaanottavaa osoitetta.";
  }

  if (message.includes("email rate limit exceeded")) {
    return "Vahvistusviesteja on lahetetty liikaa liian nopeasti. Odota hetki ja yrita uudelleen.";
  }

  return message;
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = sanitizeNextPath(
    String(formData.get("next") ?? "/oma-profiili"),
  );

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      `/auth/kirjaudu${toQueryString({
        mode: "sign-in",
        error: mapAuthErrorMessage(error.message),
        next,
      })}`,
    );
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "private_seller");
  const next = sanitizeNextPath(
    String(formData.get("next") ?? "/oma-profiili"),
  );

  const baseUrl = await getBaseUrl();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${baseUrl}/auth/confirm?next=${encodeURIComponent(next)}`,
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (error) {
    redirect(
      `/auth/kirjaudu${toQueryString({
        mode: "sign-up",
        error: mapAuthErrorMessage(error.message),
        next,
      })}`,
    );
  }

  redirect(
    `/auth/kirjaudu${toQueryString({
      mode: "sign-up",
      success: "Tarkista sahkopostisi vahvistaaksesi tunnuksen.",
      next,
    })}`,
  );
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
