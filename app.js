/*
  app.js — the search behaviour.

  The flow is always the same three steps:
    1. Read what the visitor typed.
    2. Work out which nurseries match.
    3. Redraw the results area.

  The data comes from data/nurseries.js, which the page loads first and which
  puts everything in a variable called NURSERIES.
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

// ---------------------------------------------------------------------------
// 2. Small text helpers.
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
        previous[j] + 1,      // delete a letter
        current[j - 1] + 1,   // add a letter
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
// 3. The search itself.
// ---------------------------------------------------------------------------

// For one nursery, decide whether it matches and which plants to show.
// Returns null when the nursery doesn't match at all.
function searchNursery(nursery, words) {
  // The nursery's own details: name, city, state, specialties.
  const nurseryText = normalize(
    nursery.name + " " + nursery.city + " " + nursery.state + " " + nursery.specialties.join(" ")
  );

  // Plants whose common or botanical name matches.
  const matchingPlants = nursery.plants.filter(function (plant) {
    return textMatches(normalize(plant.common + " " + plant.botanical), words);
  });

  // Searching the nursery or city ("Loxahatchee") shows its whole list.
  if (textMatches(nurseryText, words)) {
    return { nursery: nursery, plants: nursery.plants, matchedNursery: true };
  }

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
      return { nursery: nursery, plants: nursery.plants, matchedNursery: true };
    });
  }

  const hits = [];
  NURSERIES.forEach(function (nursery) {
    const hit = searchNursery(nursery, words);
    if (hit) hits.push(hit);
  });
  return hits;
}

// ---------------------------------------------------------------------------
// 4. Drawing the results.
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
    safe = safe.replace(pattern, "<mark>$1</mark>");
  });
  return safe;
}

// Build the HTML for a single nursery card.
function cardHtml(hit, words) {
  const n = hit.nursery;

  const tags = n.specialties.map(function (s) {
    return '<span class="tag">' + escapeHtml(s) + "</span>";
  }).join("");

  const rows = hit.plants.map(function (plant) {
    return "<tr>" +
      "<td>" + highlight(plant.common, words) +
        '<span class="botanical">' + highlight(plant.botanical, words) + "</span></td>" +
      "<td>" + escapeHtml(plant.size) + "</td>" +
      '<td class="qty">' + plant.quantity.toLocaleString() + "</td>" +
    "</tr>";
  }).join("");

  // When only some plants matched, say so rather than implying it's the full list.
  const shownNote = hit.matchedNursery
    ? "Availability"
    : "Matching availability (" + hit.plants.length + " of " + n.plants.length + " items)";

  return '<article class="card">' +
    "<h2>" + highlight(n.name, words) + "</h2>" +
    '<p class="where">' + highlight(n.city + ", " + n.state, words) + "</p>" +
    '<div class="tags">' + tags + "</div>" +
    '<table class="plants">' +
      "<thead><tr>" +
        "<th>" + shownNote + "</th><th>Size</th><th>Qty</th>" +
      "</tr></thead>" +
      "<tbody>" + rows + "</tbody>" +
    "</table>" +
    '<div class="contact">' +
      "<span>" + escapeHtml(n.phone) + "</span>" +
      '<a href="mailto:' + escapeHtml(n.email) + '">' + escapeHtml(n.email) + "</a>" +
      '<a href="' + escapeHtml(n.website) + '" target="_blank" rel="noopener">Website</a>' +
      '<span class="min-order">Min. order ' + escapeHtml(n.minOrder) + "</span>" +
    "</div>" +
  "</article>";
}

// Put the results (or a friendly empty message) on the page.
function render(query) {
  const words = normalize(query).split(" ").filter(Boolean);
  const hits = runSearch(query);

  if (hits.length === 0) {
    countLine.textContent = "";
    resultsBox.innerHTML =
      '<div class="empty">' +
        "<p><strong>No matches for &ldquo;" + escapeHtml(query) + "&rdquo;</strong></p>" +
        "<p>Try a shorter search, like <em>palm</em> or <em>oak</em>, " +
        "or search by city.</p>" +
      "</div>";
    return;
  }

  // Count the plant rows we're actually showing.
  let plantCount = 0;
  hits.forEach(function (hit) { plantCount += hit.plants.length; });

  const nurseryWord = hits.length === 1 ? "nursery" : "nurseries";
  const itemWord = plantCount === 1 ? "item" : "items";
  countLine.textContent = hits.length + " " + nurseryWord + " · " + plantCount + " " + itemWord;

  resultsBox.innerHTML = hits.map(function (hit) {
    return cardHtml(hit, words);
  }).join("");
}

// ---------------------------------------------------------------------------
// 5. Wire up the controls, then draw the page for the first time.
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

// One listener on the container handles all the chips.
chipBox.addEventListener("click", function (event) {
  if (!event.target.classList.contains("chip")) return;
  searchBox.value = event.target.textContent;
  render(searchBox.value);
});

render("");
