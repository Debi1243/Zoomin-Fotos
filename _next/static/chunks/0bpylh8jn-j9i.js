(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,89664,e=>{"use strict";var t=e.i(56420);let s={name:"check",size:24,node:[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]};s.node;let a=(0,t.default)(s);e.s(["Check",0,a],89664)},22768,3923,e=>{"use strict";var t=e.i(56420);let s={name:"circle-alert",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],aliases:["alert-circle"]};s.node;let a=(0,t.default)(s);e.s(["CircleAlert",0,a],22768);var n=e.i(43476),r=e.i(89664),i=e.i(45060);let o="block w-full rounded-md border bg-elevated px-3.5 text-[0.9375rem] text-fg shadow-sm transition-[border-color,box-shadow] duration-150 placeholder:text-muted/70 hover:border-border-strong focus:border-fg focus:outline-none focus:ring-4 focus:ring-fg/10 disabled:cursor-not-allowed disabled:opacity-60";function l({id:e,label:t,hint:s,error:r,optional:i,children:o}){return(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"flex items-baseline justify-between gap-4",children:[(0,n.jsx)("label",{htmlFor:e,className:"text-sm font-medium",children:t}),i&&(0,n.jsx)("span",{className:"text-xs text-muted",children:"Optional"})]}),(0,n.jsx)("div",{className:"mt-2",children:o}),r?(0,n.jsxs)("p",{id:`${e}-error`,className:"mt-2 flex items-start gap-1.5 text-sm text-error",children:[(0,n.jsx)(a,{"aria-hidden":!0,className:"mt-0.5 size-3.5 shrink-0"}),r]}):s&&(0,n.jsx)("p",{id:`${e}-hint`,className:"mt-2 text-sm text-muted",children:s})]})}function d(e,t,s){return t?`${e}-error`:s?`${e}-hint`:void 0}e.s(["ChoiceGroup",0,function({legend:e,name:t,type:s,options:r,defaultValue:o,error:l}){let d=`${t}-error`;return(0,n.jsxs)("fieldset",{"aria-describedby":l?d:void 0,"aria-invalid":!!l||void 0,children:[(0,n.jsx)("legend",{className:"text-sm font-medium",children:e}),(0,n.jsx)("div",{className:"mt-3 flex flex-wrap gap-2",children:r.map(e=>(0,n.jsxs)("label",{className:(0,i.cn)("relative inline-flex h-10 cursor-pointer select-none items-center rounded-md border px-3.5 text-sm transition-colors","border-border bg-elevated hover:border-border-strong","has-[:checked]:border-fg has-[:checked]:bg-fg has-[:checked]:text-bg","has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fg"),children:[(0,n.jsx)("input",{type:s,name:t,value:e,defaultChecked:o.includes(e),className:"sr-only"}),e]},e))}),l&&(0,n.jsxs)("p",{id:d,className:"mt-2 flex items-start gap-1.5 text-sm text-error",children:[(0,n.jsx)(a,{"aria-hidden":!0,className:"mt-0.5 size-3.5 shrink-0"}),l]})]})},"TextField",0,function({id:e,label:t,hint:s,error:a,optional:c,valid:u,className:h,...p}){return(0,n.jsx)(l,{id:e,label:t,hint:s,error:a,optional:c,children:(0,n.jsxs)("div",{className:"relative",children:[(0,n.jsx)("input",{id:e,"aria-invalid":!!a||void 0,"aria-describedby":d(e,a,s),className:(0,i.cn)(o,"h-12",a?"border-error":u?"border-success/60 pr-10":"border-border",h),...p}),u&&!a&&(0,n.jsx)(r.Check,{"aria-hidden":!0,className:"pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-success"})]})})},"TextareaField",0,function({id:e,label:t,hint:s,error:a,className:r,...c}){return(0,n.jsx)(l,{id:e,label:t,hint:s,error:a,children:(0,n.jsx)("textarea",{id:e,"aria-invalid":!!a||void 0,"aria-describedby":d(e,a,s),className:(0,i.cn)(o,"min-h-36 resize-y py-3 leading-relaxed",a?"border-error":"border-border",r),...c})})},"control",0,o],3923)},8734,41120,43080,60538,e=>{"use strict";var t=e.i(56420);let s={name:"copy",size:24,node:[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]};s.node;let a=(0,t.default)(s);e.s(["Copy",0,a],8734);var n=e.i(43476),r=e.i(71645);let i={name:"refresh-cw",size:24,node:[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]};i.node;let o=(0,t.default)(i);e.s(["RefreshCw",0,o],41120);var l=e.i(59544),d=e.i(16148),c=e.i(31338);let u=`// Zoomin Fotos dashboard and client portal. Paste this whole file into Extensions > Apps Script.
const VERSION = 2;
const REPO = "${c.contentRepo.owner}/${c.contentRepo.repo}";
const NOTIFY_EMAIL = "${d.brand.email}";

const ENQUIRY_COLUMNS = ["Id", "Received", "Status", "Session", "Name", "Email", "Phone", "Date wanted", "Location", "Message", "Page"];
const EVENT_COLUMNS = ["Time", "Type", "Path", "Label", "Target", "Referrer", "Device", "Visitor", "Session"];
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

function notify(subject, body) {
  try {
    MailApp.sendEmail({ to: NOTIFY_EMAIL, subject: subject, body: body + "\\n\\n" + SpreadsheetApp.getActiveSpreadsheet().getUrl() });
  } catch (err) {
    // The change is saved even if the email could not go out.
  }
}
`;e.s(["SCRIPT_VERSION",0,2,"dashboardScript",0,u],43080),e.s(["default",0,function({onDone:e,reason:t}){let[s,i]=(0,r.useState)(!1),d=async()=>{try{await navigator.clipboard.writeText(u),i(!0),setTimeout(()=>i(!1),2500)}catch{}};return(0,n.jsxs)("section",{"aria-labelledby":"update-title",className:"max-w-3xl rounded-lg border border-border-strong bg-surface p-6",children:[(0,n.jsx)("h2",{id:"update-title",className:"font-display text-2xl",children:"Update your sheet script"}),(0,n.jsxs)("p",{className:"mt-2 text-sm text-muted",children:[t," It takes about two minutes, and the web address stays the same."]}),(0,n.jsxs)("ol",{className:"mt-5 list-decimal space-y-2 pl-5 text-sm leading-relaxed",children:[(0,n.jsxs)("li",{children:["Open your “Zoomin Fotos dashboard” Google Sheet and choose ",(0,n.jsx)("b",{children:"Extensions › Apps Script"}),"."]}),(0,n.jsx)("li",{children:"Delete all the code there, paste the new code, and click the save icon."}),(0,n.jsxs)("li",{children:["Click ",(0,n.jsx)("b",{children:"Deploy › Manage deployments"}),", click the pencil icon, set ",(0,n.jsx)("b",{children:"Version"})," to ",(0,n.jsx)("b",{children:"New version"}),", and click"," ",(0,n.jsx)("b",{children:"Deploy"}),". If Google asks, authorise it again."]}),(0,n.jsx)("li",{children:"Come back here and press Check again."})]}),(0,n.jsxs)("div",{className:"mt-5 flex flex-wrap gap-3",children:[(0,n.jsxs)(l.Button,{type:"button",variant:"secondary",onClick:()=>void d(),children:[(0,n.jsx)(a,{"aria-hidden":!0,className:"size-4"})," ",s?"Copied":"Copy the new code"]}),(0,n.jsxs)(l.Button,{type:"button",onClick:e,children:[(0,n.jsx)(o,{"aria-hidden":!0,className:"size-4"})," Check again"]})]}),(0,n.jsx)("textarea",{readOnly:!0,value:u,"aria-label":"Sheet script",onFocus:e=>e.currentTarget.select(),className:"mt-4 h-28 w-full rounded-md border border-border bg-bg p-3 font-mono text-xs"})]})}],60538)},82022,e=>{"use strict";var t=e.i(56420);let s={name:"external-link",size:24,node:[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]};s.node;let a=(0,t.default)(s);e.s(["ExternalLink",0,a],82022)},67784,e=>{"use strict";var t=e.i(56420);let s={name:"log-out",size:24,node:[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]};s.node;let a=(0,t.default)(s);e.s(["LogOut",0,a],67784)},15227,32330,e=>{"use strict";var t=e.i(56420);let s={name:"message-circle",size:24,node:[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]]};s.node;let a=(0,t.default)(s);async function n(e,t){let s=await fetch(e,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(t)});if(!s.ok)throw Error(`The sheet answered ${s.status}`);return s.json()}e.s(["MessageCircle",0,a],15227),e.s(["callSheet",0,n],32330)},75387,e=>{"use strict";var t=e.i(56420);let s={name:"phone",size:24,node:[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]};s.node;let a=(0,t.default)(s);e.s(["Phone",0,a],75387)},83890,e=>{"use strict";var t=e.i(43476),s=e.i(22016),a=e.i(18566),n=e.i(45060);let r=[{href:"/admin",label:"Photos"},{href:"/admin/clients",label:"Clients"},{href:"/admin/pricing",label:"Prices"},{href:"/admin/dashboard",label:"Dashboard"}];e.s(["default",0,function(){let e=(0,a.usePathname)().replace(/\/$/,"");return(0,t.jsx)("nav",{"aria-label":"Admin",className:"flex max-w-full gap-1 overflow-x-auto rounded-full border border-border p-1 text-sm",children:r.map(a=>(0,t.jsx)(s.default,{href:a.href,"aria-current":e===a.href?"page":void 0,className:(0,n.cn)("shrink-0 whitespace-nowrap rounded-full px-4 py-2 transition-colors",e===a.href?"bg-fg text-bg":"text-muted hover:text-fg"),children:a.label},a.href))})}])},22303,e=>{"use strict";var t=e.i(43476),s=e.i(71645),a=e.i(22768),n=e.i(8734),r=e.i(82022),i=e.i(11568),o=e.i(67784),l=e.i(56420);let d={name:"mail",size:24,node:[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]};d.node;let c=(0,l.default)(d);var u=e.i(15227);let h={name:"mouse-pointer-click",size:24,node:[["path",{d:"M14 4.1 12 6",key:"ita8i4"}],["path",{d:"m5.1 8-2.9-.8",key:"1go3kf"}],["path",{d:"m6 12-1.9 2",key:"mnht97"}],["path",{d:"M7.2 2.2 8 5.1",key:"1cfko1"}],["path",{d:"M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",key:"s0h3yz"}]]};h.node;let p=(0,l.default)(h);var m=e.i(75387),g=e.i(41120);let x={name:"sheet",size:24,node:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["line",{x1:"3",x2:"21",y1:"9",y2:"9",key:"1vqk6q"}],["line",{x1:"3",x2:"21",y1:"15",y2:"15",key:"o2sbyz"}],["line",{x1:"9",x2:"9",y1:"9",y2:"21",key:"1ib60c"}],["line",{x1:"15",x2:"15",y1:"9",y2:"21",key:"1n26ft"}]]};x.node;let f=(0,l.default)(x),y={name:"smartphone",size:24,node:[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]};y.node;let b=(0,l.default)(y),k={name:"users-round",size:24,node:[["path",{d:"M18 21a8 8 0 0 0-16 0",key:"3ypg7q"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3",key:"10s06x"}]],aliases:["users-2"]};k.node;let v=(0,l.default)(k),w={name:"eye",size:24,node:[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]};w.node;let j=(0,l.default)(w),N={name:"inbox",size:24,node:[["polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12",key:"o97t9d"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}]]};N.node;let S=(0,l.default)(N);var C=e.i(59544),O=e.i(3923),q=e.i(32650),T=e.i(31925),E=e.i(43668),M=e.i(43080),L=e.i(60538),A=e.i(32330),R=e.i(16148),U=e.i(45060);let $=[{days:1,label:"Today"},{days:7,label:"7 days"},{days:30,label:"30 days"},{days:90,label:"90 days"}],z=["New","Replied","Booked","Closed"],D={"/":"Home","/portfolio":"Portfolio","/services":"Services","/about":"About","/contact":"Contact",...Object.fromEntries(R.services.map(e=>[`/services/${e.slug}`,e.title]))},I={ios:"iPhone and iPad",android:"Android",desktop:"Computer"};function P(e,t){let s=new Map;for(let a of e){let e=t(a);e&&s.set(e,(s.get(e)??0)+1)}return[...s.entries()].sort((e,t)=>t[1]-e[1])}let B=e=>{let t=new Date(e);return t.setHours(0,0,0,0),t.getTime()};function H({data:e,days:a,onStatus:n}){let[r,i]=(0,s.useState)("all"),o=e.loadedAt,l=B(o-(a-1)*864e5),d=(0,s.useMemo)(()=>{let t=e.events.filter(e=>e[0]>=l),s=t.filter(e=>"view"===e[1]),n=t.filter(e=>"click"===e[1]),r=new Set(s.map(e=>e[7])),i=new Map;for(let e of[...s].sort((e,t)=>e[0]-t[0]))i.has(e[8])||i.set(e[8],e);let d=new Map;for(let e of s)d.set(e[7],e);let c=new Map;for(let e of s)c.set(B(e[0]),(c.get(B(e[0]))??0)+1);let u=Array.from({length:a},(e,t)=>B(o-(a-1-t)*864e5)).map(e=>({day:e,count:c.get(e)??0}));return{views:s.length,visitors:r.size,clicks:n.length,enquiries:e.enquiries.filter(e=>e.received>=l).length,daily:u,pages:P(s,e=>{let t;return D[t=e[2]]??t}),clicked:P(n,e=>`${e[3]}\u0000${e[4]}`).map(([e,t])=>{let[s,a]=e.split("\0");return{label:s,target:a,n:t}}),devices:P([...d.values()],e=>I[e[6]]??"Other"),sources:P([...i.values()],e=>e[5]||"Direct or unknown")}},[e,a,l,o]),c=e.enquiries.filter(e=>"New"===e.status).length,u="new"===r?e.enquiries.filter(e=>"New"===e.status):e.enquiries;return(0,t.jsxs)("div",{className:"space-y-10",children:[(0,t.jsxs)("ul",{className:"grid grid-cols-2 gap-4 lg:grid-cols-4",children:[(0,t.jsx)(_,{icon:(0,t.jsx)(S,{className:"size-5"}),label:"Enquiries",value:d.enquiries,note:c?`${c} waiting for a reply`:"All answered"}),(0,t.jsx)(_,{icon:(0,t.jsx)(j,{className:"size-5"}),label:"Page visits",value:d.views}),(0,t.jsx)(_,{icon:(0,t.jsx)(v,{className:"size-5"}),label:"Visitors",value:d.visitors,note:"Different people"}),(0,t.jsx)(_,{icon:(0,t.jsx)(p,{className:"size-5"}),label:"Clicks",value:d.clicks})]}),a>1&&(0,t.jsx)(G,{daily:d.daily}),(0,t.jsxs)("section",{"aria-labelledby":"enquiries-title",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-end justify-between gap-4",children:[(0,t.jsx)("h2",{id:"enquiries-title",className:"font-display text-h3",children:"Enquiries"}),(0,t.jsx)("div",{role:"group","aria-label":"Show enquiries",className:"flex gap-2",children:["all","new"].map(s=>(0,t.jsx)("button",{type:"button","aria-pressed":r===s,onClick:()=>i(s),className:(0,U.cn)("h-9 rounded-full border px-3.5 text-sm transition-colors",r===s?"border-fg bg-fg text-bg":"border-border hover:border-border-strong"),children:"all"===s?`All ${e.enquiries.length}`:`New ${c}`},s))})]}),0===u.length?(0,t.jsx)("p",{className:"mt-6 text-sm text-muted",children:0===e.enquiries.length?"No enquiries yet. Everything sent from the contact page will appear here.":"Nothing new. Every enquiry has a status."}):(0,t.jsx)("ul",{className:"mt-6 space-y-4",children:u.map(e=>(0,t.jsx)(F,{q:e,onStatus:n},e.id))})]}),(0,t.jsxs)("div",{className:"grid gap-6 lg:grid-cols-2",children:[(0,t.jsx)(V,{title:"Most visited pages",rows:d.pages.map(([e,t])=>({label:e,n:t})),empty:"No visits in this range yet."}),(0,t.jsx)(V,{title:"Most clicked",rows:d.clicked.map(e=>({label:e.label,sub:e.target,n:e.n})),empty:"No clicks in this range yet."}),(0,t.jsx)(V,{title:"Devices",icon:(0,t.jsx)(b,{className:"size-4"}),rows:d.devices.map(([e,t])=>({label:e,n:t})),empty:"No visitors yet.",percent:!0}),(0,t.jsx)(V,{title:"Where visitors came from",rows:d.sources.map(([e,t])=>({label:e,n:t})),empty:"No visits yet.",percent:!0})]})]})}function _({icon:e,label:s,value:a,note:n}){return(0,t.jsxs)("li",{className:"rounded-lg border border-border bg-surface p-5",children:[(0,t.jsxs)("p",{className:"flex items-center gap-2 text-sm text-muted",children:[(0,t.jsx)("span",{"aria-hidden":!0,children:e})," ",s]}),(0,t.jsx)("p",{className:"tabular mt-3 font-display text-4xl leading-none",children:a.toLocaleString("en-IN")}),n&&(0,t.jsx)("p",{className:"mt-2 text-xs text-muted",children:n})]})}function G({daily:e}){let s=Math.max(1,...e.map(e=>e.count)),a=e=>new Date(e).toLocaleDateString("en-IN",{day:"numeric",month:"short"});return(0,t.jsxs)("section",{"aria-labelledby":"daily-title",className:"rounded-lg border border-border bg-surface p-5",children:[(0,t.jsx)("h2",{id:"daily-title",className:"text-sm text-muted",children:"Page visits per day"}),(0,t.jsx)("div",{className:"mt-5 flex h-40 items-end gap-[2px]",role:"img","aria-label":`Daily page visits, highest ${s}`,children:e.map(e=>(0,t.jsx)("div",{className:"group relative flex h-full flex-1 items-end",title:`${a(e.day)}: ${e.count}`,children:(0,t.jsx)("div",{className:"festive-gradient w-full rounded-t-[3px] transition-opacity group-hover:opacity-80",style:{height:e.count?`${Math.max(4,e.count/s*100)}%`:"2px",opacity:e.count?1:.25}})},e.day))}),(0,t.jsxs)("div",{className:"mt-2 flex justify-between text-xs text-muted",children:[(0,t.jsx)("span",{children:a(e[0].day)}),(0,t.jsx)("span",{children:"Today"})]})]})}function V({title:e,rows:s,empty:a,percent:n,icon:r}){let i=s.reduce((e,t)=>e+t.n,0),o=s[0]?.n??1;return(0,t.jsxs)("section",{className:"rounded-lg border border-border bg-surface p-5",children:[(0,t.jsxs)("h2",{className:"flex items-center gap-2 text-sm text-muted",children:[r&&(0,t.jsx)("span",{"aria-hidden":!0,children:r}),e]}),0===s.length?(0,t.jsx)("p",{className:"mt-4 text-sm text-muted",children:a}):(0,t.jsx)("ol",{className:"mt-4 space-y-2.5",children:s.slice(0,8).map(e=>(0,t.jsxs)("li",{className:"relative",children:[(0,t.jsx)("div",{"aria-hidden":!0,className:"absolute inset-y-0 left-0 rounded-sm bg-fg/[0.06]",style:{width:`${e.n/o*100}%`}}),(0,t.jsxs)("div",{className:"relative flex items-baseline justify-between gap-4 px-2 py-1.5 text-sm",children:[(0,t.jsxs)("span",{className:"min-w-0 truncate",children:[e.label,e.sub&&(0,t.jsx)("span",{className:"ml-2 text-xs text-muted",children:e.sub})]}),(0,t.jsx)("span",{className:"tabular shrink-0",children:n?`${Math.round(e.n/i*100)}%`:e.n.toLocaleString("en-IN")})]})]},`${e.label}-${e.sub}`))})]})}function F({q:e,onStatus:s}){var a,n;let r,i,o,l=(10===(r=e.phone.replace(/\D/g,"")).length&&(r=`91${r}`),r.length>=11?`https://wa.me/${r}`:null),d="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm transition-colors hover:border-fg";return(0,t.jsxs)("li",{className:(0,U.cn)("rounded-lg border bg-surface p-5","New"===e.status?"border-border-strong":"border-border"),children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-start justify-between gap-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("p",{className:"flex flex-wrap items-center gap-2",children:["New"===e.status&&(0,t.jsx)("span",{"aria-hidden":!0,className:"festive-gradient size-2 rounded-full"}),(0,t.jsx)("span",{className:"font-medium",children:e.name}),e.session&&(0,t.jsx)("span",{className:"rounded-full border border-border px-2.5 py-0.5 text-xs",children:e.session})]}),(0,t.jsxs)("p",{className:"mt-1 text-sm text-muted",title:new Date(e.received).toLocaleString("en-IN"),children:[(a=e.received,(i=Math.round((Date.now()-a)/6e4))<1?"just now":i<60?`${i} min ago`:i<1440?`${Math.round(i/60)} h ago`:new Date(a).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})),e.date&&(0,t.jsxs)(t.Fragment,{children:[" · Shoot date ",Number.isNaN(o=Date.parse(n=e.date))?n:new Date(o).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})]}),e.location&&(0,t.jsxs)(t.Fragment,{children:[" · ",e.location]})]})]}),(0,t.jsxs)("label",{className:"text-sm",children:[(0,t.jsxs)("span",{className:"sr-only",children:["Status for ",e.name]}),(0,t.jsx)("select",{value:e.status,onChange:t=>s(e,t.target.value),className:"h-9 rounded-md border border-border bg-bg px-2 text-sm",children:z.map(e=>(0,t.jsx)("option",{children:e},e))})]})]}),(0,t.jsx)("p",{className:"mt-4 whitespace-pre-line text-sm leading-relaxed",children:e.message}),(0,t.jsxs)("div",{className:"mt-4 flex flex-wrap gap-2",children:[(0,t.jsxs)("a",{className:d,href:`mailto:${e.email}?subject=${encodeURIComponent(`Your ${e.session?`${e.session.toLowerCase()} `:""}enquiry with Zoomin Fotos`)}`,children:[(0,t.jsx)(c,{"aria-hidden":!0,className:"size-4"})," ",e.email]}),e.phone&&(0,t.jsxs)("a",{className:d,href:`tel:${e.phone.replace(/[^\d+]/g,"")}`,children:[(0,t.jsx)(m.Phone,{"aria-hidden":!0,className:"size-4"})," ",e.phone]}),l&&(0,t.jsxs)("a",{className:d,href:l,target:"_blank",rel:"noreferrer",children:[(0,t.jsx)(u.MessageCircle,{"aria-hidden":!0,className:"size-4"})," WhatsApp"]})]})]})}function J({token:e,current:a,onSaved:i,onCancel:o}){let[l,d]=(0,s.useState)(a),[c,u]=(0,s.useState)(!1),[h,p]=(0,s.useState)({});async function m(){try{await navigator.clipboard.writeText(M.dashboardScript),u(!0),setTimeout(()=>u(!1),2500)}catch{p({error:"Copying was blocked. Select the code in the box below and copy it by hand."})}}async function g(t){t.preventDefault();let s=l.trim();if(!E.DATA_ENDPOINT_PATTERN.test(s))return void p({error:"Paste the Web app URL Google showed after deploying. It starts with https://script.google.com/macros/s/ and ends in /exec."});p({busy:"Checking the sheet…"});try{let t=await (0,A.callSheet)(s,{type:"read",token:e,days:1});if(!t.ok)throw Error("not-allowed"===t.error?"The sheet could not confirm your access key with GitHub.":t.error)}catch(e){p({error:`${(0,q.explain)(e)} Make sure "Who has access" is set to Anyone, and that you clicked Authorize when Google asked.`});return}p({busy:"Connecting the website…"});try{await (0,T.commitChange)(e,e=>({content:{settings:{...e.settings,dataEndpoint:s}},message:"Connect the studio dashboard sheet"})),i(s)}catch(e){p({error:(0,q.explain)(e)})}}let x="flex gap-4",f="grid size-7 shrink-0 place-items-center rounded-full bg-fg text-xs font-medium text-bg";return(0,t.jsxs)("section",{"aria-labelledby":"setup-title",className:"max-w-3xl",children:[(0,t.jsx)("h2",{id:"setup-title",className:"font-display text-h3",children:"Connect a Google Sheet"}),(0,t.jsx)("p",{className:"mt-2 text-sm text-muted",children:"Your visits and enquiries are kept in a Google Sheet you own. Each new enquiry is also emailed to you. Do this once, on a computer."}),(0,t.jsxs)("ol",{className:"mt-8 space-y-6 text-sm leading-relaxed",children:[(0,t.jsxs)("li",{className:x,children:[(0,t.jsx)("span",{className:f,children:"1"}),(0,t.jsxs)("p",{children:["Open"," ",(0,t.jsxs)("a",{href:"https://sheets.new",target:"_blank",rel:"noreferrer",className:"inline-flex items-center gap-1 font-medium underline underline-offset-2",children:["a new Google Sheet ",(0,t.jsx)(r.ExternalLink,{"aria-hidden":!0,className:"size-3.5"})]})," ","while signed in to the studio's Google account, and name it “Zoomin Fotos dashboard”."]})]}),(0,t.jsxs)("li",{className:x,children:[(0,t.jsx)("span",{className:f,children:"2"}),(0,t.jsxs)("div",{className:"min-w-0 flex-1",children:[(0,t.jsxs)("p",{children:["Choose ",(0,t.jsx)("b",{children:"Extensions › Apps Script"}),". Delete the code that is there, paste this code instead, and click the save icon."]}),(0,t.jsx)("div",{className:"mt-3 flex items-center gap-3",children:(0,t.jsxs)(C.Button,{type:"button",variant:"secondary",onClick:()=>void m(),children:[(0,t.jsx)(n.Copy,{"aria-hidden":!0,className:"size-4"})," ",c?"Copied":"Copy the code"]})}),(0,t.jsx)("textarea",{readOnly:!0,value:M.dashboardScript,"aria-label":"Dashboard script",onFocus:e=>e.currentTarget.select(),className:"mt-3 h-32 w-full rounded-md border border-border bg-bg p-3 font-mono text-xs"})]})]}),(0,t.jsxs)("li",{className:x,children:[(0,t.jsx)("span",{className:f,children:"3"}),(0,t.jsxs)("p",{children:["Click ",(0,t.jsx)("b",{children:"Deploy › New deployment"}),", choose the type ",(0,t.jsx)("b",{children:"Web app"}),", set ",(0,t.jsx)("b",{children:"Execute as"})," to Me and ",(0,t.jsx)("b",{children:"Who has access"})," to"," ",(0,t.jsx)("b",{children:"Anyone"}),", then click Deploy. Google asks you to authorise it: choose your account, then ",(0,t.jsx)("b",{children:"Advanced › Go to project"})," and"," ",(0,t.jsx)("b",{children:"Allow"}),". This lets it save to your sheet and email you."]})]}),(0,t.jsxs)("li",{className:x,children:[(0,t.jsx)("span",{className:f,children:"4"}),(0,t.jsxs)("form",{onSubmit:g,className:"min-w-0 flex-1 space-y-4",children:[(0,t.jsx)(O.TextField,{id:"sheet-url",label:"Copy the Web app URL Google shows and paste it here",value:l,placeholder:"https://script.google.com/macros/s/…/exec",onChange:e=>d(e.target.value),error:h.error,required:!0}),(0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-4",children:[(0,t.jsx)(C.Button,{type:"submit",loading:!!h.busy,loadingLabel:h.busy??"Saving…",children:"Connect"}),o&&(0,t.jsx)("button",{type:"button",onClick:o,className:"text-sm text-muted hover:text-fg",children:"Cancel"})]}),(0,t.jsx)("p",{className:"text-muted",children:"After connecting, the website starts counting visits and saving enquiries within about two minutes."})]})]})]})]})}e.s(["default",0,function(){let[e,n]=(0,s.useState)(null),[r,l]=(0,s.useState)(!0),[d,c]=(0,s.useState)(null),[u,h]=(0,s.useState)(""),[p,m]=(0,s.useState)(!1),[x,y]=(0,s.useState)(30),[b,k]=(0,s.useState)(null),[v,w]=(0,s.useState)(!1),[j,N]=(0,s.useState)(null),[S,C]=(0,s.useState)(!1),O=(0,s.useCallback)(async(e,t)=>{l(!0),c(null);try{let{canSave:s}=await (0,T.verifyToken)(e);if(!s)throw new T.GitHubError("forbidden",403);let{content:a}=await (0,T.loadContent)(e);(0,q.storeToken)(e,t),n(e),h(a.settings.dataEndpoint??"")}catch(e){(0,q.storeToken)(null,!1),n(null),c({kind:"error",text:(0,q.explain)(e)})}finally{l(!1)}},[]);(0,s.useEffect)(()=>{let e=(0,q.readStoredToken)();e?O(e,(0,q.remembered)()):l(!1)},[O]);let E=(0,s.useCallback)(async()=>{if(e&&u){w(!0),N(null);try{let t=await (0,A.callSheet)(u,{type:"read",token:e,days:x});if(!t.ok)throw Error("not-allowed"===t.error?"The sheet did not accept your access key.":t.error??"The sheet sent an error.");k({...t,loadedAt:Date.now()}),C((t.version??1)<M.SCRIPT_VERSION)}catch(e){N(`${(0,q.explain)(e)} If you redeployed the script, check it is set to run for anyone.`)}finally{w(!1)}}},[e,u,x]);async function R(t,s){if(e&&u&&b){k({...b,enquiries:b.enquiries.map(e=>e.id===t.id?{...e,status:s}:e)});try{let a=await (0,A.callSheet)(u,{type:"status",token:e,id:t.id,status:s});if(!a.ok)throw Error(a.error)}catch{k(b),N("That status change did not save. Please try again.")}}}return((0,s.useEffect)(()=>{E()},[E]),r)?(0,t.jsxs)("p",{className:"flex items-center gap-2 text-muted",role:"status",children:[(0,t.jsx)(i.LoaderCircle,{"aria-hidden":!0,className:"size-4 animate-spin"})," Checking your sign-in…"]}):e?(0,t.jsxs)("div",{className:"space-y-10",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6",children:[u&&!p?(0,t.jsxs)("div",{role:"group","aria-label":"Time range",className:"flex flex-wrap gap-2",children:[$.map(e=>(0,t.jsx)("button",{type:"button","aria-pressed":x===e.days,onClick:()=>y(e.days),className:(0,U.cn)("h-9 rounded-full border px-3.5 text-sm transition-colors",x===e.days?"border-fg bg-fg text-bg":"border-border hover:border-border-strong"),children:e.label},e.days)),(0,t.jsxs)("button",{type:"button",onClick:()=>void E(),disabled:v,className:"inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-muted hover:text-fg",children:[(0,t.jsx)(g.RefreshCw,{"aria-hidden":!0,className:(0,U.cn)("size-4",v&&"animate-spin")})," Refresh"]})]}):(0,t.jsx)("p",{className:"text-sm text-muted",children:"One-time setup, about five minutes."}),(0,t.jsxs)("button",{type:"button",onClick:()=>{(0,q.storeToken)(null,!1),n(null),k(null)},className:"inline-flex items-center gap-2 text-sm font-medium hover:text-accent",children:[(0,t.jsx)(o.LogOut,{"aria-hidden":!0,className:"size-4"})," Sign out"]})]}),!u||p?(0,t.jsx)(J,{token:e,current:u,onCancel:u?()=>m(!1):void 0,onSaved:e=>{h(e),m(!1)}}):(0,t.jsxs)(t.Fragment,{children:[j&&(0,t.jsxs)("p",{role:"alert",className:"flex items-start gap-2 rounded-md border border-error/40 p-4 text-sm text-error",children:[(0,t.jsx)(a.CircleAlert,{"aria-hidden":!0,className:"mt-0.5 size-4 shrink-0"})," ",j]}),S&&(0,t.jsx)(L.default,{reason:"A newer version of the sheet script adds client bookings and the client portal.",onDone:()=>void E()}),!b&&v&&(0,t.jsxs)("p",{className:"flex items-center gap-2 text-muted",role:"status",children:[(0,t.jsx)(i.LoaderCircle,{"aria-hidden":!0,className:"size-4 animate-spin"})," Loading your numbers…"]}),b&&(0,t.jsx)(H,{data:b,days:x,onStatus:R}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-sm text-muted",children:[b?.sheetUrl&&(0,t.jsxs)("a",{href:b.sheetUrl,target:"_blank",rel:"noreferrer",className:"inline-flex items-center gap-1.5 hover:text-fg",children:[(0,t.jsx)(f,{"aria-hidden":!0,className:"size-4"})," Open the Google Sheet"]}),(0,t.jsx)("button",{type:"button",onClick:()=>m(!0),className:"hover:text-fg",children:"Connect a different sheet"}),(0,t.jsx)("span",{children:"Visits from devices you sign in on are not counted."})]})]})]}):(0,t.jsx)(q.SignIn,{onSignIn:O,notice:d})}],22303)},32650,31925,e=>{"use strict";var t=e.i(43476),s=e.i(71645),a=e.i(59544),n=e.i(3923);let{owner:r,repo:i,branch:o}=e.i(31338).contentRepo,l=`/repos/${r}/${i}`,d={photos:"src/content/photos.json",videos:"src/content/videos.json",settings:"src/content/settings.json",pricing:"src/content/pricing.json"};class c extends Error{status;constructor(e,t){super(e),this.status=t}}async function u(e,t,s={}){let a=await fetch(`https://api.github.com${t}`,{...s,cache:"no-store",headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${e}`,"X-GitHub-Api-Version":"2022-11-28",...s.body?{"Content-Type":"application/json"}:{}}});if(!a.ok)throw new c((await a.json().catch(()=>({}))).message??a.statusText,a.status);return a.json()}async function h(e){let[t,s]=await Promise.all([u(e,"/user").catch(()=>({login:""})),u(e,l)]);return{login:t.login,canSave:!!s.permissions?.push}}async function p(e){return(await u(e,`${l}/git/ref/heads/${o}`)).object.sha}async function m(e,t){let s=async(s,a=[])=>{try{let a,n=await u(e,`${l}/contents/${s}?ref=${t}`);return JSON.parse((a=n.content,new TextDecoder().decode(Uint8Array.from(atob(a.replace(/\s/g,"")),e=>e.charCodeAt(0)))))}catch(e){if(e instanceof c&&404===e.status)return a;throw e}},[a,n,r,i]=await Promise.all([s(d.photos),s(d.videos),s(d.settings,{}),s(d.pricing,{prices:{},eventShare:{}})]);return{photos:a,videos:n,settings:r,pricing:i}}async function g(e){let t=await p(e);return{sha:t,content:await m(e,t)}}async function x(e,t,s=0){let a=await p(e),[n,r]=await Promise.all([m(e,a),u(e,`${l}/git/commits/${a}`)]),{content:i,files:h=[],message:g}=t(n),f=(t,s)=>u(e,`${l}/git/blobs`,{method:"POST",body:JSON.stringify({content:t,encoding:s})}),y=await Promise.all([...Object.keys(i).map(async e=>({path:d[e],sha:(await f(`${JSON.stringify(i[e],null,2)}
`,"utf-8")).sha})),...h.map(async e=>({path:e.path,sha:null===e.base64?null:(await f(e.base64,"base64")).sha}))]),b=await u(e,`${l}/git/trees`,{method:"POST",body:JSON.stringify({base_tree:r.tree.sha,tree:y.map(e=>({path:e.path,mode:"100644",type:"blob",sha:e.sha}))})}),k=await u(e,`${l}/git/commits`,{method:"POST",body:JSON.stringify({message:g,tree:b.sha,parents:[a]})});try{await u(e,`${l}/git/refs/heads/${o}`,{method:"PATCH",body:JSON.stringify({sha:k.sha,force:!1})})}catch(a){if(a instanceof c&&422===a.status&&s<2)return x(e,t,s+1);throw a}return{sha:k.sha,content:{...n,...i}}}async function f(e,t){return(await u(e,`${l}/commits/gh-pages`)).commit.message.includes(t)}e.s(["GitHubError",0,c,"commitChange",0,x,"isPublished",0,f,"loadContent",0,g,"rawUrl",0,(e,t)=>`https://raw.githubusercontent.com/${r}/${i}/${t}/public${e}`,"verifyToken",0,h],31925);var y=e.i(74629);let b="zf-admin-token";e.s(["SignIn",0,function({onSignIn:e,notice:r}){let[i,o]=(0,s.useState)(""),[l,d]=(0,s.useState)(!0);return(0,t.jsxs)("div",{className:"grid gap-12 lg:grid-cols-12 lg:gap-x-10",children:[(0,t.jsxs)("form",{className:"space-y-5 lg:col-span-5",onSubmit:t=>{t.preventDefault(),i.trim()&&e(i.trim(),l)},children:[(0,t.jsx)(n.TextField,{id:"admin-key",label:"Access key",type:"password",autoComplete:"current-password",value:i,onChange:e=>o(e.target.value),error:r?.kind==="error"?r.text:void 0,hint:"Your GitHub access key for the website. It stays on this device and is only sent to GitHub and to your own dashboard sheet.",required:!0}),(0,t.jsxs)("label",{className:"flex items-center gap-2 text-sm",children:[(0,t.jsx)("input",{type:"checkbox",checked:l,onChange:e=>d(e.target.checked),className:"size-4 accent-[var(--rani)]"}),"Keep me signed in on this device"]}),(0,t.jsx)(a.Button,{type:"submit",children:"Sign in"})]}),(0,t.jsxs)("div",{className:"rounded-lg border border-border bg-surface p-6 text-sm leading-relaxed lg:col-span-6 lg:col-start-7",children:[(0,t.jsx)("h2",{className:"font-medium",children:"Getting an access key (one time)"}),(0,t.jsxs)("ol",{className:"mt-3 list-decimal space-y-2 pl-5 text-muted",children:[(0,t.jsxs)("li",{children:["Sign in to GitHub and open"," ",(0,t.jsx)("a",{className:"text-fg underline underline-offset-2",href:"https://github.com/settings/personal-access-tokens/new",target:"_blank",rel:"noreferrer",children:"new fine-grained token"}),"."]}),(0,t.jsx)("li",{children:"Name it “Zoomin Fotos admin” and pick an expiry date."}),(0,t.jsxs)("li",{children:["Under ",(0,t.jsx)("span",{className:"text-fg",children:"Repository access"}),", choose ",(0,t.jsx)("span",{className:"text-fg",children:"Only select repositories"})," and pick ",(0,t.jsx)("span",{className:"text-fg",children:"Zoomin-Fotos"}),"."]}),(0,t.jsxs)("li",{children:["Under ",(0,t.jsx)("span",{className:"text-fg",children:"Permissions"}),", set ",(0,t.jsx)("span",{className:"text-fg",children:"Contents"})," to"," ",(0,t.jsx)("span",{className:"text-fg",children:"Read and write"}),"."]}),(0,t.jsx)("li",{children:"Generate the token, copy it, and paste it here."})]})]})]})},"explain",0,function(e){return e instanceof c?401===e.status?"That access key was not accepted. It may have expired; create a new one and sign in again.":403===e.status||404===e.status?"This access key cannot change the website. Check it has Contents: Read and write access to the Zoomin-Fotos repository.":`GitHub said: ${e.message}`:e instanceof Error?e.message:"Something went wrong. Please try again."},"readStoredToken",0,function(){try{return localStorage.getItem(b)??sessionStorage.getItem(b)}catch{return null}},"remembered",0,function(){try{return null!==localStorage.getItem(b)}catch{return!1}},"storeToken",0,function(e,t){try{if(localStorage.removeItem(b),sessionStorage.removeItem(b),!e)return;(t?localStorage:sessionStorage).setItem(b,e),localStorage.setItem(y.NO_TRACK_KEY,"1")}catch{}}],32650)}]);