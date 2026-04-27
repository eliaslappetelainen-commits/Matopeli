import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sanitizeNextPath } from "@/lib/next-path";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const cookieStore = await cookies();
  const nextFromCookie = cookieStore.get("matopeli-auth-next")?.value;
  const next = sanitizeNextPath(
    requestUrl.searchParams.get("next") ?? nextFromCookie,
  );

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(new URL(next, requestUrl.origin));
      response.cookies.set("matopeli-auth-next", "", {
        path: "/",
        expires: new Date(0),
      });
      return response;
    }

    return NextResponse.redirect(
      new URL(
        `/auth/kirjaudu?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(
          next,
        )}`,
        requestUrl.origin,
      ),
    );
  }

  return NextResponse.redirect(
    new URL(
      `/auth/kirjaudu?error=${encodeURIComponent(
        "Google-kirjautuminen ei onnistunut. Yrita uudelleen.",
      )}&next=${encodeURIComponent(next)}`,
      requestUrl.origin,
    ),
  );
}
