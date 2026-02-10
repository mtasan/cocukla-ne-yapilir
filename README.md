# 🧸 ÇocuklaNeYapılır

**Çocuğunla bugün ne yapılır?** — Yaş, konum ve hava durumuna göre akıllı aktivite ve etkinlik önerileri.

🔗 **Canlı:** [cocukla-ne-yapilir.vercel.app](https://cocukla-ne-yapilir.vercel.app)

---

## Proje Nedir?

ÇocuklaNeYapılır, çocuklu ailelere özel akıllı bir aktivite öneri platformudur. Mevcut sitelerden farkı:

- **Yaş filtresi** — 0-2, 3-5, 6-9, 10-14 yaş gruplarına özel öneriler
- **Hava durumu entegrasyonu** — Yağmurlu gün? İç mekan. Güneşli mi? Park ve açık alan
- **Canlı etkinlikler** — Tiyatro, atölye, konser — güncel etkinlik takvimi
- **AI destekli öneri** — "3 yaşında çocukla Kadıköy'de ne yapılır?" sorusuna anında cevap
- **Konum bazlı** — En yakın mekanları mesafeye göre sıralar
- **Bütçe dostu** — Ücretsiz parklar, müzeler ve uygun fiyatlı aktiviteler

---

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Dil** | TypeScript |
| **Stil** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Font** | Inter (Google Fonts, latin-ext) |
| **Deploy** | [Vercel](https://vercel.com/) |

---

## Kurulum

```bash
# Repo'yu klonla
git clone https://github.com/mtasan/cocukla-ne-yapilir.git
cd cocukla-ne-yapilir

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusu
npm run dev
```

http://localhost:3000 adresinde açılır.

---

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (hot reload) |
| `npm run build` | Production build |
| `npm run start` | Production sunucusu |
| `npm run lint` | ESLint kontrolü |

---

## Proje Yapısı

```
cocukla-ne-yapilir/
├── src/
│   └── app/
│       ├── layout.tsx       # Root layout (metadata, font, lang=tr)
│       ├── page.tsx         # Landing page (tüm bölümler)
│       └── globals.css      # Tailwind + animasyonlar
├── public/                  # Statik dosyalar
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Landing Page Bölümleri

1. **Navbar** — Logo, navigasyon, erken erişim CTA
2. **Hero** — Ana başlık + interaktif demo öneri kartı
3. **Social Proof** — 1000+ Mekan, 81 İl, AI Motor, 7/24 Güncel
4. **Nasıl Çalışır** — 3 adımlı akış (bilgi gir → AI üretir → keşfet)
5. **Özellikler** — 6 özellik kartı
6. **Waitlist** — E-posta toplama formu
7. **Footer**

---

## Yol Haritası

- [ ] Backend API (FastAPI) — etkinlik aggregation, AI proxy
- [ ] Etkinlik.io API entegrasyonu
- [ ] Google Places API — mekan bilgisi
- [ ] OpenWeatherMap — hava durumu filtreleme
- [ ] Claude API — kişiselleştirilmiş AI öneriler
- [ ] Biletix/Biletinial scraping
- [ ] Kullanıcı hesapları ve tercihler
- [ ] Mobil responsive iyileştirmeler
- [ ] SEO sayfaları (şehir + yaş kombinasyonları)

---

## Deploy

Vercel'e otomatik deploy:

```bash
npx vercel --prod
```

Veya GitHub entegrasyonu ile her `git push` otomatik deploy tetikler.

---

## Lisans

MIT

---

<p align="center">
  <sub>Çocuğunuzla geçirdiğiniz her an özel. Biz sadece ilham veriyoruz. 💛</sub>
</p>
