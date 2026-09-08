import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { i as getSql, t as authMiddleware } from "./db-DdbbMTmm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-BhRzjoFe.js
function mapPlace(r) {
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
		lastSeenAt: String(r.last_seen_at)
	};
}
async function ensureProfile(userId) {
	await (await getSql())`
    insert into profiles (user_id, is_pro)
    values (${userId}, false)
    on conflict (user_id) do nothing
  `;
}
var getMyAccount_createServerFn_handler = createServerRpc({
	id: "d21a146a7ea0d154efbabe6dadbb0878f96c76379d3958f788770449c1e90c42",
	name: "getMyAccount",
	filename: "src/lib/account.ts"
}, (opts) => getMyAccount.__executeServer(opts));
var getMyAccount = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyAccount_createServerFn_handler, async ({ context }) => {
	await ensureProfile(context.userId);
	const sql = await getSql();
	const profile = await sql`
      select is_pro from profiles where user_id = ${context.userId}
    `;
	const starred = await sql`
      select id, place_id, name, city, address, cuisine, lat, lon, website, phone, starred, last_seen_at
      from saved_places
      where user_id = ${context.userId} and starred = true
      order by last_seen_at desc
      limit 60
    `;
	const recent = await sql`
      select id, place_id, name, city, address, cuisine, lat, lon, website, phone, starred, last_seen_at
      from saved_places
      where user_id = ${context.userId}
      order by last_seen_at desc
      limit 40
    `;
	return {
		isPro: Boolean(profile[0]?.is_pro),
		starred: starred.map(mapPlace),
		recent: recent.map(mapPlace)
	};
});
var setProStatus_createServerFn_handler = createServerRpc({
	id: "77c5a09a4554e2da188f482a123a9112904c0c1e45a035796e1772a61bc46c36",
	name: "setProStatus",
	filename: "src/lib/account.ts"
}, (opts) => setProStatus.__executeServer(opts));
var setProStatus = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(setProStatus_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      insert into profiles (user_id, is_pro)
      values (${context.userId}, ${data.on})
      on conflict (user_id) do update set is_pro = ${data.on}
    `;
	return { isPro: data.on };
});
var toggleStar_createServerFn_handler = createServerRpc({
	id: "ce9e21938f1a11a223b824698ed1d57fc56c4a0ab6e064bd9e7e8e7ef673845f",
	name: "toggleStar",
	filename: "src/lib/account.ts"
}, (opts) => toggleStar.__executeServer(opts));
var toggleStar = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(toggleStar_createServerFn_handler, async ({ context, data }) => {
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
var recordSeenPlaces_createServerFn_handler = createServerRpc({
	id: "0db08812bd07644e71be5247bf580c755a16d10dced4ed9300e237f00c8fca75",
	name: "recordSeenPlaces",
	filename: "src/lib/account.ts"
}, (opts) => recordSeenPlaces.__executeServer(opts));
var recordSeenPlaces = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(recordSeenPlaces_createServerFn_handler, async ({ context, data }) => {
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
	return { ok: true };
});
//#endregion
export { getMyAccount_createServerFn_handler, recordSeenPlaces_createServerFn_handler, setProStatus_createServerFn_handler, toggleStar_createServerFn_handler };
