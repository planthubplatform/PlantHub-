/*
  app.js — the search behaviour.

  The flow is always the same three steps:
    1. Read what the visitor typed and which filters they set.
    2. Work out which LISTINGS match.
    3. Redraw the table and the filter counts.

  The data comes from data/nurseries.js, which the page loads first and which
  puts everything in a variable called NURSERIES.

  One listing = one plant at one nursery at one size. The data file nests
  plants inside nurseries, which is the sensible way to type it in, but the
  page works the other way round: a buyer sourcing thirty items compares
  listings across every nursery at once. So the first thing we do is flatten
  the nested data into one long list of rows (section 4), and everything after
  that — searching, filtering, sorting — works on that flat list.

  Every listing carries an "updated" date. Showing how old a listing is —
  plainly, on every row — is the thing this site does that the competition
  doesn't, so the date gets its own helpers (section 2) and its own column.
*/

// ---------------------------------------------------------------------------
// 1. Grab the parts of the page we need to read from or write to.
//    document.getElementById finds an element by its id="..." in index.html.
// ---------------------------------------------------------------------------
const searchBox = document.getElementById("search");
const clearButton = document.getElementById("clear");
const resultsBox = document.getElementById("results");
const countLine = document.getElementById("count");
const sortSelect = document.getElementById("sort");
const freshOnlyBox = document.getElementById("fresh-only");
const resetButton = document.getElementById("reset-filters");
const activeFilterBox = document.getElementById("active-filters");
const filterPanel = document.getElementById("filter-panel");
const filterCount = document.getElementById("filter-count");
const showResultsButton = document.getElementById("show-results");

// A listing counts as "fresh" if the nursery confirmed it within this many days.
const FRESH_DAYS = 7;
// After this many days we stop calling it recent and start calling it old.
const RECENT_DAYS = 30;

// ---------------------------------------------------------------------------
// 2. Working with the "updated" date.
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
  if (days === Infinity) return "—";
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
// 3. Small text helpers.
// ---------------------------------------------------------------------------

// Make text easy to compare: lowercase, no accents, no punctuation.
// "Acer palmatum 'Bloodgood'" becomes "acer palmatum bloodgood".
function normalize(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")                  // splits accented letters apart
    .replace(/[̀-ͯ]/g, "")   // ...then drops the accent marks
    .replace(/[^a-z0-9\s]/g, " ")      // punctuation becomes a space
    .replace(/\s+/g, " ")              // collapse repeated spaces
    .trim();
}

// How many single-character edits turn word A into word B?
// "palmm" -> "palm" is 1 edit. We use this so small typos still find results.
// (This is the classic "edit distance" calculation; you don't need to memorize it.)
function editDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  let previous = Array.from({ length: cols }, (_, i) => i);

  for (let i = 1; i < rows; i++) {
    const current = [i];
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        previous[j] + 1,       // delete a letter
        current[j - 1] + 1,    // add a letter
        previous[j - 1] + cost // swap a letter
      );
    }
    previous = current;
  }
  return previous[cols - 1];
}

// Does one search word appear in this text?
// A word counts as found if it appears directly ("map" inside "maple"),
// or if it is one typo away from a word in the text ("clusa" vs "clusia").
function textHasWord(text, word) {
  if (text.includes(word)) return true;

  // Only allow typo-tolerance on longer words, or "oak" would match "oat".
  if (word.length < 5) return false;

  return text.split(" ").some(function (textWord) {
    if (Math.abs(textWord.length - word.length) > 1) return false;
    return editDistance(textWord, word) <= 1;
  });
}

// Every search word must be found somewhere in the text.
// That way "live oak" only matches entries containing both words.
function textMatches(text, words) {
  return words.every(function (word) {
    return textHasWord(text, word);
  });
}

// Text from the data is inserted into the page as HTML, so any stray
// < or & characters must be neutralized first. This is a standard safety step.
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Wrap the searched-for words in <mark> so the visitor can see WHY a row
// matched — which matters here, because a row can match on the plant, the
// nursery or the city.
function highlight(text, words) {
  let safe = escapeHtml(text);
  words.forEach(function (word) {
    if (word.length < 2) return;
    const pattern = new RegExp("(" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
    safe = safe.replace(pattern, '<mark class="bg-clay-100 text-ink-900 dark:bg-clay-700 dark:text-cream rounded-sm px-0.5">$1</mark>');
  });
  return safe;
}

// Wholesale price, as the trade writes it: "$19.25", "$326".
// Every listing has one, because buyers pay in full at checkout.
function priceText(price) {
  return "$" + price.toFixed(2).replace(/\.00$/, "");
}

// ---------------------------------------------------------------------------
// 4. The trade's vocabulary.
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

// Every order goes through PlantHub, paid in full by bank transfer (ACH).
const MIN_ORDER = "$250";

// ---------------------------------------------------------------------------
// 5. Flatten the data into one row per listing.
//    Done once, when the page loads. Everything below works on this list.
// ---------------------------------------------------------------------------
const LISTINGS = [];

NURSERIES.forEach(function (nursery) {
  nursery.plants.forEach(function (plant) {
    const days = daysSince(plant.updated);
    const grades = plant.grades || [];
    LISTINGS.push({
      nursery: nursery,
      common: plant.common,
      botanical: plant.botanical,
      container: plant.container,
      caliper: plant.caliper,
      height: plant.height,
      spread: plant.spread,
      clearTrunk: plant.clearTrunk,
      grades: grades,
      photos: plant.photos || 0,
      quantity: plant.quantity,
      price: plant.price,
      updated: plant.updated,
      days: days,
      tier: freshnessTier(days),
      // Searchable text, worked out once so typing stays fast. The plant and
      // the place go in together, so "clusia loxahatchee" can find a row by
      // taking one word from each.
      text: normalize(
        plant.common + " " + plant.botanical + " " + plant.container + " " +
        grades.join(" ") + " " + nursery.name + " " + nursery.city + " " +
        nursery.state + " " + nursery.specialties.join(" ")
      ),
    });
  });
});

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
// 6. The filters currently switched on.
//    A Set is a list that can't hold the same value twice — exactly what a
//    group of tick boxes needs. Ticking two boxes in one group means
//    "either of these".
// ---------------------------------------------------------------------------
const TICK_FACETS = ["container", "grades", "photos", "city"];

const chosen = {
  container: new Set(),
  grades: new Set(),
  photos: new Set(),
  city: new Set(),
};

// The smallest acceptable value for each spec, in the data's own unit
// (inches for caliper, feet for the rest). null means "no minimum".
const minimum = { caliper: null, height: null, spread: null, clearTrunk: null };

const FACET_LABEL = {
  container: "Container size",
  grades: "Grade and features",
  photos: "Photos",
  city: "City",
};

// The full list of options a facet offers, in order. Container, grade and
// photo options always show, even at zero, so a buyer can see the whole
// vocabulary. Cities come from the data.
function facetOptions(facet) {
  if (facet === "container") return CONTAINERS;
  if (facet === "grades") return GRADES;
  if (facet === "photos") return PHOTO_OPTIONS;
  return Array.from(new Set(LISTINGS.map(function (l) { return l.nursery.city; }))).sort();
}

// Which of a facet's values does this listing have? Always a list, because a
// listing can carry several grades.
function facetValues(listing, facet) {
  if (facet === "container") return [listing.container];
  if (facet === "grades") return listing.grades;
  if (facet === "photos") return [listing.photos > 0 ? "With photos" : "No photos"];
  return [listing.nursery.city];
}

// Does this listing meet the minimum for one spec? A listing that never
// gave that measurement can't prove it meets it, so it drops out.
function meetsSpec(listing, key) {
  if (minimum[key] === null) return true;
  return listing[key] !== undefined && listing[key] >= minimum[key];
}

// Does this listing pass every filter EXCEPT the one named?
// Leaving one filter out is what lets it show honest counts for its own
// options: ticking "3G" must not drop every other size's count to zero.
function passesFilters(listing, words, except) {
  if (words.length > 0 && !textMatches(listing.text, words)) return false;
  if (freshOnlyBox.checked && listing.days > FRESH_DAYS) return false;

  const ticksOk = TICK_FACETS.every(function (facet) {
    if (facet === except || chosen[facet].size === 0) return true;
    return facetValues(listing, facet).some(function (value) {
      return chosen[facet].has(value);
    });
  });
  if (!ticksOk) return false;

  return SPECS.every(function (spec) {
    return spec.key === except || meetsSpec(listing, spec.key);
  });
}

// ---------------------------------------------------------------------------
// 7. Sorting.
//    Freshest first is the default, and it stays the order however the
//    results are filtered: it is the reason to use this site. Where two
//    listings are equally fresh, the one with photos goes first.
// ---------------------------------------------------------------------------
function sortListings(rows, mode) {
  const sorted = rows.slice();

  function photosFirst(a, b) {
    return (b.photos > 0) - (a.photos > 0);
  }

  sorted.sort(function (a, b) {
    let order = 0;
    if (mode === "qty") order = b.quantity - a.quantity;
    else if (mode === "price") order = a.price - b.price;
    else if (mode === "plant") order = a.common.localeCompare(b.common) ||
      CONTAINERS.indexOf(a.container) - CONTAINERS.indexOf(b.container);
    else if (mode === "nursery") order = a.nursery.name.localeCompare(b.nursery.name) ||
      a.common.localeCompare(b.common);
    else order = a.days - b.days; // freshest first

    return order || photosFirst(a, b) || a.days - b.days;
  });

  return sorted;
}

// ---------------------------------------------------------------------------
// 8. Drawing the filter rail.
// ---------------------------------------------------------------------------
function renderFacet(facet, words) {
  const box = document.querySelector('[data-facet="' + facet + '"]');

  // Count how many listings each option would give, ignoring this facet's own
  // ticks so the numbers stay useful while you click.
  const counts = new Map();
  facetOptions(facet).forEach(function (value) { counts.set(value, 0); });
  LISTINGS.forEach(function (listing) {
    if (!passesFilters(listing, words, facet)) return;
    facetValues(listing, facet).forEach(function (value) {
      if (counts.has(value)) counts.set(value, counts.get(value) + 1);
    });
  });

  const rows = Array.from(counts.keys()).map(function (value) {
    const isOn = chosen[facet].has(value);
    const count = counts.get(value);
    return '<li>' +
      '<label class="flex items-center gap-2 py-1.5 lg:py-0.5 cursor-pointer select-none ' +
        (count === 0 && !isOn ? "opacity-40" : "") + '">' +
        '<input type="checkbox" data-filter="' + facet + '" value="' + escapeHtml(value) + '"' +
          (isOn ? " checked" : "") +
          ' class="w-3.5 h-3.5 rounded-sm border-ink-200 text-clay-600 focus:ring-clay-500 focus:ring-offset-0">' +
        '<span class="flex-1 min-w-0 truncate">' + escapeHtml(value) + '</span>' +
        '<span class="text-[11px] tabular-nums text-ink-400 dark:text-stone-400">' + count + '</span>' +
      '</label>' +
    '</li>';
  }).join("");

  box.innerHTML =
    '<div class="px-3 py-2.5 border-b border-ink-100 dark:border-ink-800">' +
      '<h3 class="text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-stone-400 mb-1.5">' +
        FACET_LABEL[facet] +
      '</h3>' +
      // The fixed lists show in full; only the city list, which grows with
      // the data, gets a scroll bar.
      '<ul class="text-[13px] space-y-px' + (facet === "city" ? " max-h-56 overflow-y-auto" : "") + '">' + rows + '</ul>' +
    '</div>';
}

// The spec boxes are fixed in directory.html; only their counts change.
// Each count is how many listings have that measurement and meet the
// minimum, given everything else that's switched on.
function renderSpecCounts(words) {
  SPECS.forEach(function (spec) {
    let count = 0;
    LISTINGS.forEach(function (listing) {
      if (!passesFilters(listing, words, spec.key)) return;
      if (listing[spec.key] === undefined) return;
      if (meetsSpec(listing, spec.key)) count++;
    });
    document.querySelector('[data-spec-count="' + spec.key + '"]').textContent = count;
  });
}

// The tags above the table showing what is currently filtered, each one a
// button that removes itself.
function renderActiveFilters() {
  const tags = [];

  if (freshOnlyBox.checked) {
    tags.push({ facet: "fresh", value: "", label: "Updated this week" });
  }
  TICK_FACETS.forEach(function (facet) {
    chosen[facet].forEach(function (value) {
      tags.push({ facet: facet, value: value, label: value });
    });
  });
  SPECS.forEach(function (spec) {
    if (minimum[spec.key] === null) return;
    const value = spec.unit === "in" ? minimum[spec.key] + '"' : feetText(minimum[spec.key]);
    tags.push({ facet: "spec", value: spec.key, label: spec.label + " ≥ " + value });
  });

  resetButton.classList.toggle("hidden", tags.length === 0);

  // The count beside "Filter" matters most when the panel is folded shut on a
  // phone: it is the only sign that results are being narrowed.
  filterCount.textContent = tags.length > 0 ? tags.length + " on" : "";
  filterCount.classList.toggle("hidden", tags.length === 0);

  activeFilterBox.innerHTML = tags.map(function (tag) {
    return '<button type="button" class="filter-tag" ' +
      'data-remove="' + tag.facet + '" data-value="' + escapeHtml(tag.value) + '">' +
      escapeHtml(tag.label) +
      '<span aria-hidden="true" class="text-ink-400">&times;</span>' +
      '<span class="sr-only">Remove filter</span>' +
    '</button>';
  }).join("");

  return tags.length > 0;
}

// ---------------------------------------------------------------------------
// 9. Drawing the table.
// ---------------------------------------------------------------------------

// A small camera after the plant name when the listing has photos.
function photoBadge(listing) {
  if (!listing.photos) return "";
  const label = listing.photos + (listing.photos === 1 ? " photo" : " photos");
  return '<svg class="inline-block w-3.5 h-3.5 ml-1 -mt-0.5 text-ink-400 dark:text-stone-400" viewBox="0 0 24 24" ' +
    'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'role="img" aria-label="' + label + '"><title>' + label + '</title>' +
    '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
}

function rowHtml(listing, words, index) {
  const style = TIER_STYLE[listing.tier];
  const n = listing.nursery;
  const specs = specText(listing);
  const grades = listing.grades.join(", ");

  // Container, specs and grade get their own columns on a wide screen (1280px
  // and up). Below that there isn't room, so they ride along under the plant name.
  const detailsMobile =
    '<span class="xl:hidden block text-[11px] text-ink-400 dark:text-stone-400 mt-0.5">' +
      escapeHtml([listing.container, specs, grades].filter(Boolean).join(" · ")) +
    '</span>';

  // On a phone the nursery column is hidden too, so its name goes here.
  const nurseryMobile =
    '<span class="sm:hidden block text-[12px] text-ink-700 dark:text-stone-300 mt-1">' +
      highlight(n.name, words) + " · " + highlight(n.city, words) +
    '</span>';

  const main =
    '<tr class="listing-row" data-row="' + index + '" tabindex="0" role="button" ' +
        'aria-expanded="false" aria-controls="detail-' + index + '">' +
      '<td class="py-2 pl-3 pr-3 align-top">' +
        '<span class="font-medium text-ink-900 dark:text-stone-100">' +
          highlight(listing.common, words) + "</span>" + photoBadge(listing) +
        '<span class="block italic text-[12px] text-ink-400 dark:text-stone-400">' +
          highlight(listing.botanical, words) + "</span>" +
        nurseryMobile + detailsMobile +
      "</td>" +

      '<td class="hidden sm:table-cell py-2 pr-3 align-top">' +
        '<span class="text-ink-800 dark:text-stone-200">' + highlight(n.name, words) + "</span>" +
        '<span class="block text-[12px] text-ink-400 dark:text-stone-400">' +
          highlight(n.city + ", " + n.state, words) + "</span>" +
      "</td>" +

      '<td class="hidden xl:table-cell py-2 pr-3 align-top whitespace-nowrap">' +
        escapeHtml(listing.container) + "</td>" +

      '<td class="hidden xl:table-cell py-2 pr-3 align-top whitespace-nowrap">' +
        '<span class="text-[12px] text-ink-700 dark:text-stone-300">' + escapeHtml(specs) + "</span></td>" +

      '<td class="hidden xl:table-cell py-2 pr-3 align-top">' +
        '<span class="text-[12px] text-ink-700 dark:text-stone-300">' + escapeHtml(grades) + "</span></td>" +

      '<td class="py-2 pr-3 align-top text-right tabular-nums font-medium whitespace-nowrap">' +
        listing.quantity.toLocaleString() + "</td>" +

      '<td class="py-2 pr-3 align-top text-right tabular-nums whitespace-nowrap">' +
        '<span class="font-medium text-ink-900 dark:text-stone-100">' + priceText(listing.price) + "</span>" +
      "</td>" +

      '<td class="py-2 pr-3 align-top text-right whitespace-nowrap">' +
        '<span class="inline-flex items-center gap-1.5 text-[12px] ' + style.text + '" ' +
              'title="' + escapeHtml(listing.updated || "no date given") + '">' +
          '<span class="w-1.5 h-1.5 rounded-full ' + style.dot + '"></span>' +
          agoShort(listing.days) +
        "</span></td>" +
    "</tr>";

  // Hidden until the row is clicked: the small print, and the way to order.
  // Prices are public, but ordering and contacting a grower need an account,
  // so the phone and email stay out of the page until sign-in exists.
  const detail =
    '<tr class="detail-row hidden" id="detail-' + index + '">' +
      '<td colspan="8" class="px-3 pb-3 pt-0">' +
        '<div class="rounded-md bg-cream dark:bg-ink-950/60 border border-ink-100 dark:border-ink-800 ' +
             'px-3 py-2.5 text-[13px] flex flex-wrap items-center gap-x-5 gap-y-1.5">' +
          '<a class="w-full sm:w-auto py-1 sm:py-0 font-medium text-clay-600 dark:text-clay-300 hover:underline" href="signin.html">' +
            "Sign in to order or contact this grower</a>" +
          '<span class="text-ink-400 dark:text-stone-400">' + MIN_ORDER + " minimum order · pay by bank transfer (ACH)</span>" +
          '<span class="text-ink-400 dark:text-stone-400">' + escapeHtml(n.specialties.join(" · ")) + "</span>" +
          '<span class="ml-auto ' + style.text + '">' + agoLong(listing.days) + "</span>" +
        "</div>" +
      "</td>" +
    "</tr>";

  return main + detail;
}

function tableHtml(rows, words) {
  const head =
    '<thead>' +
      '<tr class="text-left text-[11px] uppercase tracking-wider text-ink-400 dark:text-stone-400 ' +
          'bg-cream dark:bg-ink-950/50 border-b border-ink-100 dark:border-ink-800">' +
        '<th class="py-2 pl-3 pr-3 font-semibold">Plant</th>' +
        '<th class="hidden sm:table-cell py-2 pr-3 font-semibold">Nursery</th>' +
        '<th class="hidden xl:table-cell py-2 pr-3 font-semibold">Container</th>' +
        '<th class="hidden xl:table-cell py-2 pr-3 font-semibold">Specs</th>' +
        '<th class="hidden xl:table-cell py-2 pr-3 font-semibold">Grade</th>' +
        '<th class="py-2 pr-3 font-semibold text-right">Qty</th>' +
        '<th class="py-2 pr-3 font-semibold text-right">Price</th>' +
        '<th class="py-2 pr-3 font-semibold text-right">Updated</th>' +
      "</tr>" +
    "</thead>";

  const body = rows.map(function (listing, index) {
    return rowHtml(listing, words, index);
  }).join("");

  return '<div class="overflow-x-auto rounded-md border border-ink-100 dark:border-ink-800 ' +
              'bg-white dark:bg-ink-900">' +
    '<table class="w-full text-[13px] border-collapse">' + head +
      '<tbody>' + body + "</tbody>" +
    "</table></div>";
}

// What to show when nothing matched. Says which of the two reasons it was.
function emptyHtml(query, filtersAreOn) {
  const message = filtersAreOn
    ? '<p><strong class="text-ink-800 dark:text-stone-200">Nothing matches these filters</strong></p>' +
      '<p class="mt-1.5">Remove a filter above, or reset them all.</p>'
    : '<p><strong class="text-ink-800 dark:text-stone-200">No listings for &ldquo;' +
      escapeHtml(query) + "&rdquo;</strong></p>" +
      '<p class="mt-1.5">Try a shorter search, like <em>palm</em> or <em>oak</em>, or search by nursery or city.</p>';

  return '<div class="rounded-md border border-dashed border-ink-100 dark:border-ink-700 ' +
              'bg-white dark:bg-ink-900 px-4 py-10 text-center text-[13px] ' +
              'text-ink-400 dark:text-stone-400">' + message + "</div>";
}

// ---------------------------------------------------------------------------
// 10. Put it all together and draw the page.
// ---------------------------------------------------------------------------
function render() {
  const query = searchBox.value;
  clearButton.classList.toggle("hidden", query === "");
  const words = normalize(query).split(" ").filter(Boolean);

  // The rows that survive the search and every filter.
  const rows = sortListings(
    LISTINGS.filter(function (listing) {
      return passesFilters(listing, words, null);
    }),
    sortSelect.value
  );

  TICK_FACETS.forEach(function (facet) { renderFacet(facet, words); });
  renderSpecCounts(words);
  const filtersAreOn = renderActiveFilters();

  showResultsButton.textContent = rows.length === 0
    ? "No listings match"
    : "Show " + rows.length + (rows.length === 1 ? " listing" : " listings");

  if (rows.length === 0) {
    countLine.textContent = "";
    resultsBox.innerHTML = emptyHtml(query, filtersAreOn);
    return;
  }

  // Count the distinct nurseries on show, and how many rows are current.
  const nurseries = new Set();
  let fresh = 0;
  rows.forEach(function (listing) {
    nurseries.add(listing.nursery.id);
    if (listing.days <= FRESH_DAYS) fresh++;
  });

  countLine.textContent =
    rows.length.toLocaleString() + (rows.length === 1 ? " listing" : " listings") +
    " · " + nurseries.size + (nurseries.size === 1 ? " nursery" : " nurseries") +
    " · " + fresh + " updated this week";

  resultsBox.innerHTML = tableHtml(rows, words);
}

// ---------------------------------------------------------------------------
// 11. Wire up the controls, then draw the page for the first time.
// ---------------------------------------------------------------------------

// "input" fires on every keystroke, so results update as you type.
searchBox.addEventListener("input", render);
sortSelect.addEventListener("change", render);
freshOnlyBox.addEventListener("change", render);

clearButton.addEventListener("click", function () {
  searchBox.value = "";
  render();
  searchBox.focus();
});

// Read one spec box (and its ft/in choice, if it has one) into `minimum`,
// always stored in the data's unit.
function readSpec(key) {
  const box = document.querySelector('[data-spec="' + key + '"]');
  const unitBox = document.querySelector('[data-spec-unit="' + key + '"]');
  const value = parseFloat(box.value);
  if (isNaN(value) || value <= 0) {
    minimum[key] = null;
  } else {
    minimum[key] = unitBox && unitBox.value === "in" ? value / 12 : value;
  }
}

document.querySelectorAll("[data-spec], [data-spec-unit]").forEach(function (box) {
  box.addEventListener("input", function () {
    readSpec(box.getAttribute("data-spec") || box.getAttribute("data-spec-unit"));
    render();
  });
});

function clearSpec(key) {
  document.querySelector('[data-spec="' + key + '"]').value = "";
  const unitBox = document.querySelector('[data-spec-unit="' + key + '"]');
  if (unitBox) unitBox.value = "ft";
  minimum[key] = null;
}

// The filter rail is folded shut on a phone and open on a laptop. A <summary>
// toggles its panel when clicked, so the Reset button inside it has to say
// "this click was for me" or pressing Reset would also fold the panel.
const WIDE_SCREEN = window.matchMedia("(min-width: 1024px)");

function syncFilterPanel() {
  filterPanel.open = WIDE_SCREEN.matches;
}

WIDE_SCREEN.addEventListener("change", syncFilterPanel);

showResultsButton.addEventListener("click", function () {
  filterPanel.open = false;
  countLine.scrollIntoView({ behavior: "smooth", block: "start" });
});

resetButton.addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();

  TICK_FACETS.forEach(function (facet) { chosen[facet].clear(); });
  SPECS.forEach(function (spec) { clearSpec(spec.key); });
  freshOnlyBox.checked = false;
  render();
});

// One listener on the rail handles every tick box in it, including the ones
// app.js has not drawn yet.
document.addEventListener("change", function (event) {
  const facet = event.target.getAttribute && event.target.getAttribute("data-filter");
  if (!facet) return;

  if (event.target.checked) {
    chosen[facet].add(event.target.value);
  } else {
    chosen[facet].delete(event.target.value);
  }
  render();
});

// The removable tags above the table.
activeFilterBox.addEventListener("click", function (event) {
  const tag = event.target.closest("[data-remove]");
  if (!tag) return;

  const facet = tag.getAttribute("data-remove");
  if (facet === "fresh") {
    freshOnlyBox.checked = false;
  } else if (facet === "spec") {
    clearSpec(tag.getAttribute("data-value"));
  } else {
    chosen[facet].delete(tag.getAttribute("data-value"));
  }
  render();
});

// Clicking (or pressing Enter on) a listing opens its details underneath it.
function toggleRow(row) {
  const detail = row.nextElementSibling;
  if (!detail || !detail.classList.contains("detail-row")) return;

  const nowOpen = detail.classList.toggle("hidden") === false;
  row.setAttribute("aria-expanded", nowOpen ? "true" : "false");
  row.classList.toggle("is-open", nowOpen);
}

resultsBox.addEventListener("click", function (event) {
  // Let a link inside a row behave like a link.
  if (event.target.closest("a")) return;

  const row = event.target.closest(".listing-row");
  if (row) toggleRow(row);
});

resultsBox.addEventListener("keydown", function (event) {
  if (event.key !== "Enter" && event.key !== " ") return;

  const row = event.target.closest(".listing-row");
  if (!row) return;

  event.preventDefault();
  toggleRow(row);
});

// A search typed on the front page arrives in the address, as
// directory.html?q=clusia. Put it in the box so the results start filtered.
const startQuery = new URLSearchParams(window.location.search).get("q");
if (startQuery) searchBox.value = startQuery;

syncFilterPanel();
render();
