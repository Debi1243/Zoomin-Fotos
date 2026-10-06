import { brand } from "@/lib/data";
import { contentRepo } from "@/lib/site";

/**
 * Google Apps Script the studio pastes into its own Google Sheet (Extensions > Apps Script)
 * and deploys as a web app. The website posts visits, clicks and enquiries to it; the
 * dashboard reads them back, and only with a GitHub key that can edit the website, which
 * the script checks with GitHub itself. Each enquiry is also emailed to the studio.
 */
export const dashboardScript = `// Zoomin Fotos dashboard. Paste this whole file into Extensions > Apps Script.
const REPO = "${contentRepo.owner}/${contentRepo.repo}";
const NOTIFY_EMAIL = "${brand.email}";

const ENQUIRY_COLUMNS = ["Id", "Received", "Status", "Session", "Name", "Email", "Phone", "Date wanted", "Location", "Message", "Page"];
const EVENT_COLUMNS = ["Time", "Type", "Path", "Label", "Target", "Referrer", "Device", "Visitor", "Session"];

function doGet() {
  return reply({ ok: true, service: "Zoomin Fotos dashboard" });
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
  return { ok: true, events: events, enquiries: enquiries, sheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl() };
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
`;
