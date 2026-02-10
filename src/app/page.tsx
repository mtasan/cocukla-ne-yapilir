"use client";

import { useState } from "react";

/* ─── Emoji icon helpers ─── */
const FEATURES = [
  {
    icon: "🎂",
    title: "Yaşa Göre Öneri",
    desc: "0-2, 3-5, 6-9, 10-14 yaş gruplarına özel aktiviteler",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: "🌦️",
    title: "Hava Durumu Akıllı",
    desc: "Yağmurlu gün? İç mekan. Güneşli mi? Park ve açık alan önerileri",
    color: "bg-sky-50 text-sky-500",
  },
  {
    icon: "🎭",
    title: "Canlı Etkinlikler",
    desc: "Tiyatro, atölye, konser — güncellenen etkinlik takvimi",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: "🤖",
    title: "AI Destekli Öneri",
    desc: "\"3 yaşında çocukla Kadıköy'de ne yapılır?\" — anında cevap",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: "📍",
    title: "Konum Bazlı",
    desc: "Sana en yakın mekanları ve etkinlikleri mesafeye göre sıralar",
    color: "bg-pink-50 text-pink-500",
  },
  {
    icon: "💰",
    title: "Bütçe Dostu",
    desc: "Ücretsiz parklar, müzeler ve uygun fiyatlı aktiviteler",
    color: "bg-yellow-50 text-yellow-500",
  },
];

const STEPS = [
  {
    num: "1",
    icon: "📝",
    title: "Bilgilerini Gir",
    desc: "Çocuğunuzun yaşı, konumunuz ve müsait zamanınız",
  },
  {
    num: "2",
    icon: "✨",
    title: "AI Öneri Üretir",
    desc: "Hava durumu, etkinlik takvimi ve mekan verileri ile akıllı eşleştirme",
  },
  {
    num: "3",
    icon: "🎉",
    title: "Keşfet & Eğlen",
    desc: "Etkinlik detayları, yol tarifi ve bilet bilgisi tek yerde",
  },
];

const DEMO_SUGGESTIONS = [
  { icon: "🎪", text: "Miniatürk Gezisi", tag: "Açık Alan", tagColor: "bg-teal-100 text-teal-700" },
  { icon: "🎨", text: "Çocuk Resim Atölyesi", tag: "Atölye", tagColor: "bg-purple-100 text-purple-700" },
  { icon: "🎭", text: "Kukla Tiyatrosu — Zorlu PSM", tag: "Etkinlik", tagColor: "bg-orange-100 text-orange-700" },
  { icon: "🌳", text: "Maçeraperest Maçka Parkı", tag: "Ücretsiz", tagColor: "bg-green-100 text-green-700" },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-2xl">🧸</span>
            <span className="text-gray-900">
              Çocukla<span className="text-orange-500">NeYapılır</span>
            </span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <a href="#ozellikler" className="transition hover:text-orange-500">
              Özellikler
            </a>
            <a href="#nasil" className="transition hover:text-orange-500">
              Nasıl Çalışır
            </a>
            <a
              href="#kayit"
              className="rounded-full bg-orange-500 px-5 py-2.5 text-white transition hover:bg-orange-600"
            >
              Erken Erişim
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-orange-100 opacity-40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-purple-100 opacity-30 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 lg:flex-row lg:gap-16">
          {/* Left — text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
              <span className="animate-pulse-soft">🚀</span> Yakında Yayında
            </div>

            <h1 className="mb-6 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              Çocuğunla bugün{" "}
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                ne yapılır?
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-600 md:text-xl">
              Yaş, konum ve hava durumuna göre{" "}
              <strong className="text-gray-900">akıllı aktivite önerileri</strong>.
              Canlı etkinlikler, mekan puanları ve AI destekli planlama — hepsi
              bir arada.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="#kayit"
                className="w-full rounded-full bg-orange-500 px-8 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 hover:shadow-orange-300 sm:w-auto"
              >
                Erken Erişime Katıl
              </a>
              <a
                href="#nasil"
                className="flex items-center gap-2 text-gray-600 transition hover:text-orange-500"
              >
                Nasıl çalışır?{" "}
                <span className="text-xl">→</span>
              </a>
            </div>
          </div>

          {/* Right — demo card */}
          <div className="w-full max-w-md flex-shrink-0 lg:w-[420px]">
            <div className="animate-float rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl shadow-gray-200/60">
              {/* Mock header */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-lg">
                  🔍
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Beşiktaş, İstanbul
                  </p>
                  <p className="text-xs text-gray-400">
                    4 yaş &middot; Bugün &middot; ☁️ Parçalı bulutlu
                  </p>
                </div>
              </div>

              <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                Sana Özel Öneriler
              </p>

              <div className="space-y-3">
                {DEMO_SUGGESTIONS.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition hover:bg-orange-50"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                    }}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {s.text}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.tagColor}`}
                    >
                      {s.tag}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 p-3 text-white">
                <div>
                  <p className="text-xs font-medium opacity-80">
                    AI Önerisi
                  </p>
                  <p className="text-sm font-bold">
                    &quot;Miniatürk sonrası Bebek sahilinde dondurma molası!&quot;
                  </p>
                </div>
                <span className="text-2xl">🍦</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Social proof bar ─── */}
      <section className="border-y border-gray-100 bg-gray-50 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 px-6 text-center text-sm text-gray-500">
          <div>
            <span className="text-2xl font-bold text-gray-900">1000+</span>
            <p>Mekan & Etkinlik</p>
          </div>
          <div className="hidden h-8 w-px bg-gray-200 sm:block" />
          <div>
            <span className="text-2xl font-bold text-gray-900">81 İl</span>
            <p>Türkiye Geneli</p>
          </div>
          <div className="hidden h-8 w-px bg-gray-200 sm:block" />
          <div>
            <span className="text-2xl font-bold text-gray-900">AI</span>
            <p>Akıllı Öneri Motoru</p>
          </div>
          <div className="hidden h-8 w-px bg-gray-200 sm:block" />
          <div>
            <span className="text-2xl font-bold text-gray-900">7/24</span>
            <p>Güncel Etkinlik Verisi</p>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="nasil" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-2 text-sm font-semibold tracking-wide text-orange-500 uppercase">
              Nasıl Çalışır?
            </p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Üç adımda mükemmel bir gün planı
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-gray-100 bg-white p-8 text-center transition hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl transition group-hover:scale-110">
                  {step.icon}
                </div>
                <div className="mb-2 text-xs font-bold text-orange-400 uppercase">
                  Adım {step.num}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="ozellikler" className="bg-gray-50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-2 text-sm font-semibold tracking-wide text-orange-500 uppercase">
              Özellikler
            </p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Neden ÇocuklaNeYapılır?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Diğer sitelerden farkı: akıllı, kişisel ve her zaman güncel.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-gray-100 bg-white p-7 transition hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${f.color} transition group-hover:scale-110`}
                >
                  {f.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA / Waitlist ─── */}
      <section id="kayit" className="py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <span className="mb-4 inline-block text-5xl">🎈</span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Erken erişim için kayıt ol
          </h2>
          <p className="mb-8 text-lg text-gray-500">
            Lansmandan önce haber al, ilk kullananlar arasında ol. Spam
            yok, söz.
          </p>

          {submitted ? (
            <div className="animate-slide-up rounded-2xl bg-green-50 p-8">
              <span className="mb-2 block text-4xl">🎉</span>
              <p className="text-lg font-semibold text-green-800">
                Harika, kaydın alındı!
              </p>
              <p className="text-green-600">
                Lansman öncesi sana haber vereceğiz.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="örnek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full border border-gray-200 px-6 py-4 text-gray-800 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
              <button
                type="submit"
                className="rounded-full bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 hover:shadow-orange-300"
              >
                Kayıt Ol
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-gray-400">
            E-postan gizli kalır. Sadece lansman haberi için kullanılır.
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-100 bg-gray-50 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center text-sm text-gray-400">
          <div className="flex items-center gap-2 text-base font-bold text-gray-600">
            <span className="text-lg">🧸</span>
            Çocukla<span className="text-orange-500">NeYapılır</span>
          </div>
          <p>
            Çocuğunuzla geçirdiğiniz her an özel. Biz sadece ilham veriyoruz.
          </p>
          <p>&copy; {new Date().getFullYear()} ÇocuklaNeYapılır. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
