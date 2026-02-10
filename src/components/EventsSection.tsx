"use client";

import { useEffect, useState } from "react";

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
  priceRange?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Tiyatro: "bg-purple-100 text-purple-700",
  Atölye: "bg-orange-100 text-orange-700",
  Gösteri: "bg-sky-100 text-sky-700",
  Müzikal: "bg-pink-100 text-pink-700",
  Konser: "bg-teal-100 text-teal-700",
  Music: "bg-teal-100 text-teal-700",
  Arts: "bg-purple-100 text-purple-700",
  Sports: "bg-green-100 text-green-700",
  Film: "bg-yellow-100 text-yellow-700",
  Miscellaneous: "bg-gray-100 text-gray-700",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  Tiyatro: "🎭",
  Atölye: "🎨",
  Gösteri: "🎪",
  Müzikal: "🎵",
  Konser: "🎶",
  Music: "🎶",
  Arts: "🎨",
  Sports: "⚽",
  Film: "🎬",
  Miscellaneous: "🎫",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      weekday: "short",
    });
  } catch {
    return dateStr;
  }
}

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || "bg-gray-100 text-gray-600";
}

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category] || "🎫";
}

export default function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events?city=Istanbul&size=6");
        const data = await res.json();
        setEvents(data.events || []);
        setSource(data.source || "");
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <section id="etkinlikler" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold tracking-wide text-orange-500 uppercase">
            Canlı Etkinlikler
          </p>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Yaklaşan Çocuk Etkinlikleri
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            İstanbul&apos;daki güncel aile ve çocuk etkinlikleri
          </p>
        </div>

        {loading ? (
          /* Loading skeleton */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6"
              >
                <div className="mb-4 h-36 rounded-xl bg-gray-100" />
                <div className="mb-2 h-5 w-3/4 rounded bg-gray-100" />
                <div className="mb-4 h-4 w-1/2 rounded bg-gray-100" />
                <div className="h-4 w-2/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">🎭</span>
            <p className="text-gray-500 text-lg">
              Şu an gösterilecek etkinlik bulunamadı.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <a
                  key={event.id}
                  href={event.url}
                  target={event.url !== "#" ? "_blank" : undefined}
                  rel={event.url !== "#" ? "noopener noreferrer" : undefined}
                  className="group rounded-2xl border border-gray-100 bg-white p-6 transition hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50"
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
                    <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-pink-50">
                      <span className="text-6xl">
                        {getCategoryEmoji(event.category)}
                      </span>
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getCategoryColor(event.category)}`}
                    >
                      {event.category || "Etkinlik"}
                    </span>
                    {event.priceRange && (
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                        {event.priceRange}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-orange-600 transition line-clamp-2">
                    {event.name}
                  </h3>

                  {/* Details */}
                  <div className="space-y-1 text-sm text-gray-500">
                    <p className="flex items-center gap-1.5">
                      <span>📅</span>
                      {formatDate(event.date)}
                      {event.time && ` · ${event.time}`}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span>📍</span>
                      {event.venue}
                      {event.city && `, ${event.city}`}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Source badge */}
            {source && (
              <div className="mt-8 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-4 py-2 text-xs text-gray-400">
                  {source === "ticketmaster" ? (
                    <>🎫 Ticketmaster / Biletix verisi</>
                  ) : (
                    <>📋 Örnek etkinlikler gösteriliyor</>
                  )}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
