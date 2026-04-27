# Matopeli

Moderni auton myyntialusta yksityisille ja yritysmyyjille.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Storage
- PostgreSQL

## MVP:n ydin

- Rekisteröityminen ja kirjautuminen
- Yksityis- ja yritysprofiilit
- Autoilmoitusten luonti, julkaisu, muokkaus ja myydyksi merkintä
- Monikuvaupload
- Haku ja suodattimet
- Suosikit
- Featured- ja boost-näkyvyydet
- Admin-perusta moderointiin

## Käynnistys

1. Kopioi `.env.example` tiedostoksi `.env.local`
2. Täytä Supabase-avaimet
3. Aja kehityspalvelin:

```bash
npm.cmd run dev
```

## Tietokanta

Ensimmäinen skeema ja RLS-perusta löytyvät tiedostosta:

- `supabase/migrations/20260427000000_init.sql`

## Seuraava toteutusvaihe

- Kytke projekti Supabase-projektiin
- Aja migraatio
- Rakenna auth-flow ja ilmoituksen luontilomake
