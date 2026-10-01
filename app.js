/*
  app.js — the search behaviour.

  The flow is always the same three steps:
    1. Read what the visitor typed and which controls they set.
    2. Work out which nurseries and plants match.
    3. Redraw the results area.

  The data comes from data/nurseries.js, which the page loads first and which
  puts everything in a variable called NURSERIES.

  Every plant carries an "updated" date. Showing how old a listing is — plainly,
  on every row — is the thing this site does that the competition doesn't, so
  the date gets its own helpers (section 2) and its own badge (section 5).
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

// The long version, used on the nursery card: "Updated 2 days ago".
function agoLong(days) {
  if (days === Infinity) return "No date given";
  if (days === 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  if (days < 14) return "Updated " + days + " days ago";
  if (days < 60) return "Updated " + Math.round(days / 7) + " weeks ago";
  return "Updated " + Math.round(days / 30) + " months ago";
}

// The short version, used in the table where space is tight: "2d", "3w", "4mo".
function agoShort(days) {
  if (days === Infinity) return "—";
  if (days === 0) return "today";
  if (days < 14) return days + "d";
  if (days < 60) return Math.round(days / 7) + "w";
  return Math.round(days / 30) + "mo";
}

// The colours for each band. Kept in one place so the dot, the text and the
// card badge can never disagree with each other.
const TIER_STYLE = {
  fresh:  { dot: "bg-signal-500", text: "text-signal-700 dark:text-signal-400",
            chip: "bg-signal-50 dark:bg-signal-700/20 ring-signal-600/25" },
  recent: { dot: "bg-amber-500",   text: "text-amber-700 dark:text-amber-400",
            chip: "bg-amber-50 dark:bg-amber-950/40 ring-amber-600/20" },
  stale:  { dot: "bg-ink-400",   text: "text-ink-400 dark:text-stone-400",
            chip: "bg-ink-50 dark:bg-ink-800 ring-ink-400/25" },
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

// ---------------------------------------------------------------------------
// 4. The search itself.
// ---------------------------------------------------------------------------

// For one nursery, decide whether it matches and which plants to show.
// Returns null when the nursery doesn't match at all.
function searchNursery(nursery, words) {
  // The nursery's own details: name, city, state, specialties.
  const nurseryText = normalize(
    nursery.name + " " + nursery.city + " " + nursery.state + " " + nursery.specialties.join(" ")
  );

  // Searching the nursery or city ("Loxahatchee") shows its whole list.
  if (textMatches(nurseryText, words)) {
    return { nursery: nursery, plants: nursery.plants.slice(), matchedNursery: true };
  }

  // Otherwise, plants whose common or botanical name matches.
  const matchingPlants = nursery.plants.filter(function (plant) {
    return textMatches(normalize(plant.common + " " + plant.botanical), words);
  });

  if (matchingPlants.length > 0) {
    return { nursery: nursery, plants: matchingPlants, matchedNursery: false };
  }

  return null;
}

// Search every nursery and keep the ones that matched.
function runSearch(query) {
  const words = normalize(query).split(" ").filter(Boolean);

  // Empty search box: show everything, so the page never looks broken.
  if (words.length === 0) {
    return NURSERIES.map(function (nursery) {
      return { nursery: nursery, plants: nursery.plants.slice(), matchedNursery: true };
    });
  }

  const hits = [];
  NURSERIES.forEach(function (nursery) {
    const hit = searchNursery(nursery, words);
    if (hit) hits.push(hit);
  });
  return hits;
}

// Drop anything the visitor asked not to see, then put what's left in order.
function applyControls(hits) {
  let kept = hits;

  // "Updated this week only" throws away older rows, and then any nursery that
  // has nothing left to show.
  if (freshOnlyBox.checked) {
    kept = kept
      .map(function (hit) {
        const freshPlants = hit.plants.filter(function (plant) {
          return daysSince(plant.updated) <= FRESH_DAYS;
        });
        return { nursery: hit.nursery, plants: freshPlants, matchedNursery: hit.matchedNursery };
      })
      .filter(function (hit) {
        return hit.plants.length > 0;
      });
  }

  const mode = sortSelect.value;

  // Sort the rows inside each card the same way as the cards themselves, so the
  // page reads consistently top to bottom.
  kept.forEach(function (hit) {
    if (mode === "qty") {
      hit.plants.sort(function (a, b) { return b.quantity - a.quantity; });
    } else if (mode === "fresh") {
      hit.plants.sort(function (a, b) { return daysSince(a.updated) - daysSince(b.updated); });
    }
  });

  kept.sort(function (a, b) {
    if (mode === "name") {
      return a.nursery.name.localeCompare(b.nursery.name);
    }
    if (mode === "qty") {
      return totalQuantity(b.plants) - totalQuantity(a.plants);
    }
    return newestDays(a.plants) - newestDays(b.plants); // freshest first
  });

  return kept;
}

// The total number of plants on the rows we're showing.
function totalQuantity(plants) {
  return plants.reduce(function (sum, plant) { return sum + plant.quantity; }, 0);
}

// How many days since this nursery last touched any of the rows we're showing.
function newestDays(plants) {
  return plants.reduce(function (best, plant) {
    return Math.min(best, daysSince(plant.updated));
  }, Infinity);
}

// ---------------------------------------------------------------------------
// 5. Drawing the results.
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

// Wrap the searched words in <mark> so they appear highlighted.
function highlight(text, words) {
  let safe = escapeHtml(text);
  words.forEach(function (word) {
    if (word.length < 2) return;
    // "gi" = find every match, ignoring capital letters.
    const pattern = new RegExp("(" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
    safe = safe.replace(pattern, '<mark class="bg-clay-100 text-ink-900 dark:bg-clay-700 dark:text-cream rounded px-0.5">$1</mark>');
  });
  return safe;
}

// The coloured "Updated 2 days ago" badge that sits on the nursery card.
function freshnessBadge(days) {
  const style = TIER_STYLE[freshnessTier(days)];
  return '<span class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ring-1 ' +
      style.chip + " " + style.text + '">' +
      '<span class="w-1.5 h-1.5 rounded-full ' + style.dot + '"></span>' +
      escapeHtml(agoLong(days)) +
    "</span>";
}

// Build the HTML for a single nursery card.
function cardHtml(hit, words, index) {
  const n = hit.nursery;

  const tags = n.specialties.map(function (s) {
    return '<span class="text-[11px] uppercase tracking-wide font-medium text-ink-700 dark:text-ink-100 ' +
      'bg-sand dark:bg-ink-800 px-2.5 py-1 rounded-full">' + escapeHtml(s) + "</span>";
  }).join("");

  const rows = hit.plants.map(function (plant) {
    const days = daysSince(plant.updated);
    const style = TIER_STYLE[freshnessTier(days)];

    return '<tr class="border-b border-ink-50 dark:border-ink-800 last:border-0">' +
      '<td class="py-2.5 pr-3 align-top">' +
        '<span class="font-medium">' + highlight(plant.common, words) + "</span>" +
        '<span class="block italic text-[13px] text-ink-400 dark:text-stone-400">' +
          highlight(plant.botanical, words) + "</span></td>" +
      '<td class="py-2.5 pr-3 align-top whitespace-nowrap">' + escapeHtml(plant.size) + "</td>" +
      '<td class="py-2.5 pr-3 align-top whitespace-nowrap tabular-nums font-medium">' +
        plant.quantity.toLocaleString() + "</td>" +
      // The per-row age. The full date is in the tooltip for anyone who wants it.
      '<td class="py-2.5 align-top whitespace-nowrap text-right">' +
        '<span class="inline-flex items-center gap-1.5 text-xs ' + style.text + '" ' +
          'title="Last confirmed ' + escapeHtml(plant.updated || "never") + '">' +
          '<span class="w-1.5 h-1.5 rounded-full ' + style.dot + '"></span>' +
          escapeHtml(agoShort(days)) +
        "</span></td>" +
    "</tr>";
  }).join("");

  // When only some plants matched, say so rather than implying it's the full list.
  const shownNote = hit.matchedNursery
    ? "Availability"
    : "Matching availability (" + hit.plants.length + " of " + n.plants.length + " items)";

  return '<article class="card-rise group bg-white dark:bg-ink-900 ring-1 ring-ink-900/5 dark:ring-white/10 ' +
      'rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-5 sm:p-6" ' +
      'style="animation-delay:' + (index * 45) + 'ms">' +

    '<div class="flex flex-wrap items-start justify-between gap-3">' +
      "<div>" +
        '<h2 class="font-display text-xl font-semibold text-ink-900 dark:text-stone-100">' +
          highlight(n.name, words) + "</h2>" +
        '<p class="text-sm text-ink-400 dark:text-stone-400 mt-0.5">' +
          highlight(n.city + ", " + n.state, words) + "</p>" +
      "</div>" +
      freshnessBadge(newestDays(hit.plants)) +
    "</div>" +

    '<div class="flex flex-wrap gap-1.5 mt-3 mb-4">' + tags + "</div>" +

    '<div class="overflow-x-auto">' +
    '<table class="w-full text-sm border-collapse">' +
      '<thead><tr class="text-left text-[11px] uppercase tracking-wide text-ink-400 dark:text-stone-400 ' +
        'border-b border-ink-100 dark:border-ink-800">' +
        '<th class="pb-2 pr-3 font-semibold">' + escapeHtml(shownNote) + "</th>" +
        '<th class="pb-2 pr-3 font-semibold">Size</th>' +
        '<th class="pb-2 pr-3 font-semibold">Qty</th>' +
        '<th class="pb-2 font-semibold text-right">Updated</th>' +
      "</tr></thead>" +
      "<tbody>" + rows + "</tbody>" +
    "</table>" +
    "</div>" +

    '<div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 pt-4 ' +
      'border-t border-ink-50 dark:border-ink-800 text-sm">' +
      '<a class="font-medium text-ink-700 dark:text-stone-300 hover:text-clay-600 dark:hover:text-clay-300" ' +
        'href="tel:' + escapeHtml(n.phone.replace(/[^0-9+]/g, "")) + '">' + escapeHtml(n.phone) + "</a>" +
      '<a class="text-clay-600 dark:text-clay-300 hover:underline" href="mailto:' + escapeHtml(n.email) + '">' +
        escapeHtml(n.email) + "</a>" +
      '<a class="text-clay-600 dark:text-clay-300 hover:underline" href="' + escapeHtml(n.website) +
        '" target="_blank" rel="noopener">Website</a>' +
      '<span class="text-ink-400 dark:text-stone-400 ml-auto">Min. order ' + escapeHtml(n.minOrder) + "</span>" +
    "</div>" +
  "</article>";
}

// The message shown when nothing matched. The wording changes depending on
// whether it was the search or the freshness filter that emptied the page.
function emptyHtml(query, blamedOnFilter) {
  const body = blamedOnFilter
    ? "<p><strong class=\"text-ink-800 dark:text-stone-200\">Nothing updated in the last week</strong></p>" +
      "<p class=\"mt-1.5\">Untick <em>Updated this week only</em> to see older listings.</p>"
    : '<p><strong class="text-ink-800 dark:text-stone-200">No matches for &ldquo;' +
        escapeHtml(query) + '&rdquo;</strong></p>' +
      "<p class=\"mt-1.5\">Try a shorter search, like <em>palm</em> or <em>oak</em>, or search by city.</p>";

  return '<div class="bg-white dark:bg-ink-900 border border-dashed border-ink-100 dark:border-ink-700 ' +
    'rounded-2xl px-5 py-10 text-center text-ink-400 dark:text-stone-400">' + body + "</div>";
}

// Put the results (or a friendly empty message) on the page.
function render(query) {
  const words = normalize(query).split(" ").filter(Boolean);
  const matched = runSearch(query);
  const hits = applyControls(matched);

  if (hits.length === 0) {
    countLine.textContent = "";
    // If the search found something and the filter then removed it all, say so.
    resultsBox.innerHTML = emptyHtml(query, matched.length > 0);
    return;
  }

  // Count the plant rows we're actually showing.
  let plantCount = 0;
  let freshCount = 0;
  hits.forEach(function (hit) {
    plantCount += hit.plants.length;
    hit.plants.forEach(function (plant) {
      if (daysSince(plant.updated) <= FRESH_DAYS) freshCount++;
    });
  });

  const nurseryWord = hits.length === 1 ? "nursery" : "nurseries";
  const itemWord = plantCount === 1 ? "item" : "items";
  countLine.textContent =
    hits.length + " " + nurseryWord + " · " + plantCount + " " + itemWord +
    " · " + freshCount + " updated this week";

  resultsBox.innerHTML = hits.map(function (hit, index) {
    return cardHtml(hit, words, index);
  }).join("");
}

// ---------------------------------------------------------------------------
// 6. The totals in the hero. These describe the whole database, so they are
//    worked out once and never change as the visitor searches.
// ---------------------------------------------------------------------------
function renderStats() {
  let listings = 0;
  let fresh = 0;

  NURSERIES.forEach(function (nursery) {
    nursery.plants.forEach(function (plant) {
      listings++;
      if (daysSince(plant.updated) <= FRESH_DAYS) fresh++;
    });
  });

  document.getElementById("stat-nurseries").textContent = NURSERIES.length;
  document.getElementById("stat-listings").textContent = listings.toLocaleString();
  document.getElementById("stat-fresh").textContent = fresh.toLocaleString();
}

// ---------------------------------------------------------------------------
// 7. Wire up the controls, then draw the page for the first time.
// ---------------------------------------------------------------------------

// "input" fires on every keystroke, so results update as you type.
searchBox.addEventListener("input", function () {
  render(searchBox.value);
});

clearButton.addEventListener("click", function () {
  searchBox.value = "";
  render("");
  searchBox.focus();
});

sortSelect.addEventListener("change", function () {
  render(searchBox.value);
});

freshOnlyBox.addEventListener("change", function () {
  render(searchBox.value);
});

// One listener on the container handles all the chips.
chipBox.addEventListener("click", function (event) {
  if (!event.target.classList.contains("chip")) return;
  searchBox.value = event.target.textContent.trim();
  render(searchBox.value);
});

renderStats();
render("");
