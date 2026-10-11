/*
  inquiry.js — the "send an inquiry" box.

  The directory and a grower's profile both let a buyer message a grower.
  This file adds one pop-up box to the page and one function to open it:

    openInquiry(nursery)            a general question for the grower
    openInquiry(nursery, listing)   a question about one listing

  A buyer never sees a grower's phone or email. The message goes through
  PlantHub (store.js keeps it), and the grower gets the buyer's name, email
  and phone with it. Replies happen on inquiries.html.

  Load after shared.js and store.js.
*/

(function () {

  // ---- 1. Put the box on the page ----------------------------------------
  // A <dialog> is the browser's own pop-up: it dims the page behind it,
  // keeps the keyboard inside it, and closes on Escape.
  const dialog = document.createElement("dialog");
  dialog.className = "inquiry-dialog";
  dialog.setAttribute("aria-labelledby", "inquiry-title");
  dialog.innerHTML =
    '<form method="dialog" class="inquiry-close-form">' +
      '<button class="inquiry-close" aria-label="Close">&times;</button>' +
    "</form>" +

    // What a buyer sees: the form.
    '<div data-view="form">' +
      '<h2 id="inquiry-title" class="font-display font-semibold text-2xl tracking-tight">Send an inquiry</h2>' +
      '<p class="mt-1 text-sm text-ink-700 dark:text-stone-300">To <strong data-fill="nursery"></strong></p>' +
      '<p data-fill="about" class="mt-3 rounded-lg bg-cream dark:bg-ink-950 px-3 py-2 text-sm"></p>' +
      '<form id="inquiry-form" class="mt-4 space-y-4" novalidate>' +
        '<div data-part="quantity">' +
          '<label class="auth-label" for="inquiry-quantity">How many do you need? <span class="font-normal text-ink-400 dark:text-stone-400">(optional)</span></label>' +
          '<input class="auth-input" id="inquiry-quantity" type="number" min="1" step="1" inputmode="numeric">' +
        "</div>" +
        "<div>" +
          '<label class="auth-label" for="inquiry-text">Your message</label>' +
          '<textarea class="auth-input" id="inquiry-text" rows="4"></textarea>' +
          '<p class="auth-hint">The grower gets your name, email and phone with this, and replies here on PlantHub.</p>' +
        "</div>" +
        '<p id="inquiry-error" role="alert" hidden class="auth-error"></p>' +
        '<div class="flex flex-wrap gap-3">' +
          '<button type="submit" class="auth-button account-button-small">Send inquiry</button>' +
          '<button type="button" data-close class="auth-button auth-button-outline account-button-small">Cancel</button>' +
        "</div>" +
      "</form>" +
    "</div>" +

    // After sending.
    '<div data-view="sent" hidden>' +
      '<h2 class="font-display font-semibold text-2xl tracking-tight">Inquiry sent</h2>' +
      '<p class="mt-2 text-sm text-ink-700 dark:text-stone-300"><span data-fill="sent-nursery"></span> has your message. Their reply will show under Inquiries.</p>' +
      '<div class="mt-5 flex flex-wrap gap-3">' +
        '<a href="inquiries.html" class="auth-button account-button-small">View your inquiries</a>' +
        '<button type="button" data-close class="auth-button auth-button-outline account-button-small">Keep browsing</button>' +
      "</div>" +
    "</div>" +

    // Signed in with an account that can't send one.
    '<div data-view="seller" hidden>' +
      '<h2 class="font-display font-semibold text-2xl tracking-tight">Inquiries come from buyers</h2>' +
      '<p class="mt-2 text-sm text-ink-700 dark:text-stone-300">You\'re signed in with a <span data-fill="type"></span> account. To message a grower, sign in with a landscaper or personal account.</p>' +
      '<div class="mt-5"><button type="button" data-close class="auth-button auth-button-outline account-button-small">Close</button></div>' +
    "</div>";
  document.body.appendChild(dialog);

  const fill = function (name) { return dialog.querySelector('[data-fill="' + name + '"]'); };
  const view = function (name) {
    dialog.querySelectorAll("[data-view]").forEach(function (part) { part.hidden = part.dataset.view !== name; });
  };

  let target = null;   // { nursery, listing } the open box is about

  // ---- 2. Open it ----------------------------------------------------------
  window.openInquiry = function (nursery, listing) {
    const user = PH.currentUser();

    // Signed out: sign in first, then come back to this page.
    if (!user) {
      const here = location.pathname.split("/").pop() + location.search;
      location.href = "signin.html?next=" + encodeURIComponent(here);
      return;
    }

    if (!PH.canBuy()) {
      fill("type").textContent = user.typeName.toLowerCase();
      view("seller");
      dialog.showModal();
      return;
    }

    target = { nursery: nursery, listing: listing || null };
    fill("nursery").textContent = nursery.name;

    const about = fill("about");
    about.hidden = !listing;
    if (listing) {
      about.textContent = "About: " + listing.common + ", " + listing.container + ", " + priceText(listing.price) + " each";
    }
    dialog.querySelector('[data-part="quantity"]').hidden = !listing;

    document.getElementById("inquiry-quantity").value = "";
    document.getElementById("inquiry-text").value = "";
    document.getElementById("inquiry-error").hidden = true;
    view("form");
    dialog.showModal();
    document.getElementById("inquiry-text").focus();
  };

  // ---- 3. Send, and the ways to close ---------------------------------------
  document.getElementById("inquiry-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const listing = target.listing;
    const result = PH.sendInquiry({
      nurseryId: target.nursery.id,
      about: listing ? { common: listing.common, container: listing.container, price: listing.price } : null,
      quantity: listing ? document.getElementById("inquiry-quantity").value : "",
      text: document.getElementById("inquiry-text").value,
    });

    if (!result.ok) {
      const error = document.getElementById("inquiry-error");
      error.textContent = result.error;
      error.hidden = false;
      if (result.field) document.getElementById("inquiry-" + result.field).focus();
      return;
    }
    fill("sent-nursery").textContent = target.nursery.name;
    view("sent");
  });

  dialog.addEventListener("click", function (event) {
    // A click on the dimmed page around the box closes it, as does Cancel.
    if (event.target === dialog || event.target.closest("[data-close]")) dialog.close();
  });
})();
