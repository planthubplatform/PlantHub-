/*
  basket.js — the "add to order" box.

  The directory and a grower's page both let a buyer put a listing in their
  basket. This file adds one pop-up box to the page and one function to
  open it:

    openAddToOrder(nursery, listing)

  The box asks how many, says what that comes to, and puts the line in the
  basket (store.js keeps it). Nothing is paid here: the cart page is where
  an order is checked out, one grower at a time.

  Signed-out visitors are sent to sign in and brought back to the same
  listing. Growers and transport companies are told ordering is for buyers.

  Load after shared.js and store.js. It reuses the look of the inquiry box.
*/

(function () {

  // ---- 1. Put the box on the page ----------------------------------------
  // A <dialog> is the browser's own pop-up: it dims the page behind it,
  // keeps the keyboard inside it, and closes on Escape.
  const dialog = document.createElement("dialog");
  dialog.className = "inquiry-dialog";
  dialog.setAttribute("aria-labelledby", "add-title");
  dialog.innerHTML =
    '<form method="dialog" class="inquiry-close-form">' +
      '<button class="inquiry-close" aria-label="Close">&times;</button>' +
    "</form>" +

    // What a buyer sees: how many?
    '<div data-view="form">' +
      '<h2 id="add-title" class="font-display font-semibold text-2xl tracking-tight">Add to order</h2>' +
      '<p class="mt-1 text-sm text-ink-700 dark:text-stone-300">From <strong data-fill="nursery"></strong></p>' +
      '<p class="text-sm text-ink-700 dark:text-stone-300">Going into <strong data-fill="order"></strong> · <button type="button" data-switch class="auth-link">change</button></p>' +
      '<div class="mt-3 rounded-lg bg-cream dark:bg-ink-950 px-3 py-2 text-sm">' +
        '<p class="font-medium" data-fill="plant"></p>' +
        '<p class="text-[13px] text-ink-700 dark:text-stone-300" data-fill="detail"></p>' +
        '<p class="mt-1 text-[13px] text-ink-700 dark:text-stone-300" data-fill="stock"></p>' +
      "</div>" +
      '<form id="add-form" class="mt-4 space-y-4" novalidate>' +
        "<div>" +
          '<label class="auth-label" for="add-quantity">How many?</label>' +
          '<input class="auth-input" id="add-quantity" type="number" min="1" step="1" inputmode="numeric">' +
          '<p class="auth-hint" data-fill="total" aria-live="polite"></p>' +
        "</div>" +
        '<p id="add-error" role="alert" hidden class="auth-error"></p>' +
        '<div class="flex flex-wrap gap-3">' +
          '<button type="submit" class="auth-button account-button-small">Add to order</button>' +
          '<button type="button" data-close class="auth-button auth-button-outline account-button-small">Cancel</button>' +
        "</div>" +
      "</form>" +
    "</div>" +

    // No order open yet, or a different one wanted: pick one or name a new one.
    '<div data-view="pick" hidden>' +
      '<h2 class="font-display font-semibold text-2xl tracking-tight">Which order?</h2>' +
      '<form id="pick-form" class="mt-3 space-y-3" novalidate>' +
        '<div id="pick-list" class="space-y-2"></div>' +
        "<div>" +
          '<label class="auth-label" for="pick-name">Or start a new order</label>' +
          '<input class="auth-input" id="pick-name" maxlength="60" autocomplete="off" placeholder="The job it is for, like Smith residence">' +
        "</div>" +
        '<p id="pick-error" role="alert" hidden class="auth-error"></p>' +
        '<div class="flex flex-wrap gap-3">' +
          '<button type="submit" class="auth-button account-button-small">Continue</button>' +
          '<button type="button" data-close class="auth-button auth-button-outline account-button-small">Cancel</button>' +
        "</div>" +
      "</form>" +
    "</div>" +

    // After adding.
    '<div data-view="added" hidden>' +
      '<h2 class="font-display font-semibold text-2xl tracking-tight">Added to your order</h2>' +
      '<p class="mt-2 text-sm text-ink-700 dark:text-stone-300" data-fill="added"></p>' +
      '<p class="mt-2 text-sm text-ink-700 dark:text-stone-300" data-fill="minimum"></p>' +
      '<div class="mt-5 flex flex-wrap gap-3">' +
        '<a href="basket.html" class="auth-button account-button-small">Review this order</a>' +
        '<button type="button" data-close class="auth-button auth-button-outline account-button-small">Keep browsing</button>' +
      "</div>" +
    "</div>" +

    // Signed in with an account that can't order.
    '<div data-view="seller" hidden>' +
      '<h2 class="font-display font-semibold text-2xl tracking-tight">Ordering is for buyers</h2>' +
      '<p class="mt-2 text-sm text-ink-700 dark:text-stone-300">You\'re signed in with a <span data-fill="type"></span> account. To order plants, sign in with a landscaper or personal account.</p>' +
      '<div class="mt-5"><button type="button" data-close class="auth-button auth-button-outline account-button-small">Close</button></div>' +
    "</div>";
  document.body.appendChild(dialog);

  const fill = function (name) { return dialog.querySelector('[data-fill="' + name + '"]'); };
  const view = function (name) {
    dialog.querySelectorAll("[data-view]").forEach(function (part) { part.hidden = part.dataset.view !== name; });
  };
  const quantityBox = document.getElementById("add-quantity");
  const errorBox = document.getElementById("add-error");

  let target = null;   // { nursery, listing } the open box is about
  let addedAt = 0;     // when "Added to your cart" last appeared

  // "3 × $438 = $1,314.00", as the number is typed.
  function showTotal() {
    const quantity = Number(quantityBox.value);
    fill("total").textContent = Number.isInteger(quantity) && quantity > 0
      ? quantity.toLocaleString() + " × " + priceText(target.listing.price) + " = " + moneyText(quantity * target.listing.price)
      : "";
  }

  // ---- 2. Open it ----------------------------------------------------------
  window.openAddToOrder = function (nursery, listing) {
    const user = PH.currentUser();

    // Signed out: sign in first, then come back to this listing. The page
    // sees "open=" in its address and reopens this box.
    if (!user) {
      const page = location.pathname.split("/").pop() || "directory.html";
      const params = new URLSearchParams(location.search);
      const search = document.getElementById("search");
      if (page === "directory.html" && search && search.value) params.set("q", search.value);
      params.set("open", listing.id);
      location.href = "signin.html?next=" + encodeURIComponent(page + "?" + params.toString());
      return;
    }

    if (!PH.canBuy()) {
      fill("type").textContent = user.typeName.toLowerCase();
      view("seller");
      dialog.showModal();
      return;
    }

    target = { nursery: nursery, listing: listing };
    fill("nursery").textContent = nursery.name;
    fill("plant").textContent = listing.common;
    fill("detail").textContent = lineDetailText(listing);
    fill("stock").textContent = priceText(listing.price) + " each · " + listing.quantity.toLocaleString() + " available";

    quantityBox.max = listing.quantity;
    quantityBox.value = "1";
    errorBox.hidden = true;
    showTotal();
    if (PH.activeDraft()) showForm();
    else showPick();
    dialog.showModal();
  };

  function showForm() {
    fill("order").textContent = PH.activeDraft().name;
    view("form");
    quantityBox.select();
  }

  // The list of orders being put together, with the open one ticked.
  function showPick() {
    const drafts = PH.drafts();
    document.getElementById("pick-list").innerHTML = drafts.map(function (draft) {
      return '<label class="flex items-center gap-2 text-sm"><input type="radio" name="pick" value="' + escapeHtml(draft.id) + '" class="accent-clay-600"' +
             (draft.active ? " checked" : "") + "> " + escapeHtml(draft.name) + "</label>";
    }).join("");
    document.getElementById("pick-name").value = "";
    document.getElementById("pick-error").hidden = true;
    view("pick");
  }

  dialog.addEventListener("click", function (event) {
    if (event.target.closest("[data-switch]")) showPick();
  });

  document.getElementById("pick-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("pick-name").value.trim();
    const chosen = dialog.querySelector('input[name="pick"]:checked');
    const error = document.getElementById("pick-error");
    // A typed name starts a new order; otherwise the ticked one is used.
    const result = name ? PH.createDraft(name) : chosen ? PH.setActiveDraft(chosen.value) : { ok: false, error: "Pick an order, or type a name for a new one." };
    if (!result.ok) {
      error.textContent = result.error;
      error.hidden = false;
      return;
    }
    showForm();
  });

  // ---- 3. Add, and the ways to close ----------------------------------------
  quantityBox.addEventListener("input", showTotal);

  document.getElementById("add-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const quantity = quantityBox.value;
    const result = PH.addToBasket(target.nursery.id, target.listing.id, quantity);

    if (!result.ok) {
      errorBox.textContent = result.error;
      errorBox.hidden = false;
      quantityBox.focus();
      return;
    }

    const group = result.group;
    fill("added").textContent = Number(quantity).toLocaleString() + " × " + target.listing.common + " from " + target.nursery.name + ".";
    fill("minimum").textContent = group.ready
      ? "This order with this grower is " + moneyText(group.subtotal) + ", which meets the " + minOrderText() + " minimum."
      : "This order with this grower is " + moneyText(group.subtotal) + ". Add " + moneyText(group.short) + " more to reach the " + minOrderText() + " minimum.";
    view("added");
    addedAt = Date.now();

    // The cart count in the top corner has gone up.
    document.dispatchEvent(new Event("planthub:account-changed"));
  });

  dialog.addEventListener("click", function (event) {
    // "View your cart" and "Keep browsing" appear right where "Add to
    // order" was. The second press of a double-click would land on one of
    // them and whisk the message away unread, so presses in the first half
    // second after it appears are ignored.
    if (Date.now() - addedAt < 500) {
      event.preventDefault();
      return;
    }
    // A click on the dimmed page around the box closes it, as does Cancel.
    if (event.target === dialog || event.target.closest("[data-close]")) dialog.close();
  });
})();
