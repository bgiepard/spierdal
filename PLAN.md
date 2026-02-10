# spierdal.ai — Plan projektu (Next.js)

## Opis projektu

Aplikacja Next.js na Vercel z trzema głównymi funkcjami:

1. **Czat AI** — użytkownik wpisuje wiadomość, wybiera ton odpowiedzi, AI generuje odpowiedź strumieniowo
2. **Udostępnianie odpowiedzi** — odpowiedź AI można skopiować jako link (`spierdal.ai/#zakodowana-treść`), treść zakodowana w URL, zero bazy danych
3. **System banerów reklamowych** — reklamodawca wykupuje slot na baner, wgrywa grafikę, płaci przez Stripe

## Architektura

```
Next.js App Router (Vercel)
├── Strona główna (/)
│   ├── Landing page (obecny design)
│   ├── Sloty banerów (Server Component → KV)
│   └── Czat AI (Client Component → /api/chat)
│
├── Strona zakupu banera (/advertise)
│   ├── Formularz (wybór slotu, okres, upload, link)
│   └── Redirect → Stripe Checkout
│
├── API Routes (/api/...)
│   ├── /api/chat          → Groq LLM (streaming)
│   ├── /api/banners/*     → CRUD banerów
│   └── /api/webhooks/stripe → aktywacja po płatności
│
├── Vercel KV (Redis)      → dane banerów
├── Vercel Blob            → grafiki banerów
└── Stripe                 → płatności
```

## Stack technologiczny

| Warstwa | Technologia | Uzasadnienie |
|---------|-------------|--------------|
| Framework | **Next.js 15 (App Router)** | SSR, API routes, routing, Image optim. |
| Styling | **Tailwind CSS** | Szybki development, dark theme, responsywność |
| LLM | **Groq (llama-3.1-8b)** | Darmowy tier, ultra szybki |
| Streaming | **Vercel AI SDK** | Wbudowana obsługa streamingu z Groq |
| Baza danych | **Vercel KV (Redis)** | Dane banerów, zero konfiguracji |
| Storage | **Vercel Blob** | Grafiki banerów |
| Płatności | **Stripe Checkout** | BLIK, karty, przelewy |
| Deploy | **Vercel** | Natywna integracja z Next.js |

### Wybór modelu LLM (tani i szybki)

| Opcja | Koszt | Szybkość | Uwagi |
|-------|-------|----------|-------|
| **Groq (llama-3.1-8b)** | Darmowy tier / bardzo tani | Ultra szybki (~500 tok/s) | Rekomendowany |
| OpenAI gpt-4o-mini | ~$0.15/1M input tok | Szybki | Popularny, dobra jakość |
| Google Gemini Flash | Darmowy tier | Szybki | Darmowy do limitu |
| Anthropic Haiku | ~$0.25/1M input tok | Szybki | Dobra jakość |

## Udostępnianie odpowiedzi (share link)

### Koncept

Odpowiedź AI można udostępnić jako link bez potrzeby bazy danych — treść jest zakodowana bezpośrednio w URL:

```
spierdal.ai/#BYKwdgxg1glge0QJwIYBsCm...
```

### Jak to działa

1. AI generuje odpowiedź
2. Użytkownik klika ikonę "Kopiuj link"
3. Frontend kompresuje treść (`lz-string`) → koduje do base64url
4. Generuje URL: `spierdal.ai/#<zakodowana-treść>`
5. Link trafia do schowka
6. Odbiorca otwiera link → frontend dekoduje hash → wyświetla odpowiedź w ładnej karcie

### Enkodowanie: LZ-string + base64url

| Metoda | Rozmiar ~200 znaków PL tekstu | URL-safe |
|--------|-------------------------------|----------|
| Surowy base64 | ~400 znaków | Nie |
| **lz-string `compressToEncodedURIComponent`** | **~150-200 znaków** | **Tak** |
| base122 | ~180 znaków | Problemy z UTF-8 w URL |

**Rekomendacja:** `lz-string` — lekka biblioteka (5KB), ma wbudowaną metodę `compressToEncodedURIComponent`
która kompresuje tekst i od razu daje URL-safe output. Idealne do hashy.

### Limity

- Maksymalna długość URL: ~2000 znaków (bezpieczne dla wszystkich przeglądarek)
- Po kompresji mieści się ~800-1000 znaków oryginalnego tekstu — wystarczy na odpowiedź AI
- Dłuższe odpowiedzi: obcinamy do limitu z info "(...)"

### Widok share (`spierdal.ai/#...`)

Gdy strona wykryje hash w URL:
- Zamiast (lub obok) landing page wyświetla kartę z odpowiedzią
- Karta: dark design, treść odpowiedzi, ton w jakim była napisana, przycisk "Wyślij swoją wiadomość"
- Meta tagi OG/Twitter nie mogą czytać hasha — ale to OK, wystarczy generyczny opis

## Tony odpowiedzi czatu

| Ton | Emoji | System prompt (skrót) |
|-----|-------|----------------------|
| Miły | 😊 | "Odpowiadaj miło, ciepło, z empatią" |
| Profesjonalny | 💼 | "Odpowiadaj profesjonalnie, formalnie" |
| Sarkazm | 😏 | "Odpowiadaj sarkastycznie, ironicznie" |
| Agresywny | 🔥 | "Odpowiadaj wulgarnie, agresywnie, po polsku" |
| Poeta | 🎭 | "Odpowiadaj w formie wiersza/rymu" |
| Ziomek | 🤙 | "Odpowiadaj jak ziomek z osiedla, slangiem" |

## Sloty banerów — cennik (propozycja)

| Slot | Rozmiar | Pozycja | Cena/tydzień | Cena/miesiąc |
|------|---------|---------|--------------|--------------|
| Leaderboard | 728x90 | Góra strony | 50 zł | 150 zł |
| Boczny L | 160x600 | Lewy bok (desktop) | 30 zł | 100 zł |
| Boczny R | 160x600 | Prawy bok (desktop) | 30 zł | 100 zł |
| Rectangle | 300x250 | Pod contentem | 40 zł | 120 zł |

Okresy do wyboru: 1 tydzień, 2 tygodnie, 1 miesiąc, 3 miesiące.

## Model danych banera (Vercel KV)

```json
{
  "id": "ban_abc123",
  "slot": "leaderboard",
  "imageUrl": "https://blob.vercel-storage.com/...",
  "targetUrl": "https://reklamodawca.pl",
  "email": "klient@email.pl",
  "status": "active | pending | expired",
  "stripeSessionId": "cs_live_...",
  "startDate": "2026-02-15T00:00:00Z",
  "endDate": "2026-03-15T00:00:00Z",
  "createdAt": "2026-02-10T12:00:00Z"
}
```

---

## Zadania

### Faza 0: Inicjalizacja projektu Next.js

- [ ] **0.1** Zainicjalizować projekt Next.js 15 (App Router, TypeScript)
- [ ] **0.2** Zainstalować zależności:
  - `tailwindcss` — styling
  - `ai` + `@ai-sdk/groq` — Vercel AI SDK + Groq provider
  - `stripe` — Stripe SDK server-side
  - `@vercel/kv` — Vercel KV (Redis)
  - `@vercel/blob` — Vercel Blob (storage plików)
  - `lz-string` — kompresja treści do URL (share links)
- [ ] **0.3** Skonfigurować Tailwind z dark theme (odwzorować obecny design)
- [ ] **0.4** Przenieść obecny landing page do Next.js (`app/page.tsx`)
  - Zachować obecny design: gradient orby, grid overlay, noise, fonty
  - Dodać layout (`app/layout.tsx`) z metadanymi SEO
- [ ] **0.5** Skonfigurować zmienne środowiskowe (`.env.local`):
  - `GROQ_API_KEY`
  - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
  - `KV_REST_API_URL`, `KV_REST_API_TOKEN`
  - `BLOB_READ_WRITE_TOKEN`

### Faza 1: Czat AI — Backend

- [ ] **1.1** Stworzyć API route `app/api/chat/route.ts`
  - Przyjmuje POST z `{ messages, tone }`
  - Buduje system prompt na podstawie wybranego tonu
  - Używa Vercel AI SDK + Groq do streamingu odpowiedzi
  - Rate limiting (np. max 20 req/min per IP via headers)
- [ ] **1.2** Dodać walidację inputu (max 500 znaków, sanityzacja)
- [ ] **1.3** Zdefiniować system prompty per ton w `lib/prompts.ts`

### Faza 2: Czat AI — Frontend

- [ ] **2.1** Stworzyć komponent `ChatWidget` (Client Component)
  - Przycisk w rogu do otwarcia/zamknięcia (floating button)
  - Panel czatu (drawer/popup) — dark design, monospace
  - Lista wiadomości (user / AI)
  - Input + przycisk wyślij
- [ ] **2.2** Selektor tonu odpowiedzi (pills/chips nad inputem)
- [ ] **2.3** Użyć `useChat` z Vercel AI SDK do obsługi streamingu
- [ ] **2.4** Animacje:
  - Typing indicator podczas generowania
  - Fade-in nowych wiadomości
  - Streaming token po tokenie (wbudowane w AI SDK)
- [ ] **2.5** Responsywność — mobile-first
- [ ] **2.6** Ograniczyć kontekst do ostatnich 5 wiadomości
- [ ] **2.7** Przycisk "Kopiuj link" przy każdej odpowiedzi AI
  - Kompresuje treść + ton przez `lz-string` (`compressToEncodedURIComponent`)
  - Generuje `spierdal.ai/#<skompresowane>`
  - Kopiuje do schowka (`navigator.clipboard`)
  - Feedback: "Skopiowano!" (toast/tooltip)
- [ ] **2.8** Stworzyć komponent `SharedMessage` — widok udostępnionej odpowiedzi
  - Wykrywanie hasha w URL przy starcie (`window.location.hash`)
  - Dekompresja treści z hasha (`decompressFromEncodedURIComponent`)
  - Wyświetlenie karty: treść odpowiedzi, ton, dark design
  - Przycisk "Wyślij swoją wiadomość" → otwiera czat
  - Fallback gdy hash jest uszkodzony/za długi

### Faza 3: System banerów — Backend

- [ ] **3.1** Stworzyć `lib/banners.ts` — helper do operacji na KV
  - `getActiveBanners()` — pobierz aktywne banery per slot
  - `createBanner(data)` — stwórz rekord ze statusem `pending`
  - `activateBanner(id)` — zmień status na `active`
  - `expireOldBanners()` — wygaś banery po `endDate`
- [ ] **3.2** Stworzyć API route `app/api/banners/upload/route.ts`
  - Przyjmuje FormData z plikiem (JPG/PNG/WebP/GIF, max 2MB)
  - Waliduje wymiary per slot
  - Zapisuje do Vercel Blob, zwraca URL
- [ ] **3.3** Stworzyć API route `app/api/banners/create/route.ts`
  - Przyjmuje: slot, okres, imageUrl, targetUrl, email
  - Tworzy rekord w KV
  - Tworzy Stripe Checkout Session z odpowiednią ceną
  - Zwraca URL do Stripe Checkout
- [ ] **3.4** Stworzyć API route `app/api/webhooks/stripe/route.ts`
  - Weryfikuje Stripe signature
  - Na `checkout.session.completed` → aktywuje baner
- [ ] **3.5** Stworzyć API route `app/api/banners/active/route.ts`
  - GET — zwraca aktywne banery pogrupowane per slot
  - Cache: `revalidate: 60` (odświeżanie co minutę)
- [ ] **3.6** Stworzyć Vercel Cron Job `app/api/cron/expire-banners/route.ts`
  - Uruchamiany raz dziennie
  - Wygasza banery po `endDate`

### Faza 4: System banerów — Frontend

- [ ] **4.1** Stworzyć komponent `BannerSlot` (Server Component)
  - Pobiera aktywne banery z KV server-side
  - Renderuje `next/image` z linkiem (target="_blank", rel="noopener nofollow")
  - Gdy slot pusty: placeholder "Twoja reklama tutaj" + link do `/advertise`
- [ ] **4.2** Dodać sloty banerów do strony głównej (`app/page.tsx`)
  - Leaderboard (728x90) — góra
  - Boczny L/R (160x600) — desktop only
  - Rectangle (300x250) — pod contentem
  - Responsywność: boczne chowane na mobile
- [ ] **4.3** Stworzyć stronę `/advertise` (`app/advertise/page.tsx`)
  - Formularz: wybór slotu, wybór okresu, upload grafiki, link docelowy, email
  - Podgląd banera w wybranym slocie (live preview)
  - Walidacja formularza client-side
  - Przycisk "Opłać" → fetch `/api/banners/create` → redirect do Stripe
- [ ] **4.4** Stworzyć stronę sukcesu (`app/advertise/success/page.tsx`)
  - Potwierdzenie zakupu
  - Info kiedy baner będzie widoczny
- [ ] **4.5** Stworzyć konfigurację cennika w `lib/pricing.ts`
  - Ceny per slot per okres
  - Stripe Price ID mapping

### Faza 5: Polish & Deploy

- [ ] **5.1** Obsługa błędów czatu (brak odpowiedzi, timeout, limit)
- [ ] **5.2** Obsługa błędów płatności (nieudana transakcja, anulowanie)
- [ ] **5.3** Dodać `vercel.json` z konfiguracją crona
- [ ] **5.4** Skonfigurować Stripe webhook URL w dashboardzie Stripe
- [ ] **5.5** Deploy na Vercel + podpiąć domenę spierdal.ai
- [ ] **5.6** Test produkcyjny: czat + banery + Stripe (tryb testowy → live)

---

## Struktura plików (docelowa)

```
spierdal/
├── app/
│   ├── layout.tsx                         ← główny layout + fonty + SEO
│   ├── page.tsx                           ← landing page + sloty banerów + czat
│   ├── globals.css                        ← Tailwind + custom styles
│   ├── advertise/
│   │   ├── page.tsx                       ← formularz zakupu banera
│   │   └── success/
│   │       └── page.tsx                   ← potwierdzenie po płatności
│   └── api/
│       ├── chat/
│       │   └── route.ts                   ← czat AI (Groq streaming)
│       ├── banners/
│       │   ├── upload/route.ts            ← upload grafiki
│       │   ├── create/route.ts            ← tworzenie zamówienia + Stripe
│       │   └── active/route.ts            ← lista aktywnych banerów
│       ├── webhooks/
│       │   └── stripe/route.ts            ← Stripe webhook
│       └── cron/
│           └── expire-banners/route.ts    ← cron: wygaszanie banerów
├── components/
│   ├── ChatWidget.tsx                     ← panel czatu AI
│   ├── ToneSelector.tsx                   ← wybór tonu odpowiedzi
│   ├── SharedMessage.tsx                  ← widok udostępnionej odpowiedzi
│   ├── BannerSlot.tsx                     ← slot banera (server component)
│   ├── AdvertiseForm.tsx                  ← formularz zakupu banera
│   └── BackgroundEffects.tsx              ← gradient orby, grid, noise
├── lib/
│   ├── prompts.ts                         ← system prompty per ton
│   ├── share.ts                           ← encode/decode share links (lz-string)
│   ├── banners.ts                         ← helper KV (CRUD banerów)
│   ├── pricing.ts                         ← cennik slotów + Stripe Price IDs
│   └── stripe.ts                          ← Stripe client + helpers
├── public/
│   └── fonts/                             ← (opcjonalnie lokalne fonty)
├── .env.local                             ← klucze API (nie commitować!)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── vercel.json                            ← cron config
```

## Przykładowy flow — czat

1. Użytkownik wchodzi na spierdal.ai
2. Widzi landing page + przycisk czatu w rogu
3. Klika → otwiera się panel czatu
4. Wybiera ton: np. "Agresywny 🔥"
5. Pisze: "Co myślisz o poniedziałkach?"
6. AI odpowiada strumieniowo w wybranym tonie
7. Może zmienić ton i pisać dalej

## Przykładowy flow — udostępnianie odpowiedzi

1. AI generuje odpowiedź w tonie "Ziomek"
2. Przy odpowiedzi pojawia się ikonka linku / "Udostępnij"
3. Użytkownik klika → link w schowku: `spierdal.ai/#BYKwdgxg1glge...`
4. Wysyła link znajomemu
5. Znajomy otwiera link → widzi kartę z odpowiedzią AI i tonem
6. Może kliknąć "Wyślij swoją wiadomość" → otwiera czat

## Przykładowy flow — zakup banera

1. Reklamodawca widzi na stronie puste sloty z napisem "Twoja reklama tutaj"
2. Klika → przenosi się na `/advertise`
3. Wybiera slot (np. Leaderboard 728x90)
4. Wybiera okres (np. 1 miesiąc — 150 zł)
5. Wgrywa grafikę banera (walidacja rozmiaru)
6. Wpisuje link docelowy + swój email
7. Widzi podgląd banera na stronie
8. Klika "Opłać" → redirect do Stripe Checkout
9. Płaci kartą/BLIK
10. Stripe webhook aktywuje baner → natychmiast widoczny na stronie
11. Po upływie okresu baner automatycznie wygasa

## Szacowany koszt infrastruktury

- **Groq darmowy tier:** 14,400 req/dzień, 30 req/min — wystarczy na start
- **Vercel KV:** darmowy tier — 3,000 req/dzień, 256MB
- **Vercel Blob:** darmowy tier — 500MB storage
- **Stripe:** 1.4% + 0.25 EUR za transakcję (Europa)
- **Vercel Hosting:** darmowy tier (hobby) — wystarczy na start

## Uwagi

- TypeScript w całym projekcie — type safety
- Server Components do ładowania banerów — szybko, SEO-friendly
- Client Components tylko tam gdzie potrzeba interakcji (czat, formularz)
- Vercel AI SDK (`useChat`) eliminuje ręczne zarządzanie streamingiem
- `next/image` automatycznie optymalizuje grafiki banerów
- Stripe obsługuje BLIK, karty, przelewy — popularne metody w PL
- Wygaszanie banerów: Vercel Cron Job (raz dziennie)
- Brak potrzeby osobnej bazy SQL — Vercel KV wystarczy przy tej skali
