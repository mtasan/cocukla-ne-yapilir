"use client";

import { useEffect, useState, useCallback } from "react";

interface EventItem {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  image: string;
  url: string;
  category: string;
  source: string;
  priceRange?: string;
}

const TABS = [
  { key: "all", label: "Tümü", icon: "🎯" },
  { key: "cocuk", label: "Çocuk", icon: "🧸" },
  { key: "tiyatro", label: "Tiyatro", icon: "🎭" },
  { key: "spor", label: "Spor", icon: "⚽" },
  { key: "kultur", label: "Kültür", icon: "🏛️" },
  { key: "konser", label: "Konser", icon: "🎶" },
];

const CATEGORY_STYLES: Record<string, { bg: string; emoji: string }> = {
  Çocuk: { bg: "bg-orange-100 text-orange-700", emoji: "🧸" },
  Tiyatro: { bg: "bg-purple-100 text-purple-700", emoji: "🎭" },
  Konser: { bg: "bg-teal-100 text-teal-700", emoji: "🎶" },
  Atölye: { bg: "bg-amber-100 text-amber-700", emoji: "🎨" },
  Sergi: { bg: "bg-indigo-100 text-indigo-700", emoji: "🖼️" },
  Festival: { bg: "bg-pink-100 text-pink-700", emoji: "🎪" },
  Kültür: { bg: "bg-blue-100 text-blue-700", emoji: "🏛️" },
  Futbol: { bg: "bg-green-100 text-green-700", emoji: "⚽" },
  Basketbol: { bg: "bg-orange-100 text-orange-700", emoji: "🏀" },
  Spor: { bg: "bg-green-100 text-green-700", emoji: "🏆" },
  Etkinlik: { bg: "bg-gray-100 text-gray-600", emoji: "🎫" },
};

const SOURCE_LABELS: Record<string, string> = {
  "etkinlik.io": "Etkinlik.io",
  "kultur.istanbul": "İBB Kültür",
  thesportsdb: "TheSportsDB",
};

function getCategoryStyle(category: string) {
  return (
    CATEGORY_STYLES[category] || { bg: "bg-gray-100 text-gray-600", emoji: "🎫" }
  );
}

export default function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const fetchEvents = useCallback(async (tab: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events?tab=${tab}&city=istanbul`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(activeTab);
  }, [activeTab, fetchEvents]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <section id="etkinlikler" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold tracking-wide text-orange-500 uppercase">
            Canlı Veriler
          </p>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Bugün Ne Var?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            İstanbul&apos;daki etkinlikler, spor karşılaşmaları ve kültürel
            aktiviteler — canlı kaynaklardan
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6"
              >
                <div className="mb-4 h-32 rounded-xl bg-gray-100" />
                <div className="mb-2 h-5 w-3/4 rounded bg-gray-100" />
                <div className="mb-3 h-4 w-1/2 rounded bg-gray-100" />
                <div className="h-4 w-2/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center">
            <span className="mb-4 block text-5xl">🔍</span>
            <p className="text-lg text-gray-500">
              Bu kategoride şu an etkinlik bulunamadı.
            </p>
            <button
              onClick={() => handleTabClick("all")}
              className="mt-4 text-sm font-medium text-orange-500 hover:text-orange-600"
            >
              Tüm etkinliklere dön →
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 12).map((event) => {
                const style = getCategoryStyle(event.category);
                const isExternal = event.url && event.url !== "#";

                return (
                  <a
                    key={event.id}
                    href={event.url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 transition hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50"
                  >
                    {/* Image or emoji placeholder */}
                    {event.image ? (
                      <div className="mb-4 h-40 overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-pink-50">
                        <span className="text-5xl">{style.emoji}</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.bg}`}
                      >
                        {event.category || "Etkinlik"}
                      </span>
                      {event.priceRange && (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                          {event.priceRange}
                        </span>
                      )}
                      <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-400">
                        {SOURCE_LABELS[event.source] || event.source}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 line-clamp-2 text-base font-bold text-gray-900 transition group-hover:text-orange-600">
                      {event.name}
                    </h3>

                    {/* Details */}
                    <div className="mt-auto space-y-1 text-sm text-gray-500">
                      {event.date && (
                        <p className="flex items-center gap-1.5">
                          <span>📅</span>
                          <span className="line-clamp-1">{event.date}</span>
                          {event.time && ` · ${event.time}`}
                        </p>
                      )}
                      {(event.venue || event.city) && (
                        <p className="flex items-center gap-1.5">
                          <span>📍</span>
                          <span className="line-clamp-1">
                            {[event.venue, event.city]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Results info */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
              <span className="text-sm text-gray-400">
                {events.length} etkinlik bulundu
              </span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                Kaynaklar: Etkinlik.io · İBB Kültür · TheSportsDB
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
