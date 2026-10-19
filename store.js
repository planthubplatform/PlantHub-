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

    PH.nursery(id)              one nursery, or null
    PH.canBuy()                 is a buyer account signed in?
    PH.sendInquiry({ ... })     a buyer's message to a grower
    PH.myInquiries()            the signed-in person's conversations
    PH.replyInquiry(id, text)
    PH.markInquiryRead(id)
    PH.unreadInquiries()        how many have a reply you haven't opened

    PH.createDraft(name)        start a named order; the directory adds to it
    PH.drafts()                 the buyer's orders still being put together
    PH.activeDraft()            the one the directory adds to, or null
    PH.setActiveDraft(id)
    PH.deleteDraft(id)
    PH.basket()                 the open order's plants, one group per grower
    PH.addToBasket(nurseryId, listingId, quantity)
    PH.setBasketQuantity(listingId, quantity)
    PH.removeFromBasket(listingId)
    PH.clearBasket()
    PH.basketCount()            how many lines are in it
    PH.tidyBasket()             drop what sold out since; returns what changed

    PH.BANKS                    the invented banks a buyer can "connect"
    PH.connectBank(name)        pretend to connect one; no details are typed
    PH.disconnectBank()

    PH.placeOrder(nurseryId)    turn one grower's group into an order
    PH.myOrders()               the signed-in person's orders, newest first
    PH.order(id)                one of them, or null
    PH.cantFill(id, listingId)  grower; takes a line off a placed order and
                                refunds the buyer for it
    PH.cancelOrder(id), PH.acceptOrder(id, agreed), PH.declineOrder(id)
                                kept for orders from before 19 Oct 2026;
                                new orders are placed and paid at once
    PH.choosePickup(id, date)   buyer, once the grower has accepted
    PH.cancelArrangement(id)    buyer: drop a pending pickup or delivery
                                request and choose again
    PH.deliveryOptions(id, city)  the carriers a buyer may pick, with costs
    PH.chooseDelivery(id, { city, carrierId, date })
    PH.confirmPickup(id)        grower: the buyer collected
    PH.confirmDelivery(id)      buyer: the plants arrived
    PH.checkProblem(id, { kind, listingId, quantity, note })   would it be accepted?
    PH.reportProblem(id, { kind, listingId, quantity, note })
    PH.answerProblem(id, problemId, "accept" or "dispute")
    PH.ordersWaiting()          how many orders need the signed-in person
    PH.awaitingByListing()      grower: plants held by orders not yet answered
    PH.previewCarrierAnswer(id, yes)  preview only: stand in for the carrier
    PH.previewGrower(id, action)  preview only: stand in for a sample grower
                                with no account to sign in as
    PH.previewSkipAhead(id)     preview only: jump past the 48-hour window

    PH.carriers()               every carrier, with `insured` worked out today
    PH.carrier(id)
    PH.deliveryCities()         the job-site cities a delivery can be priced to
    PH.myCarrierRules()         grower: who may deliver their orders
    PH.setCarrierApproved(carrierId, yes)
    PH.setCarrierBlocked(carrierId, yes)
    PH.setAllowAnyCarrier(yes)

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
  // Messages between buyers and growers. A buyer never gets a grower's
  // phone or email: contact goes through here, so it stays on PlantHub.
  const INQUIRIES_KEY = "planthub.inquiries";
  // What each buyer has collected but not yet ordered, as { userId: [lines] }.
  const BASKETS_KEY = "planthub.baskets";
  // Every order placed here, whoever placed it.
  const ORDERS_KEY = "planthub.orders";
  // Which carriers each grower lets deliver their orders, as
  // { nurseryId: { approved, allowAny, blocked } }.
  const CARRIER_RULES_KEY = "planthub.carrierRules";

  // The money rules, from the operating model in CLAUDE.md.
  const MIN_ORDER_DOLLARS = 250;   // per grower, on the plants
  const FEE_RATE = 0.03;           // PlantHub's commission, paid by the grower
  const PROBLEM_HOURS = 48;        // how long a buyer has to report a problem

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

    // An order nobody has answered doesn't outlive either side's account:
    // a buyer's is cancelled, a grower's is declined, and the plants go back.
    write(ORDERS_KEY, orders().map(function (order) {
      const asBuyer = order.buyerId === user.id;
      const asGrower = user.type === "grower" && !!user.nurseryId && order.nurseryId === user.nurseryId;
      if (order.state !== "awaiting" || (!asBuyer && !asGrower)) return order;
      const copy = JSON.parse(JSON.stringify(order));
      copy.state = asBuyer ? "cancelled" : "declined";
      giveBack(copy);
      note(copy, asBuyer
        ? "The buyer closed their account, so the order was cancelled. The buyer was not charged."
        : "The grower closed their account, so the order was declined. The buyer was not charged.");
      return copy;
    }));
    const baskets = read(BASKETS_KEY) || {};
    delete baskets[user.id];
    write(BASKETS_KEY, baskets);

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
    remove(INQUIRIES_KEY);
    remove(BASKETS_KEY);
    remove(ORDERS_KEY);
    remove(CARRIER_RULES_KEY);
    write(USERS_KEY, seedUsers());
  }

  // ---- 5. Nurseries and their listings -----------------------------------
  // The sample nurseries come from data/nurseries.js (the NURSERIES list).
  // Whatever a grower changes here is kept separately and laid on top, so
  // the sample file is never altered and "Reset the preview" undoes it all.

  // Today as "2026-10-09", by the clock on this computer.
  function today() { return isoDay(new Date()); }

  // A date as "2026-10-09".
  function isoDay(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }

  // The day that is this many days from today (a minus number is the past).
  function dayFromToday(days) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return isoDay(date);
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
      // A grade taken off the list (like "Staked") also comes off any listing
      // saved in this browser before it was removed.
      if (typeof GRADES !== "undefined") {
        copy.plants = copy.plants.map(function (plant) {
          if (!plant.grades) return plant;
          return Object.assign({}, plant, { grades: plant.grades.filter(function (grade) { return GRADES.indexOf(grade) !== -1; }) });
        });
      }
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
    // Plants in an order the grower hasn't answered would have nowhere to
    // go back to if that order were then declined.
    const held = awaitingByListing()[id];
    if (held) {
      return { ok: false, error: held.toLocaleString() + " of these are held by an order waiting for your answer. Accept or decline that order first." };
    }
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

  // ---- 6. Inquiries -------------------------------------------------------
  // One inquiry is a short conversation: a buyer asks a grower something,
  // usually about one listing, and either side can reply.

  // One invented conversation, so the demo grower's inbox isn't empty.
  function seedInquiries() {
    const yesterday = new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString();
    return [{
      id: "inquiry-demo",
      nurseryId: "acreage-palms",
      nurseryName: "Sample Grower 01 (Palms)",
      about: { common: "Sabal Palm", container: "Field Grown", price: 438 },
      quantity: 40,
      buyerId: "demo-landscaper",
      buyer: { name: "Lena Landscaper (demo)", email: "landscaper@demo.example", phone: "", business: "" },
      messages: [{
        from: "buyer",
        at: yesterday,
        text: "Do you have 40 of these at 18 feet, and could they be ready for pickup the week of the 20th?",
      }],
      read: { buyer: yesterday },
    }];
  }

  function inquiries() {
    let list = read(INQUIRIES_KEY);
    if (!Array.isArray(list)) {
      list = seedInquiries();
      write(INQUIRIES_KEY, list);
    }
    return list;
  }

  function canBuy() {
    const user = signedInRecord();
    return !!user && ACCOUNT_TYPES[user.type].side === "Buyer";
  }

  // Which side of a conversation the signed-in person is on, or "" if
  // it isn't theirs.
  function sideOf(inquiry, user) {
    if (!user) return "";
    if (inquiry.buyerId === user.id) return "buyer";
    if (user.type === "grower" && user.nurseryId && inquiry.nurseryId === user.nurseryId) return "grower";
    return "";
  }

  function lastMessage(inquiry) { return inquiry.messages[inquiry.messages.length - 1]; }

  function isUnread(inquiry, side) {
    const last = lastMessage(inquiry);
    return last.from !== side && (!inquiry.read[side] || inquiry.read[side] < last.at);
  }

  function sendInquiry(details) {
    const user = signedInRecord();
    const text = String(details.text || "").trim();
    if (!user) return { ok: false, error: "Sign in to send an inquiry." };
    if (!canBuy()) return { ok: false, error: "Inquiries are sent from buyer accounts." };
    const nursery = findNursery(details.nurseryId);
    if (!nursery) return { ok: false, error: "That grower is no longer listed." };
    if (!text) return { ok: false, field: "text", error: "Write a message for the grower." };

    let quantity;
    if (details.quantity !== "" && details.quantity !== undefined && details.quantity !== null) {
      quantity = Number(details.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return { ok: false, field: "quantity", error: "Quantity must be a whole number, or left empty." };
      }
    }

    const now = new Date().toISOString();
    const inquiry = {
      id: "inquiry-" + Date.now().toString(36),
      nurseryId: nursery.id,
      nurseryName: nursery.name,
      about: details.about || null,
      quantity: quantity,
      buyerId: user.id,
      // What the grower is given about the buyer, as it was when sent.
      buyer: { name: user.name, email: user.email, phone: user.phone || "", business: user.business || "" },
      messages: [{ from: "buyer", at: now, text: text }],
      read: { buyer: now },
    };
    write(INQUIRIES_KEY, [inquiry].concat(inquiries()));
    return { ok: true, inquiry: inquiry };
  }

  // The signed-in person's conversations, most recently active first. Each
  // comes back with `side` (which end they are) and `unread`.
  function myInquiries() {
    const user = signedInRecord();
    return inquiries().map(function (inquiry) {
      const side = sideOf(inquiry, user);
      return side ? Object.assign({}, inquiry, { side: side, unread: isUnread(inquiry, side) }) : null;
    }).filter(Boolean).sort(function (a, b) {
      return lastMessage(a).at < lastMessage(b).at ? 1 : -1;
    });
  }

  function changeInquiry(id, change) {
    const user = signedInRecord();
    let result = { ok: false, error: "That conversation isn't yours." };
    const list = inquiries().map(function (inquiry) {
      const side = inquiry.id === id ? sideOf(inquiry, user) : "";
      if (!side) return inquiry;
      const copy = JSON.parse(JSON.stringify(inquiry));
      result = change(copy, side) || { ok: true };
      return result.ok ? copy : inquiry;
    });
    if (result.ok) write(INQUIRIES_KEY, list);
    return result;
  }

  function replyInquiry(id, text) {
    const words = String(text || "").trim();
    return changeInquiry(id, function (inquiry, side) {
      if (!words) return { ok: false, error: "Write a reply first." };
      const now = new Date().toISOString();
      inquiry.messages.push({ from: side, at: now, text: words });
      inquiry.read[side] = now;
    });
  }

  function markInquiryRead(id) {
    return changeInquiry(id, function (inquiry, side) {
      inquiry.read[side] = new Date().toISOString();
    });
  }

  function unreadInquiries() {
    return myInquiries().filter(function (inquiry) { return inquiry.unread; }).length;
  }

  // ---- 7. Carriers ---------------------------------------------------------
  // A carrier trucks an order from the grower to the buyer's job site. The
  // sample carriers come from data/carriers.js (the CARRIERS list) and the
  // sample mileage from data/distances.js. Only pages that deal with
  // deliveries load those files; on any other page these lists are empty.

  function sampleCarriers() {
    return typeof CARRIERS === "undefined" ? [] : CARRIERS;
  }

  function carriers() {
    // Deliveries finished here are added to each carrier's sample count.
    const finished = {};
    orders().forEach(function (order) {
      (order.jobs || []).forEach(function (job) {
        if (job.status === "delivered") finished[job.carrierId] = (finished[job.carrierId] || 0) + 1;
      });
    });

    return sampleCarriers().map(function (carrier) {
      const copy = Object.assign({ blockedNurseries: [] }, carrier);
      // The samples give their insurance date as a count of days from today.
      if (!copy.insuranceExpires) copy.insuranceExpires = dayFromToday(carrier.insuranceInDays || 0);
      // Worked out afresh every time and never stored: the day the insurance
      // lapses, the carrier drops out without anyone doing anything.
      copy.insured = copy.insuranceExpires >= today();
      copy.completedDeliveries = (carrier.completedDeliveries || 0) + (finished[carrier.id] || 0);
      return copy;
    });
  }

  function findCarrier(id) {
    return carriers().find(function (carrier) { return carrier.id === id; }) || null;
  }

  function deliveryCities() {
    return typeof DELIVERY_CITIES === "undefined" ? [] : DELIVERY_CITIES.slice();
  }

  // Sample miles between two cities, or null if either isn't in the list.
  function milesFrom(from, to) {
    return typeof milesBetween === "function" ? milesBetween(from, to) : null;
  }

  // Who a grower lets deliver their orders. Plants that arrive dead are the
  // grower's cost, so the safe way round is the default: only carriers the
  // grower has ticked. A grower can also switch on "any carrier I haven't
  // blocked". Every sample grower starts with nobody ticked, except the demo
  // grower, so that a delivery can be tried straight away.
  const DEMO_APPROVED = { "acreage-palms": ["carrier-01", "carrier-02", "carrier-03"] };

  function carrierRules(nurseryId) {
    const saved = (read(CARRIER_RULES_KEY) || {})[nurseryId];
    return Object.assign({ approved: (DEMO_APPROVED[nurseryId] || []).slice(), allowAny: false, blocked: [] }, saved || {});
  }

  // The carriers a buyer may pick for an order from this nursery: insured
  // today, blocked by neither side, and either ticked by the grower or let
  // in by the grower's "any carrier" switch.
  function allowedCarriers(nurseryId) {
    const rules = carrierRules(nurseryId);
    return carriers().filter(function (carrier) {
      if (!carrier.insured) return false;
      if (rules.blocked.indexOf(carrier.id) !== -1) return false;
      if (carrier.blockedNurseries.indexOf(nurseryId) !== -1) return false;
      return rules.allowAny || rules.approved.indexOf(carrier.id) !== -1;
    });
  }

  // The signed-in grower's rules, with every carrier and where it stands.
  function myCarrierRules() {
    const user = signedInRecord();
    if (!user || user.type !== "grower") return null;
    const nursery = myNursery();
    const rules = carrierRules(nursery.id);
    const allowed = allowedCarriers(nursery.id).map(function (carrier) { return carrier.id; });

    return {
      allowAny: rules.allowAny,
      offered: allowed.length,
      // Can a delivery from this nursery's city be priced at all?
      cityKnown: milesFrom(nursery.city, nursery.city) !== null,
      city: nursery.city,
      carriers: carriers().map(function (carrier) {
        return {
          carrier: carrier,
          approved: rules.approved.indexOf(carrier.id) !== -1,
          blocked: rules.blocked.indexOf(carrier.id) !== -1,
          blockedYou: carrier.blockedNurseries.indexOf(nursery.id) !== -1,
          offered: allowed.indexOf(carrier.id) !== -1,
        };
      }),
    };
  }

  function changeMyCarrierRules(change) {
    const user = signedInRecord();
    if (!user || user.type !== "grower") return { ok: false, error: "Sign in with a grower account to change delivery settings." };
    const nursery = myNursery();
    const all = read(CARRIER_RULES_KEY) || {};
    const rules = carrierRules(nursery.id);
    const problem = change(rules);
    if (problem) return problem;
    all[nursery.id] = rules;
    write(CARRIER_RULES_KEY, all);
    return { ok: true, rules: myCarrierRules() };
  }

  function without(list, value) {
    return list.filter(function (other) { return other !== value; });
  }

  function setCarrierApproved(carrierId, yes) {
    return changeMyCarrierRules(function (rules) {
      if (!findCarrier(carrierId)) return { ok: false, error: "That carrier is no longer listed." };
      if (yes && rules.blocked.indexOf(carrierId) !== -1) return { ok: false, error: "Unblock this carrier before approving it." };
      rules.approved = without(rules.approved, carrierId);
      if (yes) rules.approved.push(carrierId);
    });
  }

  // Blocking also takes the tick away: a blocked carrier is never offered.
  function setCarrierBlocked(carrierId, yes) {
    return changeMyCarrierRules(function (rules) {
      if (!findCarrier(carrierId)) return { ok: false, error: "That carrier is no longer listed." };
      rules.blocked = without(rules.blocked, carrierId);
      if (yes) {
        rules.blocked.push(carrierId);
        rules.approved = without(rules.approved, carrierId);
      }
    });
  }

  function setAllowAnyCarrier(yes) {
    return changeMyCarrierRules(function (rules) { rules.allowAny = !!yes; });
  }

  // ---- 8. The cart --------------------------------------------------------
  // A buyer collects listings from any number of growers in one basket. It
  // is shown grouped by grower, because each grower's group becomes its own
  // order: its own $250 minimum, its own pickup or delivery, its own payout.
  // The cart keeps only which listing and how many; the price is read
  // from the listing each time, so it is always the grower's current one.

  function cents(amount) { return Math.round(amount * 100) / 100; }

  // "$1,250.00", for the notes written on an order's timeline.
  function dollars(amount) {
    return "$" + Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // "2026-10-20" -> "20 Oct"
  function niceDay(isoDate) {
    const date = new Date(isoDate + "T12:00:00");
    return isNaN(date) ? isoDate : date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  // A buyer keeps any number of named orders being put together ("drafts").
  // Stored per buyer as { active: <draft id>, drafts: [{ id, name, lines }] }.
  // The directory adds plants to the active one. Older saves held a plain
  // list of lines; that becomes one draft called "My order".
  function draftBook() {
    const user = signedInRecord();
    if (!user) return { active: "", drafts: [] };
    let book = (read(BASKETS_KEY) || {})[user.id];
    if (Array.isArray(book)) {
      book = book.length ? { active: "d1", drafts: [{ id: "d1", name: "My order", lines: book }] } : null;
    }
    if (!book || !Array.isArray(book.drafts)) return { active: "", drafts: [] };
    if (!book.drafts.some(function (draft) { return draft.id === book.active; })) book.active = book.drafts.length ? book.drafts[0].id : "";
    return book;
  }

  function saveDraftBook(book) {
    const user = signedInRecord();
    if (!user) return;
    const all = read(BASKETS_KEY) || {};
    if (book.drafts.length) all[user.id] = book;
    else delete all[user.id];
    write(BASKETS_KEY, all);
  }

  function activeDraft() {
    const book = draftBook();
    return book.drafts.find(function (draft) { return draft.id === book.active; }) || null;
  }

  // The lines of the order being put together.
  function basketLines() {
    const draft = activeDraft();
    return draft ? draft.lines : [];
  }

  function saveBasketLines(lines) {
    const book = draftBook();
    const draft = book.drafts.find(function (other) { return other.id === book.active; });
    if (!draft) return;
    draft.lines = lines;
    saveDraftBook(book);
  }

  // Start a new named order and make it the one the directory adds to.
  function createDraft(nameText) {
    const user = signedInRecord();
    if (!user) return { ok: false, error: "Sign in to order." };
    if (!canBuy()) return { ok: false, error: "Orders are placed from buyer accounts." };
    const name = String(nameText || "").trim();
    if (!name) return { ok: false, field: "name", error: "Give the order a name, like the job it is for." };
    if (name.length > 60) return { ok: false, field: "name", error: "Keep the name under 60 letters." };
    const book = draftBook();
    if (book.drafts.some(function (draft) { return draft.name.toLowerCase() === name.toLowerCase(); })) {
      return { ok: false, field: "name", error: "You already have an order called " + name + ". Pick another name." };
    }
    let number = 1;
    while (book.drafts.some(function (draft) { return draft.id === "d" + number; })) number++;
    const draft = { id: "d" + number, name: name, lines: [] };
    book.drafts.push(draft);
    book.active = draft.id;
    saveDraftBook(book);
    return { ok: true, draft: draft };
  }

  // Every order being put together, with how many lines and what it comes to.
  function drafts() {
    const book = draftBook();
    return book.drafts.map(function (draft) {
      let total = 0;
      draft.lines.forEach(function (line) {
        const found = findListing(line.nurseryId, line.listingId);
        if (found) total += Math.min(line.quantity, found.plant.quantity) * found.plant.price;
      });
      const growers = {};
      draft.lines.forEach(function (line) { growers[line.nurseryId] = true; });
      return { id: draft.id, name: draft.name, count: draft.lines.length, growers: Object.keys(growers).length, total: cents(total), active: draft.id === book.active };
    });
  }

  function setActiveDraft(id) {
    const book = draftBook();
    if (!book.drafts.some(function (draft) { return draft.id === id; })) return { ok: false, error: "That order is gone." };
    book.active = id;
    saveDraftBook(book);
    return { ok: true };
  }

  function deleteDraft(id) {
    const book = draftBook();
    book.drafts = book.drafts.filter(function (draft) { return draft.id !== id; });
    saveDraftBook(book);
    return { ok: true };
  }

  function findListing(nurseryId, listingId) {
    const nursery = findNursery(nurseryId);
    const plant = nursery ? nursery.plants.find(function (other) { return other.id === listingId; }) : null;
    return plant ? { nursery: nursery, plant: plant } : null;
  }

  // The cart, one group per grower:
  //   { nurseryId, nurseryName, nursery, lines, subtotal, short, ready }
  // `short` is how many dollars the group is under the minimum, and `ready`
  // says it can be checked out. Each line has the live listing, the
  // quantity wanted and how many the grower has right now.
  function basket() {
    const groups = [];
    basketLines().forEach(function (line) {
      const found = findListing(line.nurseryId, line.listingId);
      let group = groups.find(function (other) { return other.nurseryId === line.nurseryId; });
      if (!group) {
        group = { nurseryId: line.nurseryId, nurseryName: line.nurseryName, nursery: findNursery(line.nurseryId), lines: [], subtotal: 0 };
        if (group.nursery) group.nurseryName = group.nursery.name;
        groups.push(group);
      }
      const available = found ? found.plant.quantity : 0;
      const quantity = Math.min(line.quantity, available);
      const total = found ? cents(quantity * found.plant.price) : 0;
      group.lines.push({
        listingId: line.listingId,
        name: found ? found.plant.common : line.name,
        listing: found ? found.plant : null,
        wanted: line.quantity,
        quantity: quantity,
        available: available,
        total: total,
      });
      group.subtotal = cents(group.subtotal + total);
    });

    groups.forEach(function (group) {
      group.short = cents(Math.max(0, MIN_ORDER_DOLLARS - group.subtotal));
      group.ready = group.short === 0;
    });
    return groups;
  }

  // Stock moves while plants sit in a basket: another buyer orders some, or
  // the grower changes the count. This brings the cart back in line and
  // reports what it changed, so the cart page can say so once.
  function tidyBasket() {
    const notes = [];
    const kept = [];
    basketLines().forEach(function (line) {
      const found = findListing(line.nurseryId, line.listingId);
      const available = found ? found.plant.quantity : 0;
      if (available < 1) {
        notes.push(line.name + " from " + line.nurseryName + " is no longer available, so it was removed from your order.");
      } else if (available < line.quantity) {
        notes.push(line.nurseryName + " now has " + available.toLocaleString() + " of " + line.name +
                   ", so your " + line.quantity.toLocaleString() + " was changed to " + available.toLocaleString() + ".");
        kept.push(Object.assign({}, line, { quantity: available }));
      } else {
        kept.push(line);
      }
    });
    if (notes.length) saveBasketLines(kept);
    return notes;
  }

  function basketCount() { return basketLines().length; }

  // A quantity typed into a box, as a whole number of at least 1, or null.
  function wholeNumber(value) {
    if (value === "" || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isInteger(number) && number >= 1 ? number : null;
  }

  function addToBasket(nurseryId, listingId, quantityText) {
    const user = signedInRecord();
    if (!user) return { ok: false, error: "Sign in to order." };
    if (!canBuy()) return { ok: false, error: "Orders are placed from buyer accounts." };
    if (!activeDraft()) return { ok: false, field: "order", error: "Create an order first, then add plants to it." };

    const found = findListing(nurseryId, listingId);
    if (!found || found.plant.quantity < 1) return { ok: false, error: "That listing is no longer available." };
    const quantity = wholeNumber(quantityText);
    if (!quantity) return { ok: false, field: "quantity", error: "Enter how many you want, as a whole number." };

    const lines = basketLines();
    const existing = lines.find(function (line) { return line.listingId === listingId; });
    const already = existing ? existing.quantity : 0;
    if (already + quantity > found.plant.quantity) {
      return {
        ok: false, field: "quantity",
        error: "The grower has " + found.plant.quantity.toLocaleString() + " of these" +
               (already ? ", and " + already.toLocaleString() + (already === 1 ? " is" : " are") + " already in this order." : "."),
      };
    }

    if (existing) existing.quantity = already + quantity;
    else lines.push({ nurseryId: nurseryId, nurseryName: found.nursery.name, listingId: listingId, name: found.plant.common, quantity: quantity });
    saveBasketLines(lines);
    return { ok: true, group: basket().find(function (group) { return group.nurseryId === nurseryId; }) };
  }

  function setBasketQuantity(listingId, quantityText) {
    const lines = basketLines();
    const line = lines.find(function (other) { return other.listingId === listingId; });
    if (!line) return { ok: false, error: "That line is no longer in your order." };
    const found = findListing(line.nurseryId, listingId);
    const quantity = wholeNumber(quantityText);
    if (!quantity) return { ok: false, error: "Enter a whole number of at least 1, or remove the line." };
    if (!found || quantity > found.plant.quantity) {
      return { ok: false, error: "The grower has " + (found ? found.plant.quantity.toLocaleString() : "none") + " of these." };
    }
    line.quantity = quantity;
    saveBasketLines(lines);
    return { ok: true };
  }

  function removeFromBasket(listingId) {
    saveBasketLines(basketLines().filter(function (line) { return line.listingId !== listingId; }));
    return { ok: true };
  }

  function clearBasket() {
    if (signedInRecord()) saveBasketLines([]);
    return { ok: true };
  }

  // ---- 9. Paying -------------------------------------------------------------
  // PlantHub is bank transfer (ACH) only: no cards anywhere. A real site
  // hands the buyer to its payments provider to connect a bank. Here the
  // buyer picks one of these invented banks and that is the whole step:
  // no account number, no routing number, nothing typed, nothing moved.
  const BANKS = [
    { name: "Sample Bank", last4: "1234" },
    { name: "Example Credit Union", last4: "5678" },
    { name: "Demo Savings Bank", last4: "9012" },
    { name: "Placeholder Trust", last4: "3456" },
  ];

  function connectBank(name) {
    const user = signedInRecord();
    if (!user) return { ok: false, error: "Sign in to connect a bank." };
    if (!canBuy()) return { ok: false, error: "Only buyer accounts pay for orders." };
    const bank = BANKS.find(function (other) { return other.name === name; });
    if (!bank) return { ok: false, field: "bank", error: "Choose a bank from the list." };
    user.bank = { name: bank.name, last4: bank.last4 };
    saveUser(user);
    return { ok: true, user: publicUser(user) };
  }

  function disconnectBank() {
    const user = signedInRecord();
    if (!user) return { ok: false, error: "You are signed out." };
    delete user.bank;
    saveUser(user);
    return { ok: true, user: publicUser(user) };
  }

  // ---- 10. Orders -------------------------------------------------------------
  // One order is one buyer buying from one grower. What is kept:
  //
  //   state      "accepted"   placed and paid. The buyer's bank is charged at
  //                           checkout and PlantHub holds the money. There is
  //                           no grower approval: keeping listings accurate
  //                           is the grower's job (owner, 19 Oct 2026).
  //              "cancelled"  nothing left on it: the grower couldn't fill
  //                           any of it, and the buyer was refunded
  //              "awaiting", "declined"  older orders from before 19 Oct,
  //                           when a grower accepted or declined each one.
  //                           orders() turns "awaiting" into "accepted".
  //   method     null until the buyer chooses, then "pickup" or "delivery"
  //   jobs       every delivery asked of a carrier, in order. The last one
  //              is the current one unless it was declined or withdrawn.
  //   confirmedAt  when the grower confirmed the pickup, or the buyer the
  //              delivery. The payout is released then, and the buyer's
  //              48 hours to report a problem start.
  //   problems   short counts and wrong grades the buyer reported, and
  //              lines the grower couldn't fill ("unfilled")
  //   events     the order's history in plain words, for both sides to read
  //
  // The words a page shows ("Ready for pickup", "Delivered") and the money
  // are worked out from these by describeOrder, so every page agrees.

  // Orders saved before 19 Oct 2026 may still be "awaiting" a grower's
  // answer that no longer exists; they are read as placed and paid.
  function orders() {
    return (read(ORDERS_KEY) || []).map(function (order) {
      return order.state === "awaiting" ? Object.assign({}, order, { state: "accepted" }) : order;
    });
  }

  // Orders are numbered PH-1001, PH-1002 and so on.
  function nextOrderId(list) {
    const highest = list.reduce(function (most, order) {
      return Math.max(most, Number(String(order.id).replace("PH-", "")) || 0);
    }, 1000);
    return "PH-" + (highest + 1);
  }

  // Which end of an order the signed-in person is on, or "" if it isn't theirs.
  function orderSide(order, user) {
    if (!user) return "";
    if (order.buyerId === user.id) return "buyer";
    if (user.type === "grower" && user.nurseryId && order.nurseryId === user.nurseryId) return "grower";
    return "";
  }

  // The delivery that is live right now, if there is one.
  function currentJob(order) {
    const jobs = order.jobs || [];
    const last = jobs[jobs.length - 1];
    return last && ["requested", "accepted", "delivered"].indexOf(last.status) !== -1 ? last : null;
  }

  // When the buyer's time to report a problem runs out. (`windowClosed` is
  // set only by the preview's "skip ahead" tool, further down.)
  function problemDeadline(order) {
    if (order.windowClosed) return order.confirmedAt;
    return new Date(new Date(order.confirmedAt).getTime() + PROBLEM_HOURS * 60 * 60 * 1000).toISOString();
  }

  // An order as a page needs it: the stored order plus
  //   side         "buyer" or "grower": who is looking
  //   status       one word for where it stands
  //   statusLabel  the same in plain words
  //   job          the live delivery, or null
  //   money        every amount, already added up
  //   needsYou     is the next move the signed-in person's?
  //   canReport    can the buyer still report a problem?
  function describeOrder(order, user) {
    const copy = JSON.parse(JSON.stringify(order));
    const job = currentJob(copy);
    const confirmed = !!copy.confirmedAt;
    const deadline = confirmed ? problemDeadline(copy) : null;
    const windowOpen = confirmed && new Date().toISOString() < deadline;
    const unsettled = copy.problems.some(function (problem) { return problem.status === "waiting" || problem.status === "disputed"; });
    const waitingOnGrower = copy.problems.some(function (problem) { return problem.status === "waiting"; });

    let status = copy.state;
    let label = "Placed";
    if (copy.state === "declined") label = "Declined";
    else if (copy.state === "cancelled") label = "Cancelled";
    else if (copy.state === "accepted") {
      if (confirmed && (windowOpen || unsettled)) {
        status = copy.method === "pickup" ? "picked-up" : "delivered";
        label = copy.method === "pickup" ? "Picked up" : "Delivered";
      } else if (confirmed) {
        status = "complete"; label = "Complete";
      } else if (copy.method === "pickup") {
        status = "pickup"; label = "Ready for pickup";
      } else if (job && job.status === "accepted") {
        status = "delivery-booked"; label = "Delivery booked";
      } else if (job) {
        status = "delivery-requested"; label = "Delivery requested";
      }
    }

    // A short count is refunded at the unit price, and PlantHub's 3% is
    // taken on what the buyer ends up paying for the plants. An order that
    // was declined or cancelled costs nobody anything.
    const live = copy.state === "awaiting" || copy.state === "accepted";
    const refunds = cents(copy.problems.reduce(function (sum, problem) { return sum + (problem.refund || 0); }, 0));
    const net = cents(copy.subtotal - refunds);
    const fee = live ? cents(net * FEE_RATE) : 0;
    const delivery = job ? job.cost : 0;
    const owner = growerAccount(copy.nurseryId);

    copy.side = orderSide(order, user);
    copy.status = status;
    copy.statusLabel = label;
    copy.job = job;
    copy.live = live;
    copy.money = {
      subtotal: copy.subtotal,
      refunds: refunds,
      delivery: delivery,
      // What the buyer pays in the end, delivery included.
      total: live ? cents(net + delivery) : 0,
      // The buyer's payment: "paid", "refunded" (charged, then everything
      // given back) or "none".
      payment: copy.state === "accepted" ? "paid" : refunds ? "refunded" : "none",
    };
    // PlantHub's fee and the payout are the grower's business. They are
    // only put on the copy a grower gets, so a buyer's page can't show them.
    if (copy.side === "grower") {
      copy.money.fee = fee;
      copy.money.payout = live ? cents(net - fee) : 0;
      // "none", "held" by PlantHub, or "released".
      copy.money.payoutState = copy.state !== "accepted" ? "none" : confirmed ? "released" : "held";
    }
    copy.growerHasAccount = !!owner;
    copy.growerIsDemo = !!owner && !!owner.demo;
    copy.problemDeadline = deadline;
    copy.canReport = copy.side === "buyer" && windowOpen;
    copy.needsYou =
      (copy.side === "buyer" && status === "accepted") ||
      (copy.side === "grower" && waitingOnGrower);
    // Can the grower still take a line off ("can't fill")? Only until the
    // plants are handed over.
    copy.canUnfill = copy.side === "grower" && copy.state === "accepted" && !confirmed;
    return copy;
  }

  // The signed-in person's orders: the ones waiting on them first, then
  // the newest.
  function myOrders() {
    const user = signedInRecord();
    return orders().map(function (order) { return describeOrder(order, user); })
      .filter(function (order) { return order.side; })
      .sort(function (a, b) {
        if (a.needsYou !== b.needsYou) return a.needsYou ? -1 : 1;
        return a.placedAt < b.placedAt ? 1 : -1;
      });
  }

  function findOrder(id) {
    return myOrders().find(function (order) { return order.id === id; }) || null;
  }

  function ordersWaiting() {
    return myOrders().filter(function (order) { return order.needsYou; }).length;
  }

  // For the grower's inventory page: how many of each listing are held by
  // orders the grower hasn't answered yet, as { listingId: quantity }.
  function awaitingByListing() {
    const held = {};
    myOrders().forEach(function (order) {
      if (order.side !== "grower" || order.state !== "awaiting") return;
      order.lines.forEach(function (line) { held[line.listingId] = (held[line.listingId] || 0) + line.quantity; });
    });
    return held;
  }

  // Take plants off a nursery's listings, or put them back. `changes` is
  // { listingId: how many to add (a minus number takes away) }. An order
  // changes the count but not the "updated" date: only the grower saying a
  // listing is accurate makes it fresh.
  function changeStock(nurseryId, changes) {
    const nursery = findNursery(nurseryId);
    if (!nursery) return false;
    const inventory = read(INVENTORY_KEY) || {};
    const record = inventory[nurseryId] || {};
    if (!record.plants) record.plants = nursery.plants;
    record.plants = record.plants.map(function (plant) {
      if (!changes[plant.id]) return plant;
      return Object.assign({}, plant, { quantity: Math.max(0, plant.quantity + changes[plant.id]) });
    });
    inventory[nurseryId] = record;
    return write(INVENTORY_KEY, inventory);
  }

  function giveBack(order) {
    const changes = {};
    order.lines.forEach(function (line) { changes[line.listingId] = (changes[line.listingId] || 0) + line.quantity; });
    changeStock(order.nurseryId, changes);
  }

  function placeOrder(nurseryId) {
    const user = signedInRecord();
    if (!user) return { ok: false, error: "Sign in to order." };
    if (!canBuy()) return { ok: false, error: "Orders are placed from buyer accounts." };

    const group = basket().find(function (other) { return other.nurseryId === nurseryId; });
    if (!group || !group.lines.length) return { ok: false, error: "There is nothing from this grower in your order." };
    if (!group.nursery) return { ok: false, error: "That grower is no longer listed." };
    const moved = group.lines.find(function (line) { return line.quantity < 1 || line.quantity !== line.wanted; });
    if (moved) return { ok: false, error: "The stock of " + moved.name + " has changed. Go back to your order and check the quantities." };
    if (!group.ready) return { ok: false, error: "This grower's order is under the $" + MIN_ORDER_DOLLARS + " minimum." };
    if (!user.bank) return { ok: false, field: "bank", error: "Connect a bank before placing the order." };

    const list = orders();
    const now = new Date().toISOString();
    const order = {
      id: nextOrderId(list),
      placedAt: now,
      // Placed is paid: no grower approval.
      state: "accepted",
      acceptedAt: now,
      buyerId: user.id,
      // What the grower is given about the buyer, as it was when ordered.
      buyer: { name: user.name, email: user.email, phone: user.phone || "", business: user.business || "" },
      nurseryId: nurseryId,
      nurseryName: group.nursery.name,
      nurseryCity: group.nursery.city,
      nurseryState: group.nursery.state,
      // Each line is a copy of the listing as it was, price included, so
      // the order doesn't change if the grower edits the listing later.
      lines: group.lines.map(function (line) {
        const plant = line.listing;
        return {
          listingId: plant.id, common: plant.common, botanical: plant.botanical || "",
          container: plant.container, caliper: plant.caliper, height: plant.height,
          spread: plant.spread, clearTrunk: plant.clearTrunk, grades: plant.grades || [],
          price: plant.price, quantity: line.quantity, total: line.total,
        };
      }),
      subtotal: group.subtotal,
      bank: { name: user.bank.name, last4: user.bank.last4 },
      method: null,
      jobs: [],
      problems: [],
      events: [{ at: now, text: "Order placed. The buyer's bank was charged " + dollars(group.subtotal) + ", and PlantHub is holding the money until the plants are picked up or delivered." }],
    };

    if (!write(ORDERS_KEY, [order].concat(list))) {
      return { ok: false, error: "This browser's storage is full, so the order could not be saved." };
    }

    // The plants come off the listings now: they are sold.
    const changes = {};
    order.lines.forEach(function (line) { changes[line.listingId] = -line.quantity; });
    changeStock(nurseryId, changes);

    const rest = basketLines().filter(function (line) { return line.nurseryId !== nurseryId; });
    if (rest.length) saveBasketLines(rest);
    else deleteDraft(draftBook().active);
    return { ok: true, order: findOrder(order.id) };
  }

  // Change one order. `sides` lists who may ("buyer", "grower"); `change`
  // gets a copy to alter and returns nothing, or { ok: false, error }.
  function changeOrder(id, sides, change) {
    const user = signedInRecord();
    let result = { ok: false, error: "That order isn't yours to change." };
    const list = orders().map(function (order) {
      if (order.id !== id || sides.indexOf(orderSide(order, user)) === -1) return order;
      const copy = JSON.parse(JSON.stringify(order));
      result = change(copy) || { ok: true };
      return result.ok ? copy : order;
    });
    if (result.ok) {
      write(ORDERS_KEY, list);
      result.order = findOrder(id);
    }
    return result;
  }

  function note(order, text) {
    order.events.push({ at: new Date().toISOString(), text: text });
  }

  function cancelOrder(id) {
    return changeOrder(id, ["buyer"], function (order) {
      if (order.state !== "awaiting") return { ok: false, error: "The grower has already answered this order, so it can't be cancelled here." };
      order.state = "cancelled";
      giveBack(order);
      note(order, "The buyer cancelled the order. The buyer was not charged, and the plants went back on the listing.");
    });
  }

  // The grower says yes. `agreed` is the checkbox on the conditions (plants
  // that arrive dead are the grower's cost): accepted with every order.
  function accept(order, agreed) {
    if (order.state !== "awaiting") return { ok: false, error: "This order has already been answered." };
    if (agreed !== true) return { ok: false, field: "conditions", error: "Check the box to accept the conditions." };
    order.state = "accepted";
    order.acceptedAt = new Date().toISOString();
    note(order, "The grower accepted. The buyer's bank was charged " + dollars(order.subtotal) + ", and PlantHub is holding the money.");
  }

  function decline(order) {
    if (order.state !== "awaiting") return { ok: false, error: "This order has already been answered." };
    order.state = "declined";
    giveBack(order);
    note(order, "The grower declined. The buyer was not charged, and the plants went back on the listing.");
  }

  // The grower can't supply a line after all (the listing was wrong). The
  // line comes off the order and the buyer is refunded for it at once. The
  // plants don't go back on the listing: they weren't there. With nothing
  // left, the order is cancelled. A default until the owner settles
  // short-count credits (docs/review-later.md).
  function unfill(order, listingId) {
    if (order.state !== "accepted") return { ok: false, error: "This order can't be changed any more." };
    if (order.confirmedAt) return { ok: false, error: "The plants have already been handed over. Use a problem report instead." };
    const line = order.lines.find(function (other) { return other.listingId === listingId; });
    if (!line) return { ok: false, error: "That plant isn't on this order." };
    if (order.problems.some(function (problem) { return problem.kind === "unfilled" && problem.listingId === listingId; })) {
      return { ok: false, error: "That line is already off the order." };
    }
    order.problems.push({
      id: order.id + "-P" + (order.problems.length + 1),
      kind: "unfilled", listingId: line.listingId, common: line.common,
      quantity: line.quantity, refund: line.total, status: "refunded",
      at: new Date().toISOString(),
    });
    note(order, "The grower can't fill " + line.quantity.toLocaleString() + " " + line.common + ". " +
                dollars(line.total) + " was refunded to the buyer.");
    const left = order.lines.filter(function (other) {
      return !order.problems.some(function (problem) { return problem.kind === "unfilled" && problem.listingId === other.listingId; });
    });
    if (!left.length) {
      order.state = "cancelled";
      withdrawJob(order);
      note(order, "Nothing is left on the order, so it was cancelled. The buyer was refunded in full.");
    }
  }

  function cantFill(id, listingId) {
    return changeOrder(id, ["grower"], function (order) { return unfill(order, listingId); });
  }

  function acceptOrder(id, agreed) {
    return changeOrder(id, ["grower"], function (order) { return accept(order, agreed); });
  }

  function declineOrder(id) {
    return changeOrder(id, ["grower"], decline);
  }

  // Why pickup or delivery can't be chosen or changed right now, or "".
  function arrangingProblem(order) {
    if (order.state !== "accepted") return "Pickup or delivery is chosen once the grower has accepted.";
    if (order.confirmedAt) return "This order is already finished.";
    const job = currentJob(order);
    if (job && job.status === "accepted") return job.carrierName + " has already accepted this delivery, so it can't be changed here.";
    return "";
  }

  // A date picked for a pickup or delivery: a real day, from today to
  // about three months out.
  function dateProblem(date) {
    const text = String(date || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || isNaN(new Date(text + "T12:00:00"))) return "Choose a date.";
    if (text < today()) return "Choose today or a later date.";
    if (text > dayFromToday(90)) return "Choose a date within the next 90 days.";
    return "";
  }

  // A delivery the carrier hasn't answered is dropped when the buyer picks
  // something else.
  function withdrawJob(order) {
    const job = currentJob(order);
    if (job && job.status === "requested") job.status = "withdrawn";
  }

  function choosePickup(id, date) {
    return changeOrder(id, ["buyer"], function (order) {
      const problem = arrangingProblem(order);
      if (problem) return { ok: false, error: problem };
      const badDate = dateProblem(date);
      if (badDate) return { ok: false, field: "date", error: badDate };
      withdrawJob(order);
      order.method = "pickup";
      order.pickupDate = date;
      delete order.carrierDeclined;
      note(order, "The buyer chose pickup on " + niceDay(date) + ".");
    });
  }

  // The buyer changes their mind about a pickup or a delivery that is still
  // pending: the pickup hasn't happened, or the carrier hasn't answered.
  // The choice is cancelled outright, and the order goes back to "choose
  // pickup or delivery". It is a real step with a note in the history, not
  // a form to be fiddled with, so the page asks before calling this. Once
  // a carrier has accepted, it is too late to change here.
  function cancelArrangement(id) {
    return changeOrder(id, ["buyer"], function (order) {
      const problem = arrangingProblem(order);
      if (problem) return { ok: false, error: problem };
      const job = currentJob(order);
      if (order.method === "pickup") {
        note(order, "The buyer cancelled the pickup on " + niceDay(order.pickupDate) + " and is choosing again.");
      } else if (job) {
        note(order, "The buyer cancelled the delivery request to " + job.carrierName + " and is choosing again. The buyer was not charged for it.");
      } else {
        return { ok: false, error: "There is no pickup or delivery to change yet." };
      }
      withdrawJob(order);
      order.method = null;
      delete order.pickupDate;
      delete order.carrierDeclined;
    });
  }

  // What a delivery of this order would cost with each carrier the buyer
  // may pick: miles from the grower to the job site, times the carrier's
  // rate per mile, or the carrier's per-trip minimum if that is higher.
  // With no city yet, it only says whether delivery is on offer at all.
  function deliveryOptions(id, city) {
    const order = findOrder(id);
    if (!order || order.side !== "buyer") return { ok: false, error: "That order isn't yours." };

    if (milesFrom(order.nurseryCity, order.nurseryCity) === null) {
      return { ok: false, pickupOnly: true, error: "This preview has no mileage for " + (order.nurseryCity || "this grower's city") + ", so a delivery can't be priced. This order is pickup only." };
    }
    const allowed = allowedCarriers(order.nurseryId);
    if (!allowed.length) {
      return { ok: false, pickupOnly: true, error: order.nurseryName + " hasn't approved any carriers yet, so this order is pickup only." };
    }
    if (!city) return { ok: true, miles: null, carriers: [] };

    const miles = milesFrom(order.nurseryCity, city);
    if (miles === null) return { ok: false, field: "city", error: "Choose the job site's city from the list." };

    return {
      ok: true,
      miles: miles,
      carriers: allowed.map(function (carrier) {
        const byMile = cents(miles * carrier.ratePerMile);
        return { carrier: carrier, byMile: byMile, cost: Math.max(byMile, carrier.tripMinimum), usesMinimum: byMile < carrier.tripMinimum };
      }).sort(function (a, b) { return a.cost - b.cost; }),
    };
  }

  function chooseDelivery(id, details) {
    if (!details.city) return { ok: false, field: "city", error: "Choose the job site's city." };
    const options = deliveryOptions(id, details.city);
    if (!options.ok) return options;
    const pick = options.carriers.find(function (option) { return option.carrier.id === details.carrierId; });
    if (!pick) return { ok: false, field: "carrier", error: "Choose a carrier." };

    return changeOrder(id, ["buyer"], function (order) {
      const problem = arrangingProblem(order);
      if (problem) return { ok: false, error: problem };
      const badDate = dateProblem(details.date);
      if (badDate) return { ok: false, field: "date", error: badDate };
      // Insured today isn't enough: the cover has to last to the delivery.
      if (details.date > pick.carrier.insuranceExpires) {
        return {
          ok: false, field: "date",
          error: pick.carrier.name + "'s insurance runs out on " + niceDay(pick.carrier.insuranceExpires) +
                 ", so it can't be booked for " + niceDay(details.date) + ". Choose an earlier date or another carrier.",
        };
      }

      withdrawJob(order);
      order.method = "delivery";
      delete order.pickupDate;
      delete order.carrierDeclined;
      order.jobs.push({
        id: order.id + "-D" + (order.jobs.length + 1),
        carrierId: pick.carrier.id,
        carrierName: pick.carrier.name,
        fromCity: order.nurseryCity,
        city: details.city,
        miles: options.miles,
        ratePerMile: pick.carrier.ratePerMile,
        tripMinimum: pick.carrier.tripMinimum,
        cost: pick.cost,
        date: details.date,
        status: "requested",
        requestedAt: new Date().toISOString(),
      });
      note(order, "The buyer asked " + pick.carrier.name + " to deliver to " + details.city + " on " + niceDay(details.date) +
                  ", for " + dollars(pick.cost) + ". The buyer is charged for it only if the carrier accepts.");
    });
  }

  // The carrier's answer to a delivery. A no sends the choice back to the
  // buyer: another carrier, or pickup.
  function settleJob(order, accept) {
    const job = currentJob(order);
    if (!job || job.status !== "requested") return { ok: false, error: "There is no delivery waiting for an answer." };
    if (accept) {
      job.status = "accepted";
      note(order, job.carrierName + " accepted the delivery. The buyer's bank was charged " + dollars(job.cost) + " for it, and PlantHub is holding the money.");
    } else {
      job.status = "declined";
      order.method = null;
      order.carrierDeclined = job.carrierName;
      note(order, job.carrierName + " declined the delivery. The buyer was not charged for it, and picks another carrier or pickup.");
    }
  }

  // PREVIEW ONLY, and temporary: the carrier's own jobs page is built with
  // the transport pages. Until it exists, the buyer's order page offers
  // "pretend the carrier accepted / declined" so the rest can be tried.
  function previewCarrierAnswer(id, accept) {
    return changeOrder(id, ["buyer"], function (order) { return settleJob(order, accept); });
  }

  // The history of an order is read by both sides, so it never states the
  // grower's payout: set beside the order total, that would give away
  // PlantHub's fee, which the buyer is never shown.

  function pickedUp(order) {
    if (order.confirmedAt) return { ok: false, error: "This order is already marked as picked up." };
    if (order.state !== "accepted" || order.method !== "pickup") return { ok: false, error: "This order isn't waiting to be picked up." };
    order.confirmedAt = new Date().toISOString();
    note(order, "The grower marked the order as picked up. The grower's payout was released.");
  }

  function confirmPickup(id) {
    return changeOrder(id, ["grower"], pickedUp);
  }

  function confirmDelivery(id) {
    return changeOrder(id, ["buyer"], function (order) {
      const job = currentJob(order);
      if (order.confirmedAt) return { ok: false, error: "This order is already marked as delivered." };
      if (order.state !== "accepted" || !job || job.status !== "accepted") return { ok: false, error: "This order isn't out for delivery." };
      job.status = "delivered";
      order.confirmedAt = new Date().toISOString();
      note(order, "The buyer confirmed the delivery. The payments to the grower and to " + job.carrierName + " were released.");
    });
  }

  // The buyer reports a problem, within 48 hours of pickup or delivery.
  //   kind "short"  some plants were missing. Refunded at the unit price,
  //                 at once, with nobody needing to agree.
  //   kind "grade"  what arrived wasn't the grade listed. The grower
  //                 accepts or disputes; a dispute goes to PlantHub.
  //
  // A report can't be taken back, so the page checks it first (checkProblem)
  // and asks "are you sure?" before sending it (reportProblem).
  // Returns { ok: false, error } or { ok: true, problem, text }.
  function buildProblem(order, details) {
    if (!order.confirmedAt) return { ok: false, error: "A problem can be reported once the order has been picked up or delivered." };
    if (new Date().toISOString() >= problemDeadline(order)) return { ok: false, error: "The " + PROBLEM_HOURS + " hours for reporting a problem on this order have passed." };
    if (details.kind !== "short" && details.kind !== "grade") return { ok: false, field: "kind", error: "Choose what went wrong." };
    const line = order.lines.find(function (other) { return other.listingId === details.listingId; });
    if (!line) return { ok: false, field: "line", error: "Choose which plant the problem is with." };
    if (order.problems.some(function (other) { return other.kind === "unfilled" && other.listingId === line.listingId; })) {
      return { ok: false, field: "line", error: "The grower took that plant off the order, and you were refunded for it." };
    }

    const problem = {
      id: order.id + "-P" + (order.problems.length + 1),
      kind: details.kind,
      listingId: line.listingId,
      common: line.common,
      at: new Date().toISOString(),
    };

    if (details.kind === "short") {
      const already = order.problems.reduce(function (sum, other) {
        return sum + (other.kind === "short" && other.listingId === line.listingId ? other.quantity : 0);
      }, 0);
      const left = line.quantity - already;
      const quantity = wholeNumber(details.quantity);
      if (!quantity) return { ok: false, field: "quantity", error: "Enter how many were missing, as a whole number." };
      if (quantity > left) {
        return {
          ok: false, field: "quantity",
          error: left < 1
            ? "All " + line.quantity.toLocaleString() + " of these are already reported as missing."
            : "You ordered " + line.quantity.toLocaleString() + " of these" + (already ? " and " + already.toLocaleString() + " are already reported" : "") +
              ", so at most " + left.toLocaleString() + " can be missing.",
        };
      }
      problem.quantity = quantity;
      problem.refund = cents(quantity * line.price);
      problem.status = "refunded";
      return {
        ok: true, problem: problem,
        text: "The buyer reported " + quantity.toLocaleString() + " " + line.common + " missing. " + dollars(problem.refund) +
              " was refunded to the buyer and deducted from the grower's payout.",
      };
    }

    const words = String(details.note || "").trim();
    if (!words) return { ok: false, field: "note", error: "Say what arrived instead, so the grower can answer." };
    problem.note = words.slice(0, 500);
    problem.status = "waiting";
    return { ok: true, problem: problem, text: "The buyer reported a wrong grade on " + line.common + ". The grower has been asked to answer." };
  }

  // Would this report be accepted? Saves nothing.
  function checkProblem(id, details) {
    const order = findOrder(id);
    if (!order || order.side !== "buyer") return { ok: false, error: "That order isn't yours to change." };
    const built = buildProblem(order, details);
    return built.ok ? { ok: true, problem: built.problem } : built;
  }

  function reportProblem(id, details) {
    return changeOrder(id, ["buyer"], function (order) {
      const built = buildProblem(order, details);
      if (!built.ok) return built;
      order.problems.push(built.problem);
      note(order, built.text);
    });
  }

  function answer(order, problemId, reply) {
    const problem = order.problems.find(function (other) { return other.id === problemId; });
    if (!problem || problem.status !== "waiting") return { ok: false, error: "That problem has already been answered." };
    if (reply !== "accept" && reply !== "dispute") return { ok: false, error: "Choose accept or dispute." };
    problem.status = reply === "accept" ? "accepted" : "disputed";
    problem.answeredAt = new Date().toISOString();
    note(order, reply === "accept"
      ? "The grower accepted the wrong-grade report on " + problem.common + ". PlantHub will settle the credit."
      : "The grower disputed the wrong-grade report on " + problem.common + ". PlantHub is reviewing.");
  }

  function answerProblem(id, problemId, reply) {
    return changeOrder(id, ["grower"], function (order) { return answer(order, problemId, reply); });
  }

  // PREVIEW ONLY: nine of the ten sample growers have no account anyone can
  // sign in with, so an order sent to one of them would wait for ever. For
  // those growers only, the buyer's order page offers to stand in for the
  // grower. `action` is "accept", "decline", "picked-up", "problem-accept"
  // or "problem-dispute". The demo grower's orders are answered by signing
  // in as the demo grower, like a real one.
  function growerAccount(nurseryId) {
    return users().find(function (user) { return user.type === "grower" && user.nurseryId === nurseryId; }) || null;
  }

  function previewGrower(id, action, problemId) {
    return changeOrder(id, ["buyer"], function (order) {
      if (growerAccount(order.nurseryId)) return { ok: false, error: "This grower has an account. Sign in as them to answer." };
      if (action === "accept") return accept(order, true);
      if (action === "decline") return decline(order);
      if (action === "picked-up") return pickedUp(order);
      if (action === "cant-fill") return unfill(order, problemId);
      if (action === "problem-accept") return answer(order, problemId, "accept");
      if (action === "problem-dispute") return answer(order, problemId, "dispute");
      return { ok: false, error: "Nothing to do." };
    });
  }

  // PREVIEW ONLY: nobody reviewing this site can wait two days to see the
  // report-a-problem button go away, so this closes a finished order's
  // 48 hours at once.
  function previewSkipAhead(id) {
    return changeOrder(id, ["buyer", "grower"], function (order) {
      if (!order.confirmedAt) return { ok: false, error: "This order isn't finished yet." };
      if (order.windowClosed) return { ok: false, error: "The " + PROBLEM_HOURS + " hours have already passed." };
      order.windowClosed = true;
      note(order, "Preview: skipped ahead " + PROBLEM_HOURS + " hours.");
    });
  }

  // ---- 11. The account corner of every page --------------------------------
  // A page marks where the corner goes with <div data-account-corner></div>.
  // Signed out it holds "Sign in"; signed in, the person's name (a link to
  // their account) and "Sign out".
  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  // The light-or-dark switch, first in the corner. theme.js does the
  // switching; this only draws the button: a moon while the page is light
  // (press for dark), a sun while it is dark (press for light).
  const MOON = '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>';
  const SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';

  function themeButton() {
    const dark = !!window.PlantHubTheme && window.PlantHubTheme.isDark();
    const label = dark ? "Switch to light mode" : "Switch to dark mode";
    return (
      '<button type="button" class="theme-toggle" data-theme-button aria-label="' + label + '" title="' + label + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          (dark ? SUN : MOON) +
        "</svg>" +
      "</button>"
    );
  }

  // Pages without an account corner (sign in, sign up) mark where the
  // switch goes with <div data-theme-toggle></div>.
  function drawThemeButtons() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (spot) { spot.innerHTML = themeButton(); });
    document.querySelectorAll("[data-account-corner] [data-theme-button]").forEach(function (button) {
      button.outerHTML = themeButton();
    });
  }

  function drawAccountCorner() {
    const user = currentUser();
    document.querySelectorAll("[data-theme-toggle]").forEach(function (spot) { spot.innerHTML = themeButton(); });
    document.querySelectorAll("[data-account-corner]").forEach(function (corner) {
      if (!user) {
        corner.innerHTML = themeButton() + '<a href="signin.html" class="corner-button">Sign in</a>';
        return;
      }
      // Buyers and growers get a way to their conversations and their
      // orders, each with a count when something is waiting for them.
      const waiting = unreadInquiries();
      const toAnswer = ordersWaiting();
      const inbox = user.type === "transporter" ? "" :
        '<a href="inquiries.html" class="corner-link">Inquiries' +
          (waiting ? ' <span class="corner-count">' + waiting + "</span>" : "") + "</a>" +
        '<a href="orders.html" class="corner-link">Orders' +
          (toAnswer ? ' <span class="corner-count">' + toAnswer + "</span>" : "") + "</a>";

      corner.innerHTML = themeButton() + inbox +
        '<a href="account.html" class="corner-name" title="Your account">' +
          '<span class="corner-initial" aria-hidden="true">' + escapeHtml(user.name.charAt(0).toUpperCase()) + "</span>" +
          '<span class="corner-text">' + escapeHtml(user.name) + "</span>" +
        "</a>" +
        // On a phone there is no room for this as well; the account page
        // (the round letter) has Sign out under "Leaving".
        '<button type="button" class="corner-button corner-signout" data-sign-out>Sign out</button>';
    });
  }

  document.addEventListener("click", function (event) {
    if (!event.target.closest("[data-theme-button]") || !window.PlantHubTheme) return;
    window.PlantHubTheme.toggle();
  });
  document.addEventListener("planthub:theme-changed", drawThemeButtons);

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

  // Pressing Back can bring a page back exactly as it was left, without
  // running it again, so it may show an order as unanswered after it was
  // answered, or a basket as it was three steps ago. A page that belongs
  // to one account (it has data-needs-account) is loaded afresh. Any other
  // page keeps what was typed into it and only redraws this corner.
  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) return;
    if (document.body.hasAttribute("data-needs-account")) location.reload();
    else drawAccountCorner();
  });

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
    nursery: findNursery,
    canBuy: canBuy,
    sendInquiry: sendInquiry,
    myInquiries: myInquiries,
    replyInquiry: replyInquiry,
    markInquiryRead: markInquiryRead,
    unreadInquiries: unreadInquiries,
    MIN_ORDER_DOLLARS: MIN_ORDER_DOLLARS,
    FEE_RATE: FEE_RATE,
    PROBLEM_HOURS: PROBLEM_HOURS,
    basket: basket,
    tidyBasket: tidyBasket,
    basketCount: basketCount,
    activeDraft: activeDraft,
    drafts: drafts,
    createDraft: createDraft,
    setActiveDraft: setActiveDraft,
    deleteDraft: deleteDraft,
    addToBasket: addToBasket,
    setBasketQuantity: setBasketQuantity,
    removeFromBasket: removeFromBasket,
    clearBasket: clearBasket,
    BANKS: BANKS,
    connectBank: connectBank,
    disconnectBank: disconnectBank,
    placeOrder: placeOrder,
    myOrders: myOrders,
    order: findOrder,
    cancelOrder: cancelOrder,
    acceptOrder: acceptOrder,
    declineOrder: declineOrder,
    cantFill: cantFill,
    choosePickup: choosePickup,
    cancelArrangement: cancelArrangement,
    deliveryOptions: deliveryOptions,
    chooseDelivery: chooseDelivery,
    confirmPickup: confirmPickup,
    confirmDelivery: confirmDelivery,
    checkProblem: checkProblem,
    reportProblem: reportProblem,
    answerProblem: answerProblem,
    ordersWaiting: ordersWaiting,
    awaitingByListing: awaitingByListing,
    previewCarrierAnswer: previewCarrierAnswer,
    previewGrower: previewGrower,
    previewSkipAhead: previewSkipAhead,
    carriers: carriers,
    carrier: findCarrier,
    deliveryCities: deliveryCities,
    myCarrierRules: myCarrierRules,
    setCarrierApproved: setCarrierApproved,
    setCarrierBlocked: setCarrierBlocked,
    setAllowAnyCarrier: setAllowAnyCarrier,
    escapeHtml: escapeHtml,
  };
})();
