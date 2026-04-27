function readEnv(name: string) {
  return process.env[name];
}

const supabasePublicKey =
  readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ??
  readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
  "";

export const env = {
  nextPublicSiteUrl: readEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
  nextPublicSupabaseUrl: readEnv("NEXT_PUBLIC_SUPABASE_URL") ?? "",
  nextPublicSupabaseKey: supabasePublicKey,
  supabaseServiceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY") ?? "",
};

export function hasSupabaseEnv() {
  return Boolean(env.nextPublicSupabaseUrl && env.nextPublicSupabaseKey);
}
