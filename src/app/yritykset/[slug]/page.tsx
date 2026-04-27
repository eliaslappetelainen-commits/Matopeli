type BusinessProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BusinessProfilePage({
  params,
}: BusinessProfilePageProps) {
  const { slug } = await params;

  return (
    <main className="shell py-12">
      <h1 className="display text-4xl font-bold">Yritysprofiili: {slug}</h1>
      <p className="mt-4 max-w-2xl text-[var(--color-muted)]">
        Tahan tulee yrityksen profiili, yhteystiedot, premium-status ja julkaistut autot.
      </p>
    </main>
  );
}
