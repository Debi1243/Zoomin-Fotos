import { brand } from "@/lib/data";
import { contentRepo } from "@/lib/site";

/**
 * Google Apps Script the studio pastes into its own Google Sheet (Extensions > Apps Script)
 * and deploys as a web app. The website posts visits, clicks and enquiries to it; the
 * dashboard reads them back, and only with a GitHub key that can edit the website, which
 * the script checks with GitHub itself. Each enquiry is also emailed to the studio.
 */
/** Bumped whenever the script changes, so the admin pages can ask for the newer copy. */
export const SCRIPT_VERSION = 3;

export const dashboardScript = `// Zoomin Fotos dashboard and client portal. Paste this whole file into Extensions > Apps Script.
const VERSION = ${SCRIPT_VERSION};
const REPO = "${contentRepo.owner}/${contentRepo.repo}";
const NOTIFY_EMAIL = "${brand.email}";

const ENQUIRY_COLUMNS = ["Id", "Received", "Status", "Session", "Name", "Email", "Phone", "Date wanted", "Location", "Message", "Page"];
const EVENT_COLUMNS = ["Time", "Type", "Path", "Label", "Target", "Referrer", "Device", "Visitor", "Session"];
const REVIEW_COLUMNS = ["Id", "Received", "Status", "Name", "Event", "Shoot month", "Rating", "Review", "Email"];
const BOOKING_COLUMNS = ["Code", "Client", "Event date", "Status", "Updated", "PIN check", "Booking data", "Signature"];

function doGet() {
  return reply({ ok: true, service: "Zoomin Fotos dashboard", version: VERSION });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: "Unreadable request" });
  }
  if (body.type === "enquiry") return reply(saveEnquiry(body.enquiry || {}));
  if (body.type === "events") return reply(saveEvents(body.events || []));
  if (body.type === "read") return reply(allowed(body.token) ? read(body.days) : { ok: false, error: "not-allowed" });
  if (body.type === "status") return reply(allowed(body.token) ? setStatus(body.id, body.status) : { ok: false, error: "not-allowed" });
  if (body.type === "bookings") return reply(allowed(body.token) ? listBookings() : { ok: false, error: "not-allowed" });
  if (body.type === "save-booking") return reply(allowed(body.token) ? saveBooking(body.booking, body.pin) : { ok: false, error: "not-allowed" });
  if (body.type === "delete-booking") return reply(allowed(body.token) ? deleteBooking(body.code) : { ok: false, error: "not-allowed" });
  if (String(body.type).indexOf("portal-") === 0) return reply(portal(body));
  if (body.type === "review") return reply(saveReview(body.review || {}));
  if (body.type === "reviews") return reply(allowed(body.token) ? listReviews() : { ok: false, error: "not-allowed" });
  if (body.type === "review-status") return reply(allowed(body.token) ? setReviewStatus(body.id, body.status) : { ok: false, error: "not-allowed" });
  return reply({ ok: false, error: "Unknown request" });
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function sheet(name, columns) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let s = book.getSheetByName(name);
  if (!s) {
    s = book.insertSheet(name);
    s.appendRow(columns);
    s.setFrozenRows(1);
    s.getRange(1, 1, 1, columns.length).setFontWeight("bold");
  }
  return s;
}

// Text starting with = + - @ would run as a formula in Sheets; a leading apostrophe keeps it plain text.
function text(value, max) {
  const s = String(value == null ? "" : value).slice(0, max);
  return /^[=+\\-@]/.test(s) ? "'" + s : s;
}

function saveEnquiry(q) {
  if (!q.name || !q.email) return { ok: false, error: "Missing name or email" };
  const id = Utilities.getUuid().slice(0, 8);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet("Enquiries", ENQUIRY_COLUMNS).appendRow([
      id, new Date(), "New", text(q.session, 60), text(q.name, 120), text(q.email, 200), text(q.phone, 30),
      text(q.date, 30), text(q.location, 160), text(q.message, 4000), text(q.page, 200),
    ]);
  } finally {
    lock.releaseLock();
  }
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: String(q.email),
      subject: "New enquiry: " + (q.session || "Shoot") + " from " + q.name,
      body: [
        "Name: " + q.name, "Email: " + q.email, "Phone: " + (q.phone || "-"), "Session: " + (q.session || "-"),
        "Date wanted: " + (q.date || "-"), "Location: " + (q.location || "-"), "", String(q.message || ""),
        "", "All enquiries: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
      ].join("\\n"),
    });
  } catch (err) {
    // The enquiry is saved even if the email could not go out.
  }
  return { ok: true };
}

function saveEvents(events) {
  const rows = events.slice(0, 50).map(function (v) {
    return [
      new Date(Number(v.time) || Date.now()), text(v.type, 10), text(v.path, 200), text(v.label, 60), text(v.target, 200),
      text(v.referrer, 120), text(v.device, 10), text(v.visitor, 20), text(v.session, 20),
    ];
  });
  if (rows.length === 0) return { ok: true };
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const s = sheet("Visits", EVENT_COLUMNS);
    s.getRange(s.getLastRow() + 1, 1, rows.length, EVENT_COLUMNS.length).setValues(rows);
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

// Only someone whose GitHub key can edit the website may read the dashboard.
function allowed(token) {
  if (!token) return false;
  const cache = CacheService.getScriptCache();
  const id = "gh" + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(token)));
  if (cache.get(id) === "1") return true;
  const res = UrlFetchApp.fetch("https://api.github.com/repos/" + REPO, {
    headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json" },
    muteHttpExceptions: true,
  });
  let ok = false;
  if (res.getResponseCode() === 200) {
    const info = JSON.parse(res.getContentText());
    ok = !!(info.permissions && info.permissions.push);
  }
  if (ok) cache.put(id, "1", 600);
  return ok;
}

function read(days) {
  const since = Date.now() - Math.min(Math.max(Number(days) || 30, 1), 366) * 86400000;
  const visits = sheet("Visits", EVENT_COLUMNS);
  const events = [];
  const last = visits.getLastRow();
  // Rows are in time order, so read backwards in blocks and stop at the first one that is too old.
  for (let end = last; end > 1; ) {
    const start = Math.max(2, end - 1999);
    const block = visits.getRange(start, 1, end - start + 1, EVENT_COLUMNS.length).getValues();
    let done = false;
    for (let i = block.length - 1; i >= 0; i--) {
      const r = block[i];
      const t = new Date(r[0]).getTime();
      if (t < since) { done = true; break; }
      events.push([t, r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8]]);
    }
    if (done) break;
    end = start - 1;
  }
  const enquirySheet = sheet("Enquiries", ENQUIRY_COLUMNS);
  const rows = enquirySheet.getLastRow() > 1 ? enquirySheet.getRange(2, 1, enquirySheet.getLastRow() - 1, ENQUIRY_COLUMNS.length).getValues() : [];
  const enquiries = rows.map(function (r) {
    return {
      id: String(r[0]), received: new Date(r[1]).getTime(), status: String(r[2] || "New"), session: String(r[3]), name: String(r[4]),
      email: String(r[5]), phone: String(r[6]), date: r[7] instanceof Date ? Utilities.formatDate(r[7], "Asia/Kolkata", "yyyy-MM-dd") : String(r[7]),
      location: String(r[8]), message: String(r[9]), page: String(r[10]),
    };
  }).reverse();
  return { ok: true, version: VERSION, events: events, enquiries: enquiries, sheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl() };
}

function setStatus(id, status) {
  if (["New", "Replied", "Booked", "Closed"].indexOf(status) < 0) return { ok: false, error: "Unknown status" };
  const s = sheet("Enquiries", ENQUIRY_COLUMNS);
  const ids = s.getLastRow() > 1 ? s.getRange(2, 1, s.getLastRow() - 1, 1).getValues() : [];
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      s.getRange(i + 2, 3).setValue(status);
      return { ok: true };
    }
  }
  return { ok: false, error: "Enquiry not found" };
}

// ---------- Client bookings and the client portal ----------

function bookingSheet() {
  return sheet("Bookings", BOOKING_COLUMNS);
}

function findBooking(code) {
  code = String(code || "").trim().toUpperCase();
  const s = bookingSheet();
  const last = s.getLastRow();
  if (!code || last < 2) return null;
  const codes = s.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < codes.length; i++) {
    if (String(codes[i][0]).toUpperCase() === code) {
      const values = s.getRange(i + 2, 1, 1, BOOKING_COLUMNS.length).getValues()[0];
      return { row: i + 2, code: code, pinHash: String(values[5]), data: JSON.parse(String(values[6]) || "{}"), signature: String(values[7] || "") };
    }
  }
  return null;
}

function writeBooking(found, data, pinHash, signature) {
  const s = bookingSheet();
  const row = found ? found.row : s.getLastRow() + 1;
  data.updatedAt = Date.now();
  const json = JSON.stringify(data);
  if (json.length > 49000) throw new Error("This booking has grown too large to save. Shorten the agreement or the lists.");
  s.getRange(row, 1, 1, BOOKING_COLUMNS.length).setValues([[
    data.code, text(data.client && data.client.names, 120), text(data.eventDate, 20), text(data.status, 40), new Date(), pinHash, json, signature || "",
  ]]);
  return data;
}

function pinHashOf(code, pin) {
  const props = PropertiesService.getScriptProperties();
  let salt = props.getProperty("pinSalt");
  if (!salt) {
    salt = Utilities.getUuid();
    props.setProperty("pinSalt", salt);
  }
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + "|" + String(code).toUpperCase() + "|" + String(pin)));
}

function listBookings() {
  const s = bookingSheet();
  const last = s.getLastRow();
  const rows = last > 1 ? s.getRange(2, 1, last - 1, BOOKING_COLUMNS.length).getValues() : [];
  return {
    ok: true,
    version: VERSION,
    bookings: rows.filter(function (r) { return r[0]; }).map(function (r) {
      return { data: JSON.parse(String(r[6]) || "{}"), signature: String(r[7] || ""), hasPin: !!r[5] };
    }),
  };
}

function saveBooking(data, pin) {
  if (!data || !/^ZF-[A-Z0-9]{4,8}$/.test(String(data.code))) return { ok: false, error: "Missing booking code" };
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const found = findBooking(data.code);
    const pinHash = pin ? pinHashOf(data.code, pin) : found ? found.pinHash : "";
    // Signing happens in the portal; the admin page can only keep a signature or clear it.
    const keepSignature = found && found.data.contract && found.data.contract.signed && data.contract && data.contract.signed;
    if (found && found.data.contract && found.data.contract.signed && data.contract && data.contract.signed) data.contract.signed = found.data.contract.signed;
    if (!keepSignature && data.contract) delete data.contract.signed;
    const saved = writeBooking(found, data, pinHash, keepSignature ? found.signature : "");
    return { ok: true, booking: saved, signature: keepSignature ? found.signature : "" };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  } finally {
    lock.releaseLock();
  }
}

function deleteBooking(code) {
  const found = findBooking(code);
  if (!found) return { ok: false, error: "Booking not found" };
  bookingSheet().deleteRow(found.row);
  return { ok: true };
}

function portal(body) {
  const code = String(body.code || "").trim().toUpperCase();
  const cache = CacheService.getScriptCache();
  const tries = Number(cache.get("tries-" + code) || 0);
  if (tries >= 8) return { ok: false, error: "too-many" };
  const found = findBooking(code);
  if (!found || !found.pinHash || found.pinHash !== pinHashOf(code, String(body.pin || "").trim())) {
    cache.put("tries-" + code, String(tries + 1), 900);
    return { ok: false, error: "wrong" };
  }
  const data = found.data;
  const lock = LockService.getScriptLock();
  try {
    if (body.type === "portal-login") return { ok: true, booking: data, signature: found.signature };
    lock.waitLock(10000);
    if (body.type === "portal-planning") {
      data.planning = body.planning || data.planning;
      writeBooking(found, data, found.pinHash, found.signature);
      return { ok: true, booking: data, signature: found.signature };
    }
    if (body.type === "portal-sign") {
      if (data.contract && data.contract.signed) return { ok: false, error: "Already signed" };
      const image = String(body.image || "");
      if (image.indexOf("data:image/png;base64,") !== 0 || image.length > 45000) return { ok: false, error: "The signature could not be read. Please sign again." };
      if (!body.name) return { ok: false, error: "Type your full name to sign." };
      data.contract.signed = { name: text(body.name, 120), at: Date.now(), text: data.contract.text };
      data.status = "Signed";
      writeBooking(found, data, found.pinHash, image);
      notify("Agreement signed: " + code, data.contract.signed.name + " signed the agreement for " + (data.title || code) + ".");
      return { ok: true, booking: data, signature: image };
    }
    if (body.type === "portal-paid") {
      const amount = Math.max(0, Math.round(Number(body.amount) || 0));
      if (!amount || !body.reference) return { ok: false, error: "Enter the amount and the payment reference." };
      data.payments = (data.payments || []).slice(-29);
      data.payments.push({ id: Utilities.getUuid().slice(0, 8), amount: amount, reference: text(body.reference, 80), at: Date.now(), method: "UPI", status: "claimed" });
      data.status = "Payment to check";
      writeBooking(found, data, found.pinHash, found.signature);
      notify("Payment reported: " + code, (data.client && data.client.names) + " reports paying Rs " + amount + " for " + (data.title || code) + ". Reference: " + body.reference + ". Confirm it on the admin Clients page once it reaches your account.");
      return { ok: true, booking: data, signature: found.signature };
    }
    return { ok: false, error: "Unknown request" };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

// ---------- Reviews ----------

function saveReview(r) {
  const rating = Math.round(Number(r.rating));
  if (!r.name || !r.text || !(rating >= 1 && rating <= 5)) return { ok: false, error: "Please add your name, a rating and a few words." };
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet("Reviews", REVIEW_COLUMNS).appendRow([
      Utilities.getUuid().slice(0, 8), new Date(), "New", text(r.name, 120), text(r.event, 80), text(r.date, 7), rating, text(r.text, 2000), text(r.email, 200),
    ]);
  } finally {
    lock.releaseLock();
  }
  notify("New review from " + r.name, rating + " stars: " + String(r.text).slice(0, 400) + "\\n\\nPublish it from the admin Reviews tab.");
  return { ok: true };
}

function listReviews() {
  const s = sheet("Reviews", REVIEW_COLUMNS);
  const last = s.getLastRow();
  const rows = last > 1 ? s.getRange(2, 1, last - 1, REVIEW_COLUMNS.length).getValues() : [];
  return {
    ok: true,
    version: VERSION,
    reviews: rows.map(function (r) {
      return { id: String(r[0]), received: new Date(r[1]).getTime(), status: String(r[2]), name: String(r[3]), event: String(r[4]), date: r[5] instanceof Date ? Utilities.formatDate(r[5], "Asia/Kolkata", "yyyy-MM") : String(r[5]), rating: Number(r[6]), text: String(r[7]), email: String(r[8]) };
    }).reverse(),
  };
}

function setReviewStatus(id, status) {
  if (["New", "Published", "Hidden"].indexOf(status) < 0) return { ok: false, error: "Unknown status" };
  const s = sheet("Reviews", REVIEW_COLUMNS);
  const ids = s.getLastRow() > 1 ? s.getRange(2, 1, s.getLastRow() - 1, 1).getValues() : [];
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      s.getRange(i + 2, 3).setValue(status);
      return { ok: true };
    }
  }
  return { ok: false, error: "Review not found" };
}

function notify(subject, body) {
  try {
    MailApp.sendEmail({ to: NOTIFY_EMAIL, subject: subject, body: body + "\\n\\n" + SpreadsheetApp.getActiveSpreadsheet().getUrl() });
  } catch (err) {
    // The change is saved even if the email could not go out.
  }
}
`;
