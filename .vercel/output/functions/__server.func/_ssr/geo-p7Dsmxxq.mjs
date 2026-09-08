//#region node_modules/.nitro/vite/services/ssr/assets/geo-p7Dsmxxq.js
function haversineMiles(a, b) {
	const R = 3958.8;
	const dLat = deg(b.lat - a.lat);
	const dLon = deg(b.lon - a.lon);
	const lat1 = deg(a.lat);
	const lat2 = deg(b.lat);
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
	return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
function deg(n) {
	return n * Math.PI / 180;
}
function formatMiles(n) {
	if (n == null || Number.isNaN(n)) return "";
	if (n < .1) return "< 0.1 mi";
	if (n < 10) return `${n.toFixed(1)} mi`;
	return `${Math.round(n)} mi`;
}
var METERS_PER_MILE = 1609.34;
function clampMiles(n) {
	if (!Number.isFinite(n)) return 5;
	return Math.min(100, Math.max(1, Math.round(n)));
}
function milesToMeters(miles) {
	return Math.round(clampMiles(miles) * METERS_PER_MILE);
}
function metersToMiles(meters) {
	return clampMiles(meters / METERS_PER_MILE);
}
//#endregion
export { milesToMeters as i, haversineMiles as n, metersToMiles as r, formatMiles as t };
