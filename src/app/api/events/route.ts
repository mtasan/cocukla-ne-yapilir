import { NextResponse } from "next/server";

// ─── Types ───
export interface EventItem {
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

// ─── 1. Etkinlik.io (FREE, no auth) ───
async function fetchEtkinlikIO(query: string): Promise<EventItem[]> {
  try {
    const res = await fetch(
      `https://etkinlik.io/site-api/search?query=${encodeURIComponent(query)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];

    const data = await res.json();
    const events: EventItem[] = [];

    for (const group of data.results || []) {
      const cityName = group.name || group.title || "";
      for (const item of group.results || group.items || []) {
        events.push({
          id: `etk-${events.length}`,
          name: item.title || "",
          date: item.description || "",
          time: "",
          venue: "",
          city: cityName,
          image: "",
          url: item.url || "#",
          category: queryCategoryMap(query),
          source: "etkinlik.io",
        });
      }
    }

    return events;
  } catch {
    return [];
  }
}

function queryCategoryMap(query: string): string {
  const map: Record<string, string> = {
    cocuk: "Çocuk",
    tiyatro: "Tiyatro",
    konser: "Konser",
    atolye: "Atölye",
    sergi: "Sergi",
    festival: "Festival",
    istanbul: "Etkinlik",
  };
  return map[query.toLowerCase()] || "Etkinlik";
}

// ─── 2. Kultur Istanbul - IBB (FREE, WordPress REST API) ───
async function fetchKulturIstanbul(): Promise<EventItem[]> {
  try {
    const res = await fetch(
      "https://kultur.istanbul/wp-json/wp/v2/event_listing?per_page=20&_fields=id,title,link,date,content,event_listing_type",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];

    const data = await res.json();
    return data.map((item: Record<string, unknown>) => {
      const title = item.title as { rendered: string } | undefined;
      const content = item.content as { rendered: string } | undefined;

      // Extract date from content HTML if possible
      const dateMatch = content?.rendered?.match(
        /(\d{1,2})\s*(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s*(\d{4})?/i
      );
      const dateStr = dateMatch ? dateMatch[0] : "";

      // Extract venue from content
      const venueMatch = content?.rendered?.match(
        /(?:Mekan|Yer|Salon)[:\s]*([^<\n]+)/i
      );
      const venue = venueMatch ? venueMatch[1].trim() : "";

      return {
        id: `ibb-${item.id}`,
        name: title?.rendered || "",
        date: dateStr || (item.date as string)?.slice(0, 10) || "",
        time: "",
        venue,
        city: "İstanbul",
        image: "",
        url: (item.link as string) || "#",
        category: "Kültür",
        source: "kultur.istanbul",
      };
    });
  } catch {
    return [];
  }
}

// ─── 3. TheSportsDB (FREE, no auth, key=3) ───
const SPORTS_DB_BASE = "https://www.thesportsdb.com/api/v1/json/3";

interface SportsDBEvent {
  idEvent: string;
  strEvent: string;
  strLeague: string;
  strSport: string;
  strHomeTeam: string;
  strAwayTeam: string;
  dateEvent: string;
  strTime: string;
  strTimestamp: string;
  strVenue: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string;
  strThumb: string;
  strPoster: string;
}

async function fetchTurkishSports(): Promise<EventItem[]> {
  const events: EventItem[] = [];

  // Get today's date
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);

  // Try multiple approaches to get Turkish football matches
  const urls = [
    // Today's events by date
    `${SPORTS_DB_BASE}/eventsday.php?d=${dateStr}&s=Soccer`,
    // Search for specific Turkish teams
    `${SPORTS_DB_BASE}/searchevents.php?e=Galatasaray`,
    `${SPORTS_DB_BASE}/searchevents.php?e=Fenerbahce`,
    `${SPORTS_DB_BASE}/searchevents.php?e=Besiktas`,
    // Turkish Super Lig next events
    `${SPORTS_DB_BASE}/eventsnextleague.php?id=4339`,
    // Turkish Basketball Super Lig
    `${SPORTS_DB_BASE}/eventsnextleague.php?id=4654`,
  ];

  const seenIds = new Set<string>();

  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 1800 } }); // 30 min cache
      if (!res.ok) continue;

      const data = await res.json();
      const rawEvents: SportsDBEvent[] = data.events || data.event || [];

      for (const ev of rawEvents) {
        if (!ev || seenIds.has(ev.idEvent)) continue;

        // Filter: only Turkish league events or events with Turkish teams
        const isTurkish =
          ev.strLeague?.toLowerCase().includes("turkish") ||
          ev.strLeague?.toLowerCase().includes("türk") ||
          ev.strLeague?.toLowerCase().includes("süper lig") ||
          isTurkishTeam(ev.strHomeTeam) ||
          isTurkishTeam(ev.strAwayTeam);

        if (!isTurkish) continue;

        seenIds.add(ev.idEvent);

        const score =
          ev.intHomeScore != null && ev.intAwayScore != null
            ? `${ev.intHomeScore} - ${ev.intAwayScore}`
            : undefined;

        events.push({
          id: `sport-${ev.idEvent}`,
          name: ev.strEvent || `${ev.strHomeTeam} vs ${ev.strAwayTeam}`,
          date: ev.dateEvent || "",
          time: ev.strTime?.slice(0, 5) || "",
          venue: ev.strVenue || "",
          city: "",
          image: ev.strThumb || ev.strPoster || "",
          url: `https://www.thesportsdb.com/event/${ev.idEvent}`,
          category: ev.strSport === "Soccer" ? "Futbol" : ev.strSport === "Basketball" ? "Basketbol" : (ev.strSport || "Spor"),
          source: "thesportsdb",
          priceRange: score,
        });
      }
    } catch {
      // continue with other URLs
    }
  }

  return events;
}

const TURKISH_TEAMS = [
  "galatasaray", "fenerbahce", "fenerbahçe", "besiktas", "beşiktaş",
  "trabzonspor", "basaksehir", "başakşehir", "adana demirspor",
  "antalyaspor", "alanyaspor", "sivasspor", "konyaspor",
  "kayserispor", "kasimpasa", "kasımpaşa", "gaziantep",
  "hatayspor", "rizespor", "pendikspor", "samsunspor",
  "ankaragücü", "ankaragucu", "bodrum", "eyüpspor", "eyupspor",
  "göztepe", "goztepe", "anadolu efes", "pinar karsiyaka",
];

function isTurkishTeam(team: string): boolean {
  if (!team) return false;
  const lower = team.toLowerCase();
  return TURKISH_TEAMS.some((t) => lower.includes(t));
}

// ─── Date helpers ───
const TURKISH_MONTHS: Record<string, number> = {
  ocak: 0, şubat: 1, mart: 2, nisan: 3, mayıs: 4, haziran: 5,
  temmuz: 6, ağustos: 7, eylül: 8, ekim: 9, kasım: 10, aralık: 11,
  "subat": 1, "mayis": 4, "agustos": 7, "eylul": 8, "kasim": 10, "aralik": 11,
};

/**
 * Parse various date formats into a Date object.
 * Handles: "2025-03-15", "15 Mart 2025", "03 Şubat - 28 Şubat", "2025-03-15T10:00:00"
 * For ranges like "03 Şubat - 28 Şubat", returns the END date.
 */
function parseEventDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  // ISO format: "2025-03-15" or "2025-03-15T10:00:00"
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }

  // Turkish date range: "03 Şubat - 28 Şubat" → use end date
  const rangeMatch = dateStr.match(
    /(\d{1,2})\s+(\w+)\s*-\s*(\d{1,2})\s+(\w+)\s*(\d{4})?/i
  );
  if (rangeMatch) {
    const endDay = parseInt(rangeMatch[3]);
    const endMonthStr = rangeMatch[4].toLowerCase();
    const year = rangeMatch[5] ? parseInt(rangeMatch[5]) : new Date().getFullYear();
    const endMonth = TURKISH_MONTHS[endMonthStr];
    if (endMonth !== undefined) {
      return new Date(year, endMonth, endDay);
    }
  }

  // Single Turkish date: "15 Mart 2025" or "15 Mart"
  const singleMatch = dateStr.match(/(\d{1,2})\s+(\w+)\s*(\d{4})?/i);
  if (singleMatch) {
    const day = parseInt(singleMatch[1]);
    const monthStr = singleMatch[2].toLowerCase();
    const year = singleMatch[3] ? parseInt(singleMatch[3]) : new Date().getFullYear();
    const month = TURKISH_MONTHS[monthStr];
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }

  return null;
}

/**
 * Format a date string to dd.mm.yyyy
 */
function formatDateDDMMYYYY(dateStr: string): string {
  const parsed = parseEventDate(dateStr);
  if (parsed) {
    const dd = String(parsed.getDate()).padStart(2, "0");
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const yyyy = parsed.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }

  // Date range: "03 Şubat - 28 Şubat" → "03.02 - 28.02"
  const rangeMatch = dateStr.match(
    /(\d{1,2})\s+(\w+)\s*-\s*(\d{1,2})\s+(\w+)\s*(\d{4})?/i
  );
  if (rangeMatch) {
    const startDay = rangeMatch[1].padStart(2, "0");
    const startMonth = TURKISH_MONTHS[rangeMatch[2].toLowerCase()];
    const endDay = rangeMatch[3].padStart(2, "0");
    const endMonth = TURKISH_MONTHS[rangeMatch[4].toLowerCase()];
    const year = rangeMatch[5] || new Date().getFullYear();
    if (startMonth !== undefined && endMonth !== undefined) {
      const sm = String(startMonth + 1).padStart(2, "0");
      const em = String(endMonth + 1).padStart(2, "0");
      return `${startDay}.${sm}.${year} - ${endDay}.${em}.${year}`;
    }
  }

  return dateStr; // return as-is if can't parse
}

/**
 * Check if an event date is in the past.
 * For ranges, checks the end date.
 * If date can't be parsed, keep the event (don't filter).
 */
function isEventInPast(dateStr: string): boolean {
  const parsed = parseEventDate(dateStr);
  if (!parsed) return false; // can't parse → keep it
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed < today;
}

// ─── Main handler ───
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab") || "all"; // all | cocuk | tiyatro | spor | kultur

  try {
    let allEvents: EventItem[] = [];

    if (tab === "all" || tab === "cocuk") {
      const cocukEvents = await fetchEtkinlikIO("cocuk");
      allEvents.push(...cocukEvents);
    }

    if (tab === "all" || tab === "tiyatro") {
      const tiyatroEvents = await fetchEtkinlikIO("tiyatro");
      allEvents.push(...tiyatroEvents);
    }

    if (tab === "all" || tab === "spor") {
      const sportEvents = await fetchTurkishSports();
      allEvents.push(...sportEvents);
    }

    if (tab === "all" || tab === "kultur") {
      const kulturEvents = await fetchKulturIstanbul();
      allEvents.push(...kulturEvents);
    }

    if (tab === "konser") {
      const konserEvents = await fetchEtkinlikIO("konser");
      allEvents.push(...konserEvents);
    }

    // Filter out past events
    allEvents = allEvents.filter((e) => !isEventInPast(e.date));

    // Format dates to dd.mm.yyyy
    allEvents = allEvents.map((e) => ({
      ...e,
      date: formatDateDDMMYYYY(e.date),
    }));

    // Deduplicate by name (case-insensitive)
    const seen = new Set<string>();
    allEvents = allEvents.filter((e) => {
      const key = e.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Filter to Istanbul if requested
    const city = searchParams.get("city");
    if (city) {
      allEvents = allEvents.filter(
        (e) =>
          !e.city ||
          e.city.toLowerCase().includes(city.toLowerCase()) ||
          e.city === ""
      );
    }

    return NextResponse.json({
      events: allEvents.slice(0, 30),
      total: allEvents.length,
      sources: ["etkinlik.io", "kultur.istanbul", "thesportsdb"],
    });
  } catch {
    return NextResponse.json({
      events: [],
      total: 0,
      error: "Veri çekilirken hata oluştu",
    });
  }
}
