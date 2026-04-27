export function sanitizeNextPath(value: string | null | undefined) {
  const candidate = value ?? "/oma-profiili";

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/oma-profiili";
  }

  return candidate;
}
