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

  Functions that can fail return { ok: true, ... } or { ok: false, error }.
*/

const PH = (function () {

  // ---- 1. Where things are kept ------------------------------------------
  const USERS_KEY = "planthub.users";
  const SESSION_KEY = "planthub.session";

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
  function write(key, value) {
    memory[key] = value;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* kept in memory only */ }
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
      created: new Date().toISOString().slice(0, 10),
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
    write(USERS_KEY, users().filter(function (other) { return other.id !== user.id; }));
    remove(SESSION_KEY);
    return { ok: true };
  }

  function resetDemo() {
    remove(SESSION_KEY);
    write(USERS_KEY, seedUsers());
  }

  // ---- 5. The account corner of every page ---------------------------------
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
    escapeHtml: escapeHtml,
  };
})();
