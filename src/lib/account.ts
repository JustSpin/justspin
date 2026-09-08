import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export type SavedPlace = {
  id: number;
  placeId: string;
  name: string;
  city: string;
  address: string | null;
  cuisine: string | null;
  lat: number | null;
  lon: number | null;
  website: string | null;
  phone: string | null;
  starred: boolean;
  lastSeenAt: string;
};

export type PlaceInput = {
  placeId: string;
  name: string;
  city: string;
  address?: string | null;
  cuisine?: string | null;
  lat?: number | null;
  lon?: number | null;
  website?: string | null;
  phone?: string | null;
};

type PlaceRow = {
  id: number;
  place_id: string;
  name: string;
  city: string;
  address: string | null;
  cuisine: string | null;
  lat: number | null;
  lon: number | null;
  website: string | null;
  phone: string | null;
  starred: boolean;
  last_seen_at: string;
};

function mapPlace(r: PlaceRow): SavedPlace {
  return {
    id: Number(r.id),
    placeId: r.place_id,
    name: r.name,
    city: r.city,
    address: r.address,
    cuisine: r.cuisine,
    lat: r.lat == null ? null : Number(r.lat),
    lon: r.lon == null ? null : Number(r.lon),
    website: r.website,
    phone: r.phone,
    starred: Boolean(r.starred),
    lastSeenAt: String(r.last_seen_at),
  };
}

async function ensureProfile(userId: string) {
  const sql = await getSql();
  await sql`
    insert into profiles (user_id, is_pro)
    values (${userId}, false)
    on conflict (user_id) do nothing
  `;
}

export const getMyAccount = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    const profile = await sql<{ is_pro: boolean }>`
      select is_pro from profiles where user_id = ${context.userId}
    `;
    const starred = await sql<PlaceRow>`
      select id, place_id, name, city, address, cuisine, lat, lon, website, phone, starred, last_seen_at
      from saved_places
      where user_id = ${context.userId} and starred = true
      order by last_seen_at desc
      limit 60
    `;
    const recent = await sql<PlaceRow>`
      select id, place_id, name, city, address, cuisine, lat, lon, website, phone, starred, last_seen_at
      from saved_places
      where user_id = ${context.userId}
      order by last_seen_at desc
      limit 40
    `;
    return {
      isPro: Boolean(profile[0]?.is_pro),
      starred: starred.map(mapPlace),
      recent: recent.map(mapPlace),
    };
  });

export const setProStatus = createServerFn({ method: "POST" })
  .validator((input: { on: boolean }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into profiles (user_id, is_pro)
      values (${context.userId}, ${data.on})
      on conflict (user_id) do update set is_pro = ${data.on}
    `;
    return { isPro: data.on };
  });

export const toggleStar = createServerFn({ method: "POST" })
  .validator((input: PlaceInput & { starred: boolean }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const name = data.name.trim().slice(0, 120);
    if (!name || !data.placeId) return { starred: data.starred };
    await sql`
      insert into saved_places (
        user_id, place_id, name, city, address, cuisine, lat, lon, website, phone, starred, last_seen_at
      )
      values (
        ${context.userId},
        ${data.placeId.slice(0, 160)},
        ${name},
        ${(data.city ?? "").slice(0, 80)},
        ${data.address ?? null},
        ${data.cuisine ?? null},
        ${data.lat ?? null},
        ${data.lon ?? null},
        ${data.website ?? null},
        ${data.phone ?? null},
        ${data.starred},
        now()
      )
      on conflict (user_id, place_id) do update set
        starred = ${data.starred},
        name = excluded.name,
        city = excluded.city,
        address = coalesce(excluded.address, saved_places.address),
        cuisine = coalesce(excluded.cuisine, saved_places.cuisine),
        last_seen_at = now()
    `;
    return { starred: data.starred };
  });

export const recordSeenPlaces = createServerFn({ method: "POST" })
  .validator((input: { city: string; cuisine: string; places: PlaceInput[] }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const city = (data.city ?? "").slice(0, 80);
    const cuisine = (data.cuisine ?? "").slice(0, 40);
    for (const p of data.places.slice(0, 10)) {
      const name = p.name.trim().slice(0, 120);
      if (!name || !p.placeId) continue;
      await sql`
        insert into saved_places (
          user_id, place_id, name, city, address, cuisine, lat, lon, website, phone, starred, last_seen_at
        )
        values (
          ${context.userId},
          ${p.placeId.slice(0, 160)},
          ${name},
          ${city},
          ${p.address ?? null},
          ${p.cuisine ?? cuisine},
          ${p.lat ?? null},
          ${p.lon ?? null},
          ${p.website ?? null},
          ${p.phone ?? null},
          false,
          now()
        )
        on conflict (user_id, place_id) do update set
          last_seen_at = now(),
          name = excluded.name,
          city = excluded.city,
          address = coalesce(excluded.address, saved_places.address),
          cuisine = coalesce(excluded.cuisine, saved_places.cuisine)
      `;
    }
    return { ok: true as const };
  });
