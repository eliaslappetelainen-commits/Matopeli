export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 py-10 text-sm text-[var(--color-muted)]">
      <div className="shell flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p>Matopeli on moderni perusta auton myyntipaikalle.</p>
        <p>Next.js, TypeScript, Supabase ja mobile-first UX.</p>
      </div>
    </footer>
  );
}
