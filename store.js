/*
  store.js — the pretend back end.

  PROTOTYPE ONLY. A real site keeps accounts on a server. This one has no
  server, so it keeps them in the browser's own storage (localStorage): a
  small notebook the browser holds for this site, on this computer only.
  Nothing here is sent anywhere, and clearing the browser's site data wipes
  it. Open the site in another browser and it starts empty again.

  Because of that, passwords are stored as plain text. That is fine for
  invented demo accounts and wrong for anything real: when real accounts
  arrive, this whole file is replaced by the account service.

  Every page loads this file. Other scripts use it through one object, PH:

    PH.currentUser()            the signed-in account, or null
    PH.signUp({ ... })          make an account and sign in
    PH.signIn(email, password)  sign in
    PH.signOut()
    PH.updateProfile({ ... })   change the signed-in account's details
    PH.changePassword(old, new)
    PH.resetPassword(email, new)
    PH.deleteAccount()
    PH.resetDemo()              wipe everything back to the demo accounts

    PH.nurseries()              every nursery with its listings, including
                                whatever growers have changed in this browser
    PH.myNursery()              the signed-in grower's own nursery
    PH.saveNursery({ ... })     change its name, city or specialties
    PH.saveListing({ ... })     add a listing, or change one (give its id)
    PH.removeListing(id)
    PH.confirmListing(id)       "still accurate": stamps it with today's date
    PH.confirmAll()

  Functions that can fail return { ok: true, ... } or { ok: false, error }.
*/

const PH = (function () {

  // ---- 1. Where things are kept ------------------------------------------
  const USERS_KEY = "planthub.users";
  const SESSION_KEY = "planthub.session";
  // Listings a grower has changed, as { nurseryId: { plants, profile } }.
  // A nursery that isn't in here still shows its sample listings.
  const INVENTORY_KEY = "planthub.inventory";
  // Nurseries made by growers who signed up here (the sample ones live in
  // data/nurseries.js).
  const NURSERIES_KEY = "planthub.nurseries";

  const ACCOUNT_TYPES = {
    landscaper:  { name: "Landscaper",  side: "Buyer" },
    personal:    { name: "Personal",    side: "Buyer" },
    grower:      { name: "Grower",      side: "Seller" },
    transporter: { name: "Transporter", side: "Seller" },
  };

  // One invented account of each type, so every part of the site can be
  // tried without signing up. The sign-in page lists them as one-click
  // buttons. The grower is tied to a sample nursery in data/nurseries.js.
  const DEMO_PASSWORD = "demo-only";
  const DEMO_USERS = [
    { id: "demo-landscaper",  type: "landscaper",  name: "Lena Landscaper (demo)",   email: "landscaper@demo.example" },
    { id: "demo-personal",    type: "personal",    name: "Pat Personal (demo)",      email: "personal@demo.example" },
    { id: "demo-grower",      type: "grower",      name: "Gus Grower (demo)",        email: "grower@demo.example", nurseryId: "acreage-palms" },
    { id: "demo-transporter", type: "transporter", name: "Tess Transporter (demo)",  email: "transporter@demo.example" },
  ];

  // ---- 2. Reading and writing --------------------------------------------
  // Some browsers refuse storage (private windows, blocked site data). Then
  // the site still works for the visit; it just forgets on the next page.
  const memory = {};
  function read(key) {
    try {
      const text = localStorage.getItem(key);
      return text ? JSON.parse(text) : null;
    } catch (error) {
      return memory[key] || null;
    }
  }
  // Returns false when the browser would not keep it, which in practice
  // means its storage is full (photos are the only big thing we store).
  function write(key, value) {
    memory[key] = value;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }
  function remove(key) {
    delete memory[key];
    try { localStorage.removeItem(key); } catch (error) { /* nothing to remove */ }
  }

  function seedUsers() {
    return DEMO_USERS.map(function (user) {
      return Object.assign({ password: DEMO_PASSWORD, demo: true, created: "2026-10-01" }, user);
    });
  }

  function users() {
    let list = read(USERS_KEY);
    if (!Array.isArray(list)) {
      list = seedUsers();
      write(USERS_KEY, list);
    }
    return list;
  }

  // ---- 3. Small helpers ---------------------------------------------------
  function cleanEmail(email) { return String(email || "").trim().toLowerCase(); }

  function looksLikeEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

  function findByEmail(email) {
    const wanted = cleanEmail(email);
    return users().find(function (user) { return user.email === wanted; }) || null;
  }

  // Never hand a password out to the page.
  function publicUser(user) {
    if (!user) return null;
    const copy = Object.assign({}, user);
    delete copy.password;
    copy.typeName = ACCOUNT_TYPES[user.type].name;
    copy.side = ACCOUNT_TYPES[user.type].side;
    return copy;
  }

  function saveUser(changed) {
    write(USERS_KEY, users().map(function (user) { return user.id === changed.id ? changed : user; }));
  }

  function signedInRecord() {
    const session = read(SESSION_KEY);
    if (!session) return null;
    return users().find(function (user) { return user.id === session.userId; }) || null;
  }

  function passwordProblem(password) {
    if (String(password || "").length < 8) return "Use a password of at least 8 characters.";
    return "";
  }

  // ---- 4. Accounts ---------------------------------------------------------
  function currentUser() { return publicUser(signedInRecord()); }

  function signUp(details) {
    const name = String(details.name || "").trim();
    const email = cleanEmail(details.email);

    if (!ACCOUNT_TYPES[details.type]) return { ok: false, error: "Choose what kind of account this is." };
    if (!name) return { ok: false, field: "name", error: "Enter your name." };
    if (!looksLikeEmail(email)) return { ok: false, field: "email", error: "Enter an email address, like name@example.com." };
    if (findByEmail(email)) return { ok: false, field: "email", error: "There is already an account with that email. Sign in instead." };
    const problem = passwordProblem(details.password);
    if (problem) return { ok: false, field: "password", error: problem };

    const user = {
      id: "user-" + Date.now().toString(36),
      type: details.type,
      name: name,
      email: email,
      password: details.password,
      created: today(),
    };
    if (details.taxExempt) user.taxExempt = details.taxExempt;

    write(USERS_KEY, users().concat([user]));
    write(SESSION_KEY, { userId: user.id });
    return { ok: true, user: publicUser(user) };
  }

  function signIn(email, password) {
    const user = findByEmail(email);
    // One message for both mistakes, so the page never confirms which
    // emails have accounts.
    if (!user || user.password !== password) {
      return { ok: false, error: "That email and password don't match an account." };
    }
    write(SESSION_KEY, { userId: user.id });
    return { ok: true, user: publicUser(user) };
  }

  function signInDemo(type) {
    const demo = DEMO_USERS.find(function (user) { return user.type === type; });
    if (!demo) return { ok: false, error: "No demo account of that kind." };
    // If the demo account was deleted or changed, put it back first.
    if (!users().some(function (user) { return user.id === demo.id; })) {
      write(USERS_KEY, users().concat(seedUsers().filter(function (user) { return user.id === demo.id; })));
    }
    write(SESSION_KEY, { userId: demo.id });
    return { ok: true, user: currentUser() };
  }

  function signOut() { remove(SESSION_KEY); }

  function updateProfile(changes) {
    const user = signedInRecord();
    if (!user) return { ok: false, error: "You are signed out." };

    const name = String(changes.name || "").trim();
    const email = cleanEmail(changes.email);
    if (!name) return { ok: false, field: "name", error: "Enter your name." };
    if (!looksLikeEmail(email)) return { ok: false, field: "email", error: "Enter an email address, like name@example.com." };
    const owner = findByEmail(email);
    if (owner && owner.id !== user.id) return { ok: false, field: "email", error: "Another account already uses that email." };

    user.name = name;
    user.email = email;
    user.phone = String(changes.phone || "").trim();
    user.business = String(changes.business || "").trim();
    saveUser(user);
    return { ok: true, user: publicUser(user) };
  }

  function changePassword(oldPassword, newPassword) {
    const user = signedInRecord();
    if (!user) return { ok: false, error: "You are signed out." };
    if (user.password !== oldPassword) return { ok: false, field: "old", error: "That isn't your current password." };
    const problem = passwordProblem(newPassword);
    if (problem) return { ok: false, field: "new", error: problem };
    user.password = newPassword;
    saveUser(user);
    return { ok: true };
  }

  // A real site emails a link to prove the address is yours. There is no
  // email here, so the prototype lets the new password be set directly.
  function resetPassword(email, newPassword) {
    const user = findByEmail(email);
    if (!user) return { ok: false, field: "email", error: "No account uses that email." };
    const problem = passwordProblem(newPassword);
    if (problem) return { ok: false, field: "new", error: problem };
    user.password = newPassword;
    saveUser(user);
    return { ok: true };
  }

  function deleteAccount() {
    const user = signedInRecord();
    if (!user) return { ok: false, error: "You are signed out." };
    // A nursery this grower created goes with them. Sample nurseries stay.
    if (user.nurseryId) {
      const extras = read(NURSERIES_KEY) || [];
      if (extras.some(function (nursery) { return nursery.id === user.nurseryId; })) {
        write(NURSERIES_KEY, extras.filter(function (nursery) { return nursery.id !== user.nurseryId; }));
        const inventory = read(INVENTORY_KEY) || {};
        delete inventory[user.nurseryId];
        write(INVENTORY_KEY, inventory);
      }
    }
    write(USERS_KEY, users().filter(function (other) { return other.id !== user.id; }));
    remove(SESSION_KEY);
    return { ok: true };
  }

  function resetDemo() {
    remove(SESSION_KEY);
    remove(INVENTORY_KEY);
    remove(NURSERIES_KEY);
    write(USERS_KEY, seedUsers());
  }

  // ---- 5. Nurseries and their listings -----------------------------------
  // The sample nurseries come from data/nurseries.js (the NURSERIES list).
  // Whatever a grower changes here is kept separately and laid on top, so
  // the sample file is never altered and "Reset the preview" undoes it all.

  // Today as "2026-10-09", by the clock on this computer.
  function today() {
    const now = new Date();
    return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  }

  function sampleNurseries() {
    return typeof NURSERIES === "undefined" ? [] : NURSERIES;
  }

  function nurseries() {
    const inventory = read(INVENTORY_KEY) || {};
    const extras = read(NURSERIES_KEY) || [];

    return sampleNurseries().concat(extras).map(function (nursery) {
      const changed = inventory[nursery.id] || {};
      const copy = Object.assign({}, nursery, changed.profile || {});
      // Sample listings have no id of their own, so they get one from
      // their place in the list.
      copy.plants = changed.plants || (nursery.plants || []).map(function (plant, index) {
        return Object.assign({ id: nursery.id + "-" + (index + 1) }, plant);
      });
      return copy;
    });
  }

  function findNursery(id) {
    return nurseries().find(function (nursery) { return nursery.id === id; }) || null;
  }

  // The signed-in grower's nursery. A grower who signed up here has none
  // yet, so the first call makes an empty one in their name.
  function myNursery() {
    const user = signedInRecord();
    if (!user || user.type !== "grower") return null;

    if (user.nurseryId) {
      const found = findNursery(user.nurseryId);
      if (found) return found;
    }

    const nursery = {
      id: "nursery-" + Date.now().toString(36),
      name: user.business || user.name,
      city: "",
      state: "FL",
      phone: user.phone || "",
      email: user.email,
      website: "",
      specialties: [],
      plants: [],
    };
    write(NURSERIES_KEY, (read(NURSERIES_KEY) || []).concat([nursery]));
    user.nurseryId = nursery.id;
    saveUser(user);
    return findNursery(nursery.id);
  }

  // Keep a change to one nursery. `change` gets that nursery's saved record
  // ({ plants, profile }) to alter.
  function changeMyNursery(change) {
    const nursery = myNursery();
    if (!nursery) return { ok: false, error: "Sign in with a grower account to manage inventory." };

    const inventory = read(INVENTORY_KEY) || {};
    const record = inventory[nursery.id] || {};
    if (!record.plants) record.plants = nursery.plants;
    const problem = change(record, nursery);
    if (problem) return problem;

    inventory[nursery.id] = record;
    if (!write(INVENTORY_KEY, inventory)) {
      return { ok: false, error: "This browser's storage is full. Remove a few photos and try again." };
    }
    return { ok: true, nursery: findNursery(nursery.id) };
  }

  function saveNursery(details) {
    const name = String(details.name || "").trim();
    const city = String(details.city || "").trim();
    if (!name) return { ok: false, field: "nursery-name", error: "Enter the nursery's name." };
    if (!city) return { ok: false, field: "nursery-city", error: "Enter the city, so buyers nearby can find you." };

    return changeMyNursery(function (record) {
      record.profile = {
        name: name,
        city: city,
        specialties: String(details.specialties || "").split(",").map(function (word) { return word.trim(); }).filter(Boolean),
      };
    });
  }

  // A number typed into a form, or undefined when the box was left empty.
  function optionalNumber(value) {
    if (value === "" || value === null || value === undefined) return undefined;
    const number = Number(value);
    return isNaN(number) ? NaN : number;
  }

  // Add a listing, or change the one with the given id. Either way it is
  // stamped with today's date: touching a listing is confirming it.
  function saveListing(details) {
    const common = String(details.common || "").trim();
    const quantity = Number(details.quantity);
    const price = Number(details.price);

    if (!common) return { ok: false, field: "common", error: "Enter the plant's common name." };
    if (!details.container) return { ok: false, field: "container", error: "Choose a container size." };
    if (details.quantity === "" || !Number.isInteger(quantity) || quantity < 0) {
      return { ok: false, field: "quantity", error: "Enter the exact number you have, as a whole number." };
    }
    if (!(price > 0)) return { ok: false, field: "price", error: "Enter the wholesale price per plant." };

    const specs = {};
    const specNames = { caliper: "Caliper", height: "Height", spread: "Spread", clearTrunk: "Clear trunk" };
    for (const key in specNames) {
      const number = optionalNumber(details[key]);
      if (number === undefined) continue;
      if (isNaN(number) || number <= 0) return { ok: false, field: key, error: specNames[key] + " must be a number above zero, or left empty." };
      specs[key] = number;
    }

    return changeMyNursery(function (record) {
      const photoList = Array.isArray(details.photoList) ? details.photoList : null;
      const existing = record.plants.find(function (plant) { return plant.id === details.id; });

      const plant = Object.assign({
        id: existing ? existing.id : "listing-" + Date.now().toString(36),
        common: common,
        botanical: String(details.botanical || "").trim(),
        container: details.container,
      }, specs, {
        grades: (details.grades || []).slice(),
        // A listing's photo count is the pictures added here; a sample
        // listing that was never given any keeps the count it came with.
        photos: photoList ? photoList.length : (existing ? existing.photos || 0 : 0),
        quantity: quantity,
        price: Math.round(price * 100) / 100,
        updated: today(),
      });
      if (photoList) plant.photoList = photoList;

      record.plants = existing
        ? record.plants.map(function (other) { return other.id === plant.id ? plant : other; })
        : [plant].concat(record.plants);
    });
  }

  function removeListing(id) {
    return changeMyNursery(function (record) {
      record.plants = record.plants.filter(function (plant) { return plant.id !== id; });
    });
  }

  function confirmListing(id) {
    return changeMyNursery(function (record) {
      record.plants = record.plants.map(function (plant) {
        return plant.id === id ? Object.assign({}, plant, { updated: today() }) : plant;
      });
    });
  }

  function confirmAll() {
    return changeMyNursery(function (record) {
      record.plants = record.plants.map(function (plant) { return Object.assign({}, plant, { updated: today() }); });
    });
  }

  // ---- 6. The account corner of every page ---------------------------------
  // A page marks where the corner goes with <div data-account-corner></div>.
  // Signed out it holds "Sign in"; signed in, the person's name (a link to
  // their account) and "Sign out".
  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function drawAccountCorner() {
    const user = currentUser();
    document.querySelectorAll("[data-account-corner]").forEach(function (corner) {
      if (!user) {
        corner.innerHTML = '<a href="signin.html" class="corner-button">Sign in</a>';
        return;
      }
      corner.innerHTML =
        '<a href="account.html" class="corner-name" title="Your account">' +
          '<span class="corner-initial" aria-hidden="true">' + escapeHtml(user.name.charAt(0).toUpperCase()) + "</span>" +
          '<span class="corner-text">' + escapeHtml(user.name) + "</span>" +
        "</a>" +
        '<button type="button" class="corner-button" data-sign-out>Sign out</button>';
    });
  }

  document.addEventListener("click", function (event) {
    if (!event.target.closest("[data-sign-out]")) return;
    signOut();
    // Pages that only make sense signed in send people back to the front.
    if (document.body.hasAttribute("data-needs-account")) location.href = "index.html";
    else location.reload();
  });

  // A page says this when the signed-in person's name changes.
  document.addEventListener("planthub:account-changed", drawAccountCorner);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", drawAccountCorner);
  else drawAccountCorner();

  // After signing in, go back to the page that asked for it. Only plain page
  // names from this site are accepted, never an outside address.
  function nextPage(fallback) {
    const wanted = new URLSearchParams(location.search).get("next") || "";
    return /^[a-z0-9-]+\.html([?#][\w=&%.+-]*)?$/i.test(wanted) ? wanted : fallback;
  }

  return {
    ACCOUNT_TYPES: ACCOUNT_TYPES,
    DEMO_USERS: DEMO_USERS,
    currentUser: currentUser,
    signUp: signUp,
    signIn: signIn,
    signInDemo: signInDemo,
    signOut: signOut,
    updateProfile: updateProfile,
    changePassword: changePassword,
    resetPassword: resetPassword,
    deleteAccount: deleteAccount,
    resetDemo: resetDemo,
    nextPage: nextPage,
    today: today,
    nurseries: nurseries,
    myNursery: myNursery,
    saveNursery: saveNursery,
    saveListing: saveListing,
    removeListing: removeListing,
    confirmListing: confirmListing,
    confirmAll: confirmAll,
    escapeHtml: escapeHtml,
  };
})();
