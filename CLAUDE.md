# ÇocuklaNeYapılır — CLAUDE.md

Bu belge, Claude'un bu proje ile çalışırken uyması gereken kuralları ve bağlamı sağlar.

---

## Proje Özeti

Çocuklu aileler için akıllı aktivite ve etkinlik öneri platformu. Şu an **landing page (MVP)** aşamasında. İlerleyen fazlarda backend API, canlı etkinlik entegrasyonu ve AI destekli öneri motoru eklenecek.

**Canlı URL:** https://cocukla-ne-yapilir.vercel.app
**GitHub:** https://github.com/mtasan/cocukla-ne-yapilir

---

## Teknoloji Yığını

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| Framework | Next.js (App Router) | 16.1.6 |
| Dil | TypeScript | ^5 |
| Stil | Tailwind CSS | ^4 |
| Font | Inter (latin-ext) | Google Fonts |
| Deploy | Vercel | — |
| Paket Yöneticisi | npm | — |

---

## Proje Yapısı

```
cocukla-ne-yapilir/
├── src/
│   └── app/
│       ├── layout.tsx       # Root layout — metadata, Inter font, lang="tr"
│       ├── page.tsx         # Landing page — tüm bölümler tek dosyada
│       └── globals.css      # Tailwind import + custom animasyonlar
├── public/                  # Statik dosyalar (favicon, vb.)
├── next.config.ts           # Next.js yapılandırma
├── tsconfig.json            # TypeScript — strict mode, @/* alias
├── postcss.config.mjs       # PostCSS — Tailwind entegrasyonu
├── eslint.config.mjs        # ESLint
├── package.json
└── CLAUDE.md                # Bu dosya
```

---

## Sık Kullanılan Komutlar

```bash
# Geliştirme
npm run dev              # http://localhost:3000

# Build & test
npm run build            # Production build (Vercel uyumlu)
npm run start            # Production sunucusu
npm run lint             # ESLint

# Deploy
npx vercel --prod        # Vercel'e production deploy
```

---

## Geliştirme Kuralları

### Genel
1. **Dil:** Tüm kullanıcıya görünen metinler **Türkçe** olmalı (ç, ğ, ı, ö, ş, ü karakterleri doğru kullanılmalı)
2. **Kod dili:** Değişken isimleri, yorumlar ve commit mesajları **İngilizce** olabilir
3. **TypeScript:** Strict mode aktif, tüm yeni dosyalar `.ts` / `.tsx` olmalı
4. **`"use client"`:** Client-side state/interaksiyon gerektiren bileşenlere eklenmeli

### Stil
1. **Tailwind CSS 4** kullanılıyor — `@theme inline` bloğunda custom renkler tanımlı
2. **Renk paleti:** Turuncu (`orange-500`) ana renk, pembe (`pink-500`) gradient accent
3. **Font:** Inter (latin-ext subset — Türkçe karakter desteği için gerekli)
4. Custom animasyonlar `globals.css` içinde tanımlı: `animate-float`, `animate-slide-up`, `animate-pulse-soft`

### Bileşen Yapısı
1. Şu an tüm landing page `page.tsx` içinde tek dosya
2. Bileşenler büyüdükçe `src/components/` altına taşınmalı:
   - `src/components/ui/` — Genel UI bileşenleri (Button, Card, vb.)
   - `src/components/sections/` — Sayfa bölümleri (Hero, Features, vb.)
   - `src/components/layout/` — Navbar, Footer
3. **`<script setup>` değil** — Bu React/Next.js projesi, Vue değil

### SEO
1. Metadata `layout.tsx` içinde tanımlı (title, description, keywords, openGraph)
2. `<html lang="tr">` ayarlanmış
3. İleride dinamik SEO sayfaları eklenecek (şehir + yaş kombinasyonları)

---

## Planlanan Mimari (Gelecek Fazlar)

```
┌─────────────────────────────────────────┐
│         Next.js Frontend (Vercel)        │
│  Landing + Arama + Sonuç + SEO Sayfaları │
└──────────────────┬──────────────────────┘
                   │ REST API
                   ▼
┌─────────────────────────────────────────┐
│          FastAPI Backend                 │
│  Etkinlik Aggregation + AI Proxy         │
│  ┌───────────┐ ┌───────────┐            │
│  │ Etkinlik  │ │  Mekan    │            │
│  │ Scraper   │ │  Servisi  │            │
│  └───────────┘ └───────────┘            │
│  ┌───────────┐ ┌───────────┐            │
│  │  Hava     │ │  Claude   │            │
│  │  Durumu   │ │  AI API   │            │
│  └───────────┘ └───────────┘            │
└──────────────────┬──────────────────────┘
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
┌─────────┐ ┌───────────┐ ┌──────────┐
│PostgreSQL│ │   Redis   │ │ External │
│ Mekanlar │ │   Cache   │ │   APIs   │
│Etkinlikler│ │           │ │Etkinlik.io│
└─────────┘ └───────────┘ │Google Maps│
                           │OpenWeather│
                           └──────────┘
```

---

## Veri Kaynakları (Planlanan)

| Kaynak | Tip | Durum |
|--------|-----|-------|
| Etkinlik.io | REST API | Planlanıyor |
| Google Places API | REST API | Planlanıyor |
| OpenWeatherMap | REST API | Planlanıyor |
| Biletix | Web scraping | Planlanıyor |
| Biletinial | Web scraping | Planlanıyor |
| Claude API | AI öneri | Planlanıyor |

---

## Ortam Değişkenleri (Gelecek)

```bash
# API Keys (henüz kullanılmıyor)
NEXT_PUBLIC_API_URL=              # Backend API endpoint
GOOGLE_PLACES_API_KEY=            # Google Places
OPENWEATHERMAP_API_KEY=           # Hava durumu
ANTHROPIC_API_KEY=                # Claude AI önerileri

# Vercel otomatik ayarlar
VERCEL_URL=                       # Deploy URL
```

---

## Kritik Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `src/app/layout.tsx` | Root layout — metadata, font, Türkçe lang ayarı |
| `src/app/page.tsx` | Landing page — tüm bölümler (Hero, Features, Waitlist, vb.) |
| `src/app/globals.css` | Tailwind config + custom animasyonlar |
| `package.json` | Bağımlılıklar ve script'ler |
| `next.config.ts` | Next.js yapılandırma |

---

## Notlar

- Proje **landing page / MVP** aşamasında — henüz backend yok
- Waitlist formu şu an sadece client-side state, backend'e bağlı değil
- Vercel'e deploy `npx vercel --prod` ile yapılıyor
- GitHub repo: `mtasan/cocukla-ne-yapilir` (public)
- Türkçe karakter desteği için Inter fontunda `latin-ext` subset kullanılıyor
