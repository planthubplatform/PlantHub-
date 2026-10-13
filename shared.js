/*
  shared.js — what every page that shows a listing needs.

  The directory (app.js) and the grower's inventory page (inventory.html) both
  show listings, so the things they must agree on live here, once:

    1. the "updated" date: how old a listing is and what colour that makes it
    2. small text helpers: safe HTML, prices, measurements
    3. the trade's vocabulary: the allowed container sizes, specs and grades
    4. money and dates on orders, and the look of an order's status tag
    5. the transport vocabulary: what a carrier hauls, and with what

  Load this file before app.js or any page script that uses these.
*/

// A listing counts as "fresh" if the nursery confirmed it within this many days.
const FRESH_DAYS = 7;
// After this many days we stop calling it recent and start calling it old.
const RECENT_DAYS = 30;


// ---------------------------------------------------------------------------
// 1. Working with the "updated" date.
// ---------------------------------------------------------------------------

// How many days ago was this listing confirmed?
// Returns Infinity when a listing has no date, so undated rows always sort last
// and never get to look fresh.
function daysSince(dateText) {
  if (!dateText) return Infinity;

  const then = new Date(dateText + "T00:00:00");
  if (isNaN(then)) return Infinity;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.round((today - then) / msPerDay));
}

// Which of the three bands does this listing fall into?
// The band decides the colour of the dot, so the page can be read at a glance.
function freshnessTier(days) {
  if (days <= FRESH_DAYS) return "fresh";
  if (days <= RECENT_DAYS) return "recent";
  return "stale";
}

// The short version, used in the table where space is tight: "2d", "3w", "4mo".
function agoShort(days) {
  if (days === Infinity) return "-";
  if (days === 0) return "today";
  if (days < 14) return days + "d";
  if (days < 60) return Math.round(days / 7) + "w";
  return Math.round(days / 30) + "mo";
}

// The long version, used in the expanded detail row: "Confirmed 2 days ago".
function agoLong(days) {
  if (days === Infinity) return "No date given";
  if (days === 0) return "Confirmed today";
  if (days === 1) return "Confirmed yesterday";
  if (days < 14) return "Confirmed " + days + " days ago";
  if (days < 60) return "Confirmed " + Math.round(days / 7) + " weeks ago";
  return "Confirmed " + Math.round(days / 30) + " months ago";
}

// The colours for each band. Kept in one place so the dot and the text can
// never disagree with each other.
const TIER_STYLE = {
  fresh:  { dot: "bg-signal-500", text: "text-signal-700 dark:text-signal-400" },
  recent: { dot: "bg-amber-500",  text: "text-amber-700 dark:text-amber-400" },
  stale:  { dot: "bg-ink-200 dark:bg-ink-700", text: "text-ink-400 dark:text-stone-400" },
};

// ---------------------------------------------------------------------------
// 2. Small text helpers.
// ---------------------------------------------------------------------------

// Text from the data is inserted into the page as HTML, so any stray
// < or & characters must be neutralized first. This is a standard safety step.
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Wholesale price, as the trade writes it: "$19.25", "$326".
// Every listing has one, because buyers pay in full at checkout.
function priceText(price) {
  return "$" + price.toFixed(2).replace(/\.00$/, "");
}

// A measurement as the trade writes it: feet as 12', anything under a foot
// in inches as 6".
function feetText(feet) {
  if (feet < 1) return Math.round(feet * 12) + '"';
  return (Math.round(feet * 10) / 10) + "'";
}

// The specs a listing has, shortest form: 3" cal · 12' ht · 6' spr · 5' CT
function specText(listing) {
  return SPECS.filter(function (spec) {
    return listing[spec.key] !== undefined;
  }).map(function (spec) {
    const value = listing[spec.key];
    const text = spec.unit === "in" ? value + '"' : feetText(value);
    return text + " " + spec.short;
  }).join(" · ");
}

// ---------------------------------------------------------------------------
// 3. The trade's vocabulary.
//    Every listing is described four separate ways, and these lists are the
//    allowed values. A value lives in ONE list only: "Field Grown" is a
//    container, never a grade. The filter rail shows them in this order.
// ---------------------------------------------------------------------------

// 1. Container size: a pick list, not a number. Gallon sizes carry their
//    matching pot width ("3G / 10\"") because growers use both names.
const CONTAINERS = [
  'Liners', 'Bare Root', '5" Quart',
  '1G / 6"', '3G / 10"', '15G / 17"', '45G / 28"', '100G / 36"',
  '60" Box', '108" Box', 'Field Grown', 'Grow Bags',
];

// 2. Specs: measurements. The buyer types the smallest they'll accept.
//    Height and spread can be typed in feet or inches; the data is in feet.
const SPECS = [
  { key: "caliper",    label: "Caliper",     unit: "in", short: "cal" },
  { key: "height",     label: "Height",      unit: "ft", short: "ht",  either: true },
  { key: "spread",     label: "Spread",      unit: "ft", short: "spr", either: true },
  { key: "clearTrunk", label: "Clear trunk", unit: "ft", short: "CT" },
];

// 3. Grade and features: tick boxes. A listing can have several.
const GRADES = [
  'Florida Fancy', 'Grade #1', 'Grade #2', 'Specimen', 'Single Leader',
  'Standard', 'Balled and Burlapped', 'Staked', 'Multi', 'Seedling',
];

// 4. Photos: yes or no.
const PHOTO_OPTIONS = ["With photos", "No photos"];

// Every order goes through PlantHub, paid in full by bank transfer (ACH),
// with a minimum per grower. The amount is kept in one place, with the other
// money rules at the top of store.js; this turns it into text: "$250".
function minOrderText() {
  return "$" + PH.MIN_ORDER_DOLLARS;
}

// ---------------------------------------------------------------------------
// 4. Money and dates on orders.
// ---------------------------------------------------------------------------

// A total, always with cents and with commas in the thousands: "$1,250.00".
// (priceText above is for a single plant's price, where "$326" reads better.)
function moneyText(amount) {
  return "$" + Number(amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// "2026-10-20" -> "20 Oct 2026"
function dayText(isoDate) {
  const date = new Date(String(isoDate).slice(0, 10) + "T12:00:00");
  return isNaN(date) ? String(isoDate || "") : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// "2026-10-09T14:05:00Z" -> "9 Oct, 10:05" (in this computer's own time)
function momentText(isoTime) {
  const date = new Date(isoTime);
  if (isNaN(date)) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + ", " +
         date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// One line of an order or basket, in the trade's short form:
// "Field Grown · 18' ht · 12' CT · Florida Fancy"
function lineDetailText(line) {
  return [line.container, specText(line), (line.grades || []).join(", ")].filter(Boolean).join(" · ");
}

// Which look an order's status tag gets (the styles are in styles.css).
// Never green: green means fresh. Clay says "your move", sand says "done",
// a dashed outline says the order came to nothing.
function orderPillClass(order) {
  if (order.needsYou) return "status-pill status-pill-you";
  if (order.status === "complete") return "status-pill status-pill-done";
  if (order.status === "declined" || order.status === "cancelled") return "status-pill status-pill-off";
  return "status-pill";
}

// An order's lines in one breath: "40 × Sabal Palm, 12 × Areca Palm".
function orderLinesText(order) {
  return order.lines.map(function (line) {
    return line.quantity.toLocaleString() + " × " + line.common;
  }).join(", ");
}

// ---------------------------------------------------------------------------
// 5. The transport vocabulary: what a carrier says it can haul, and with what.
//    Like the lists in section 3, a value lives in ONE list only.
// ---------------------------------------------------------------------------
const HAUL_TYPES = ["Palms", "Trees", "Shrubs", "Groundcover and liners"];
const HAUL_SIZES = ["Up to 15G", "45G to 100G", "Boxed", "Field grown"];
const HAUL_LOADS = ["Partial loads", "Full truckloads"];
const EQUIPMENT = [
  "Flatbed", "Box truck", "Enclosed trailer", "Gooseneck trailer",
  "Tractor trailer", "Crane truck", "Forklift on board", "Liftgate",
];
