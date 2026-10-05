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
const chipBox = document.getElementById("chips");
const resultsBox = document.getElementById("results");
const countLine = document.getElementById("count");
const sortSelect = document.getElementById("sort");
const freshOnlyBox = document.getElementById("fresh-only");
const resetButton = document.getElementById("reset-filters");
const activeFilterBox = document.getElementById("active-filters");
const filterPanel = document.getElementById("filter-panel");
const filterCount = document.getElementById("filter-count");

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

// Wholesale price, as the trade writes it. A grower who won't publish a price
// gets "Call" rather than an invented number.
function priceText(price) {
  if (price === null || price === undefined) return null;
  return "$" + price.toFixed(2).replace(/\.00$/, "");
}

// ---------------------------------------------------------------------------
// 4. Flatten the data into one row per listing.
//    Done once, when the page loads. Everything below works on this list.
// ---------------------------------------------------------------------------
const LISTINGS = [];

NURSERIES.forEach(function (nursery) {
  nursery.plants.forEach(function (plant) {
    const days = daysSince(plant.updated);
    LISTINGS.push({
      nursery: nursery,
      common: plant.common,
      botanical: plant.botanical,
      size: plant.size,
      grade: plant.grade || "",
      quantity: plant.quantity,
      price: plant.price === undefined ? null : plant.price,
      updated: plant.updated,
      days: days,
      tier: freshnessTier(days),
      // Searchable text, worked out once so typing stays fast. The plant and
      // the place go in together, so "clusia loxahatchee" can find a row by
      // taking one word from each.
      text: normalize(
        plant.common + " " + plant.botanical + " " + plant.size + " " +
        (plant.grade || "") + " " + nursery.name + " " + nursery.city + " " +
        nursery.state + " " + nursery.specialties.join(" ")
      ),
    });
  });
});

// Container sizes have a trade order — liners, then gallon sizes smallest
// first, then field-grown material. Sorting them as plain text would put #100
// between #10 and #15, which no grower would recognise.
function sizeRank(size) {
  const s = size.toLowerCase();
  if (s.includes("liner")) return 0;
  if (s.includes("flat")) return 1;
  const gallons = s.match(/^#(\d+)/);
  if (gallons) return 10 + Number(gallons[1]);
  if (s.includes("caliper")) return 2000;
  if (s.includes("ct")) return 3000;
  return 4000;
}

// ---------------------------------------------------------------------------
// 5. The filters currently switched on.
//    A Set is a list that can't hold the same value twice — exactly what a
//    group of tick boxes needs.
// ---------------------------------------------------------------------------
const chosen = {
  size: new Set(),
  grade: new Set(),
  city: new Set(),
};

const FACET_LABEL = { size: "Container size", grade: "Grade", city: "City" };

// What value does this listing have for a given facet?
function facetValue(listing, facet) {
  if (facet === "size") return listing.size;
  if (facet === "grade") return listing.grade;
  return listing.nursery.city;
}

// Does this listing pass every filter EXCEPT the one named?
// Leaving one facet out is what lets a facet show honest counts for its own
// options: ticking "#7" must not drop every other size's count to zero.
function passesFilters(listing, words, except) {
  if (words.length > 0 && !textMatches(listing.text, words)) return false;
  if (freshOnlyBox.checked && listing.days > FRESH_DAYS) return false;

  return ["size", "grade", "city"].every(function (facet) {
    if (facet === except) return true;
    if (chosen[facet].size === 0) return true;
    return chosen[facet].has(facetValue(listing, facet));
  });
}

// ---------------------------------------------------------------------------
// 6. Sorting.
// ---------------------------------------------------------------------------
function sortListings(rows, mode) {
  const sorted = rows.slice();

  sorted.sort(function (a, b) {
    if (mode === "qty") return b.quantity - a.quantity;
    if (mode === "price") {
      // Rows with no published price go last whichever way you sort.
      if (a.price === null && b.price === null) return 0;
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return a.price - b.price;
    }
    if (mode === "plant") {
      return a.common.localeCompare(b.common) ||
             sizeRank(a.size) - sizeRank(b.size);
    }
    if (mode === "nursery") {
      return a.nursery.name.localeCompare(b.nursery.name) ||
             a.common.localeCompare(b.common);
    }
    return a.days - b.days; // freshest first
  });

  return sorted;
}

// ---------------------------------------------------------------------------
// 7. Drawing the filter rail.
// ---------------------------------------------------------------------------
function renderFacet(facet, words) {
  const box = document.querySelector('[data-facet="' + facet + '"]');

  // Count how many listings each option would give, ignoring this facet's own
  // ticks so the numbers stay useful while you click.
  const counts = new Map();
  LISTINGS.forEach(function (listing) {
    if (!passesFilters(listing, words, facet)) return;
    const value = facetValue(listing, facet);
    if (!value) return;
    counts.set(value, (counts.get(value) || 0) + 1);
  });

  // An option already ticked always stays on the list, even at zero, so it can
  // be un-ticked again.
  chosen[facet].forEach(function (value) {
    if (!counts.has(value)) counts.set(value, 0);
  });

  if (counts.size === 0) {
    box.innerHTML = "";
    return;
  }

  let values = Array.from(counts.keys());
  if (facet === "size") {
    values.sort(function (a, b) { return sizeRank(a) - sizeRank(b); });
  } else {
    values.sort(function (a, b) { return a.localeCompare(b); });
  }

  const rows = values.map(function (value) {
    const isOn = chosen[facet].has(value);
    const count = counts.get(value);
    return '<li>' +
      '<label class="flex items-center gap-2 py-0.5 cursor-pointer select-none ' +
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
    '<div class="px-3 py-2.5 border-b border-ink-100 dark:border-ink-800 last:border-0">' +
      '<h3 class="text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-stone-400 mb-1.5">' +
        FACET_LABEL[facet] +
      '</h3>' +
      '<ul class="text-[13px] space-y-px max-h-56 overflow-y-auto">' + rows + '</ul>' +
    '</div>';
}

// The tags above the table showing what is currently filtered, each one a
// button that removes itself.
function renderActiveFilters() {
  const tags = [];

  if (freshOnlyBox.checked) {
    tags.push({ facet: "fresh", value: "", label: "Updated this week" });
  }
  ["size", "grade", "city"].forEach(function (facet) {
    chosen[facet].forEach(function (value) {
      tags.push({ facet: facet, value: value, label: value });
    });
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
}

// ---------------------------------------------------------------------------
// 8. Drawing the table.
// ---------------------------------------------------------------------------
function rowHtml(listing, words, index) {
  const style = TIER_STYLE[listing.tier];
  const price = priceText(listing.price);
  const n = listing.nursery;

  // Size and grade get their own columns on a wide screen. On a phone there
  // isn't room, so they ride along under the plant name instead.
  const sizeGradeMobile =
    '<span class="lg:hidden block text-[11px] text-ink-400 dark:text-stone-400 mt-0.5">' +
      escapeHtml(listing.size) +
      (listing.grade ? " · " + escapeHtml(listing.grade) : "") +
    '</span>';

  const main =
    '<tr class="listing-row" data-row="' + index + '" tabindex="0" role="button" ' +
        'aria-expanded="false" aria-controls="detail-' + index + '">' +
      '<td class="py-2 pl-3 pr-3 align-top">' +
        '<span class="font-medium text-ink-900 dark:text-stone-100">' +
          highlight(listing.common, words) + "</span>" +
        '<span class="block italic text-[12px] text-ink-400 dark:text-stone-400">' +
          highlight(listing.botanical, words) + "</span>" +
        sizeGradeMobile +
      "</td>" +

      '<td class="py-2 pr-3 align-top">' +
        '<span class="text-ink-800 dark:text-stone-200">' + highlight(n.name, words) + "</span>" +
        '<span class="block text-[12px] text-ink-400 dark:text-stone-400">' +
          highlight(n.city + ", " + n.state, words) + "</span>" +
      "</td>" +

      '<td class="hidden lg:table-cell py-2 pr-3 align-top whitespace-nowrap">' +
        escapeHtml(listing.size) + "</td>" +

      '<td class="hidden lg:table-cell py-2 pr-3 align-top">' +
        '<span class="text-[12px] text-ink-700 dark:text-stone-300">' +
          escapeHtml(listing.grade) + "</span></td>" +

      '<td class="py-2 pr-3 align-top text-right tabular-nums font-medium whitespace-nowrap">' +
        listing.quantity.toLocaleString() + "</td>" +

      '<td class="py-2 pr-3 align-top text-right tabular-nums whitespace-nowrap">' +
        (price
          ? '<span class="font-medium text-ink-900 dark:text-stone-100">' + price + "</span>"
          : '<span class="text-[12px] text-ink-400 dark:text-stone-400">Call</span>') +
      "</td>" +

      '<td class="py-2 pr-3 align-top text-right whitespace-nowrap">' +
        '<span class="inline-flex items-center gap-1.5 text-[12px] ' + style.text + '" ' +
              'title="' + escapeHtml(listing.updated || "no date given") + '">' +
          '<span class="w-1.5 h-1.5 rounded-full ' + style.dot + '"></span>' +
          agoShort(listing.days) +
        "</span></td>" +
    "</tr>";

  // Hidden until the row is clicked: who to call, and the small print.
  const detail =
    '<tr class="detail-row hidden" id="detail-' + index + '">' +
      '<td colspan="7" class="px-3 pb-3 pt-0">' +
        '<div class="rounded-md bg-cream dark:bg-ink-950/60 border border-ink-100 dark:border-ink-800 ' +
             'px-3 py-2.5 text-[13px] flex flex-wrap items-center gap-x-5 gap-y-1.5">' +
          '<a class="font-medium text-ink-800 dark:text-stone-200 hover:text-clay-600" ' +
             'href="tel:' + escapeHtml(n.phone.replace(/[^0-9+]/g, "")) + '">' +
             escapeHtml(n.phone) + "</a>" +
          '<a class="text-clay-600 dark:text-clay-300 hover:underline" ' +
             'href="mailto:' + escapeHtml(n.email) + '">' + escapeHtml(n.email) + "</a>" +
          '<a class="text-clay-600 dark:text-clay-300 hover:underline" ' +
             'href="' + escapeHtml(n.website) + '" target="_blank" rel="noopener">Website</a>' +
          '<span class="text-ink-400 dark:text-stone-400">Min. order ' + escapeHtml(n.minOrder) + "</span>" +
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
        '<th class="py-2 pr-3 font-semibold">Nursery</th>' +
        '<th class="hidden lg:table-cell py-2 pr-3 font-semibold">Size</th>' +
        '<th class="hidden lg:table-cell py-2 pr-3 font-semibold">Grade</th>' +
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
// 9. Put it all together and draw the page.
// ---------------------------------------------------------------------------
function render() {
  const query = searchBox.value;
  const words = normalize(query).split(" ").filter(Boolean);

  // The rows that survive the search and every filter.
  const rows = sortListings(
    LISTINGS.filter(function (listing) {
      return passesFilters(listing, words, null);
    }),
    sortSelect.value
  );

  renderFacet("size", words);
  renderFacet("grade", words);
  renderFacet("city", words);
  renderActiveFilters();

  const filtersAreOn =
    freshOnlyBox.checked ||
    chosen.size.size > 0 || chosen.grade.size > 0 || chosen.city.size > 0;

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
// 10. The totals in the header. These describe the whole database, so they are
//     worked out once and never change as the visitor searches.
// ---------------------------------------------------------------------------
function renderStats() {
  let fresh = 0;
  LISTINGS.forEach(function (listing) {
    if (listing.days <= FRESH_DAYS) fresh++;
  });

  document.getElementById("stat-nurseries").textContent = NURSERIES.length;
  document.getElementById("stat-listings").textContent = LISTINGS.length.toLocaleString();
  document.getElementById("stat-fresh").textContent = fresh.toLocaleString();
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

// The filter rail is folded shut on a phone and open on a laptop. A <summary>
// toggles its panel when clicked, so the Reset button inside it has to say
// "this click was for me" or pressing Reset would also fold the panel.
const WIDE_SCREEN = window.matchMedia("(min-width: 1024px)");

function syncFilterPanel() {
  filterPanel.open = WIDE_SCREEN.matches;
}

WIDE_SCREEN.addEventListener("change", syncFilterPanel);

resetButton.addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();

  chosen.size.clear();
  chosen.grade.clear();
  chosen.city.clear();
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
  } else {
    chosen[facet].delete(tag.getAttribute("data-value"));
  }
  render();
});

// One listener on the chips row handles all the example searches.
chipBox.addEventListener("click", function (event) {
  if (!event.target.classList.contains("chip")) return;
  searchBox.value = event.target.textContent.trim();
  render();
});

// Clicking (or pressing Enter on) a listing opens the nursery's contact
// details underneath it.
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

syncFilterPanel();
renderStats();
render();
