import { NextResponse } from "next/server";

// Ticketmaster Discovery API v2
// Free: 5,000 calls/day — https://developer.ticketmaster.com/
const TM_BASE = "https://app.ticketmaster.com/discovery/v2/events.json";
const TM_API_KEY = process.env.TICKETMASTER_API_KEY || "";

export interface EventItem {
  id: string;
  name: string;
  date: string;        // "2025-03-15"
  time: string;        // "14:00"
  venue: string;
  city: string;
  image: string;
  url: string;
  category: string;
  priceRange?: string;
}

// Fallback events — shown when API key is not set or API fails
const FALLBACK_EVENTS: EventItem[] = [
  {
    id: "f1",
    name: "Kukla Tiyatrosu: Karagöz ile Hacivat",
    date: "2025-03-22",
    time: "11:00",
    venue: "Zorlu PSM",
    city: "İstanbul",
    image: "",
    url: "#",
    category: "Tiyatro",
    priceRange: "150 - 300 ₺",
  },
  {
    id: "f2",
    name: "Çocuk Resim Atölyesi",
    date: "2025-03-23",
    time: "10:30",
    venue: "İstanbul Modern",
    city: "İstanbul",
    image: "",
    url: "#",
    category: "Atölye",
    priceRange: "200 ₺",
  },
  {
    id: "f3",
    name: "Buz Pateni Gösterisi",
    date: "2025-03-29",
    time: "15:00",
    venue: "Silivri Buz Pisti",
    city: "İstanbul",
    image: "",
    url: "#",
    category: "Gösteri",
    priceRange: "100 - 250 ₺",
  },
  {
    id: "f4",
    name: "Masal Müzikali: Pamuk Prenses",
    date: "2025-04-05",
    time: "13:00",
    venue: "CKM Tiyatro Salonu",
    city: "İstanbul",
    image: "",
    url: "#",
    category: "Müzikal",
    priceRange: "120 - 280 ₺",
  },
  {
    id: "f5",
    name: "Bilim Şenliği — Deney Atölyesi",
    date: "2025-04-12",
    time: "11:00",
    venue: "Rahmi M. Koç Müzesi",
    city: "İstanbul",
    image: "",
    url: "#",
    category: "Atölye",
    priceRange: "Ücretsiz",
  },
  {
    id: "f6",
    name: "Çocuk Senfoni Konseri",
    date: "2025-04-19",
    time: "14:00",
    venue: "Lütfi Kırdar ICEC",
    city: "İstanbul",
    image: "",
    url: "#",
    category: "Konser",
    priceRange: "80 - 200 ₺",
  },
];

function formatTMEvent(raw: Record<string, unknown>): EventItem {
  const dates = raw.dates as Record<string, unknown> | undefined;
  const start = dates?.start as Record<string, string> | undefined;

  const embedded = raw._embedded as Record<string, unknown[]> | undefined;
  const venues = embedded?.venues as Record<string, unknown>[] | undefined;
  const venue = venues?.[0] as Record<string, unknown> | undefined;
  const venueCity = venue?.city as Record<string, string> | undefined;

  const images = raw.images as { url: string; width: number }[] | undefined;
  const bestImage = images?.sort((a, b) => b.width - a.width)[0]?.url || "";

  const classifications = raw.classifications as Record<string, unknown>[] | undefined;
  const classification = classifications?.[0] as Record<string, Record<string, string>> | undefined;
  const segment = classification?.segment?.name || classification?.genre?.name || "";

  const prices = raw.priceRanges as { min: number; max: number; currency: string }[] | undefined;
  let priceRange: string | undefined;
  if (prices && prices.length > 0) {
    const p = prices[0];
    priceRange = p.min === p.max
      ? `${p.min} ${p.currency}`
      : `${p.min} - ${p.max} ${p.currency}`;
  }

  return {
    id: raw.id as string,
    name: raw.name as string,
    date: start?.localDate || "",
    time: start?.localTime?.slice(0, 5) || "",
    venue: (venue?.name as string) || "",
    city: venueCity?.name || "İstanbul",
    image: bestImage,
    url: (raw.url as string) || "#",
    category: segment,
    priceRange,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Istanbul";
  const size = searchParams.get("size") || "12";

  // No API key → return fallback events
  if (!TM_API_KEY) {
    return NextResponse.json({
      source: "fallback",
      events: FALLBACK_EVENTS,
      message: "Ticketmaster API key tanımlı değil. Örnek etkinlikler gösteriliyor.",
    });
  }

  try {
    const params = new URLSearchParams({
      apikey: TM_API_KEY,
      countryCode: "TR",
      city,
      includeFamily: "only",
      size,
      sort: "date,asc",
    });

    const res = await fetch(`${TM_BASE}?${params}`, {
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!res.ok) {
      // API error → fallback
      return NextResponse.json({
        source: "fallback",
        events: FALLBACK_EVENTS,
        message: `Ticketmaster API hata: ${res.status}`,
      });
    }

    const data = await res.json();
    const embedded = data._embedded;

    if (!embedded?.events || embedded.events.length === 0) {
      // No family events → try without family filter
      const generalParams = new URLSearchParams({
        apikey: TM_API_KEY,
        countryCode: "TR",
        city,
        size,
        sort: "date,asc",
      });

      const generalRes = await fetch(`${TM_BASE}?${generalParams}`, {
        next: { revalidate: 3600 },
      });

      if (!generalRes.ok) {
        return NextResponse.json({
          source: "fallback",
          events: FALLBACK_EVENTS,
        });
      }

      const generalData = await generalRes.json();
      const generalEvents = generalData._embedded?.events || [];

      return NextResponse.json({
        source: "ticketmaster",
        events: generalEvents.map(formatTMEvent),
        total: generalData.page?.totalElements || 0,
      });
    }

    return NextResponse.json({
      source: "ticketmaster",
      events: embedded.events.map(formatTMEvent),
      total: data.page?.totalElements || 0,
    });
  } catch {
    return NextResponse.json({
      source: "fallback",
      events: FALLBACK_EVENTS,
      message: "API bağlantı hatası",
    });
  }
}
