(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,11241,e=>{"use strict";var t=e.i(56420);let a={name:"arrow-left",size:24,node:[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]};a.node;let n=(0,t.default)(a);e.s(["ArrowLeft",0,n],11241)},89664,e=>{"use strict";var t=e.i(56420);let a={name:"check",size:24,node:[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]};a.node;let n=(0,t.default)(a);e.s(["Check",0,n],89664)},22768,3923,e=>{"use strict";var t=e.i(56420);let a={name:"circle-alert",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],aliases:["alert-circle"]};a.node;let n=(0,t.default)(a);e.s(["CircleAlert",0,n],22768);var s=e.i(43476),r=e.i(89664),i=e.i(45060);let o="block w-full rounded-md border bg-elevated px-3.5 text-[0.9375rem] text-fg shadow-sm transition-[border-color,box-shadow] duration-150 placeholder:text-muted/70 hover:border-border-strong focus:border-fg focus:outline-none focus:ring-4 focus:ring-fg/10 disabled:cursor-not-allowed disabled:opacity-60";function l({id:e,label:t,hint:a,error:r,optional:i,children:o}){return(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{className:"flex items-baseline justify-between gap-4",children:[(0,s.jsx)("label",{htmlFor:e,className:"text-sm font-medium",children:t}),i&&(0,s.jsx)("span",{className:"text-xs text-muted",children:"Optional"})]}),(0,s.jsx)("div",{className:"mt-2",children:o}),r?(0,s.jsxs)("p",{id:`${e}-error`,className:"mt-2 flex items-start gap-1.5 text-sm text-error",children:[(0,s.jsx)(n,{"aria-hidden":!0,className:"mt-0.5 size-3.5 shrink-0"}),r]}):a&&(0,s.jsx)("p",{id:`${e}-hint`,className:"mt-2 text-sm text-muted",children:a})]})}function d(e,t,a){return t?`${e}-error`:a?`${e}-hint`:void 0}e.s(["ChoiceGroup",0,function({legend:e,name:t,type:a,options:r,defaultValue:o,error:l}){let d=`${t}-error`;return(0,s.jsxs)("fieldset",{"aria-describedby":l?d:void 0,"aria-invalid":!!l||void 0,children:[(0,s.jsx)("legend",{className:"text-sm font-medium",children:e}),(0,s.jsx)("div",{className:"mt-3 flex flex-wrap gap-2",children:r.map(e=>(0,s.jsxs)("label",{className:(0,i.cn)("relative inline-flex h-10 cursor-pointer select-none items-center rounded-md border px-3.5 text-sm transition-colors","border-border bg-elevated hover:border-border-strong","has-[:checked]:border-fg has-[:checked]:bg-fg has-[:checked]:text-bg","has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fg"),children:[(0,s.jsx)("input",{type:a,name:t,value:e,defaultChecked:o.includes(e),className:"sr-only"}),e]},e))}),l&&(0,s.jsxs)("p",{id:d,className:"mt-2 flex items-start gap-1.5 text-sm text-error",children:[(0,s.jsx)(n,{"aria-hidden":!0,className:"mt-0.5 size-3.5 shrink-0"}),l]})]})},"TextField",0,function({id:e,label:t,hint:a,error:n,optional:c,valid:u,className:m,...h}){return(0,s.jsx)(l,{id:e,label:t,hint:a,error:n,optional:c,children:(0,s.jsxs)("div",{className:"relative",children:[(0,s.jsx)("input",{id:e,"aria-invalid":!!n||void 0,"aria-describedby":d(e,n,a),className:(0,i.cn)(o,"h-12",n?"border-error":u?"border-success/60 pr-10":"border-border",m),...h}),u&&!n&&(0,s.jsx)(r.Check,{"aria-hidden":!0,className:"pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-success"})]})})},"TextareaField",0,function({id:e,label:t,hint:a,error:n,className:r,...c}){return(0,s.jsx)(l,{id:e,label:t,hint:a,error:n,children:(0,s.jsx)("textarea",{id:e,"aria-invalid":!!n||void 0,"aria-describedby":d(e,n,a),className:(0,i.cn)(o,"min-h-36 resize-y py-3 leading-relaxed",n?"border-error":"border-border",r),...c})})},"control",0,o],3923)},85595,e=>{"use strict";var t=e.i(56420);let a={name:"circle-check",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 9-5.5 5.5L8 12",key:"xofnsj"}]],aliases:["check-circle-2"]};a.node;let n=(0,t.default)(a);e.s(["CircleCheck",0,n],85595)},8734,41120,43080,60538,e=>{"use strict";var t=e.i(56420);let a={name:"copy",size:24,node:[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]};a.node;let n=(0,t.default)(a);e.s(["Copy",0,n],8734);var s=e.i(43476),r=e.i(71645);let i={name:"refresh-cw",size:24,node:[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]};i.node;let o=(0,t.default)(i);e.s(["RefreshCw",0,o],41120);var l=e.i(59544),d=e.i(16148),c=e.i(31338);let u=`// Zoomin Fotos dashboard and client portal. Paste this whole file into Extensions > Apps Script.
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
`;e.s(["SCRIPT_VERSION",0,2,"dashboardScript",0,u],43080),e.s(["default",0,function({onDone:e,reason:t}){let[a,i]=(0,r.useState)(!1),d=async()=>{try{await navigator.clipboard.writeText(u),i(!0),setTimeout(()=>i(!1),2500)}catch{}};return(0,s.jsxs)("section",{"aria-labelledby":"update-title",className:"max-w-3xl rounded-lg border border-border-strong bg-surface p-6",children:[(0,s.jsx)("h2",{id:"update-title",className:"font-display text-2xl",children:"Update your sheet script"}),(0,s.jsxs)("p",{className:"mt-2 text-sm text-muted",children:[t," It takes about two minutes, and the web address stays the same."]}),(0,s.jsxs)("ol",{className:"mt-5 list-decimal space-y-2 pl-5 text-sm leading-relaxed",children:[(0,s.jsxs)("li",{children:["Open your “Zoomin Fotos dashboard” Google Sheet and choose ",(0,s.jsx)("b",{children:"Extensions › Apps Script"}),"."]}),(0,s.jsx)("li",{children:"Delete all the code there, paste the new code, and click the save icon."}),(0,s.jsxs)("li",{children:["Click ",(0,s.jsx)("b",{children:"Deploy › Manage deployments"}),", click the pencil icon, set ",(0,s.jsx)("b",{children:"Version"})," to ",(0,s.jsx)("b",{children:"New version"}),", and click"," ",(0,s.jsx)("b",{children:"Deploy"}),". If Google asks, authorise it again."]}),(0,s.jsx)("li",{children:"Come back here and press Check again."})]}),(0,s.jsxs)("div",{className:"mt-5 flex flex-wrap gap-3",children:[(0,s.jsxs)(l.Button,{type:"button",variant:"secondary",onClick:()=>void d(),children:[(0,s.jsx)(n,{"aria-hidden":!0,className:"size-4"})," ",a?"Copied":"Copy the new code"]}),(0,s.jsxs)(l.Button,{type:"button",onClick:e,children:[(0,s.jsx)(o,{"aria-hidden":!0,className:"size-4"})," Check again"]})]}),(0,s.jsx)("textarea",{readOnly:!0,value:u,"aria-label":"Sheet script",onFocus:e=>e.currentTarget.select(),className:"mt-4 h-28 w-full rounded-md border border-border bg-bg p-3 font-mono text-xs"})]})}],60538)},95774,55099,70382,19496,e=>{"use strict";var t=e.i(56420);let a={name:"file-pen-line",size:24,node:[["path",{d:"M14.364 13.634a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506l4.013-4.009a1 1 0 0 0-3.004-3.004z",key:"ukzhwg"}],["path",{d:"M14.487 7.858A1 1 0 0 1 14 7V2",key:"1klhew"}],["path",{d:"M20 19.645V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l2.516 2.516",key:"rxaxab"}],["path",{d:"M8 18h1",key:"13wk12"}]],aliases:["file-signature"]};a.node;let n=(0,t.default)(a);e.s(["FileSignature",0,n],95774);var s=e.i(43476),r=e.i(77071),i=e.i(59659),o=e.i(45060);let l="h-10 w-full min-w-0 rounded-md border border-border-strong bg-bg px-3 text-sm outline-none transition-colors focus:border-fg disabled:opacity-60",d={2:"sm:col-span-2",3:"sm:col-span-3",4:"sm:col-span-4",5:"sm:col-span-5",6:"sm:col-span-6",7:"sm:col-span-7",8:"sm:col-span-8",9:"sm:col-span-9",12:"sm:col-span-12"};e.s(["default",0,function({fields:e,rows:t,onChange:a,blank:n,addLabel:c,empty:u,max:m=60,disabled:h,label:p}){let g=(e,n,s)=>a(t.map((t,a)=>a===e?{...t,[n]:"number"==typeof t[n]?Number(s)||0:s}:t));return(0,s.jsxs)("div",{children:[0===t.length&&u&&(0,s.jsx)("p",{className:"text-sm text-muted",children:u}),(0,s.jsx)("ol",{className:"space-y-3",children:t.map((n,r)=>(0,s.jsxs)("li",{className:"flex gap-2 rounded-lg border border-border bg-bg/40 p-3 sm:border-0 sm:bg-transparent sm:p-0",children:[(0,s.jsx)("div",{className:"grid min-w-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-12",children:e.map(e=>{let t=`${p}-${r}-${e.key}`.replace(/\W+/g,"-"),a=String(n[e.key]??"");return(0,s.jsxs)("label",{htmlFor:t,className:(0,o.cn)(e.half?"col-span-1":"col-span-2","min-w-0",d[e.span??3]??"sm:col-span-3"),children:[(0,s.jsx)("span",{className:(0,o.cn)("mb-1 block text-xs text-muted",r>0&&"sm:sr-only"),children:e.label}),"select"===e.type?(0,s.jsx)("select",{id:t,value:a,disabled:h,onChange:t=>g(r,e.key,t.target.value),className:l,children:e.options?.map(e=>(0,s.jsx)("option",{children:e},e))}):(0,s.jsx)("input",{id:t,type:"number"===e.type?"text":e.type??"text",inputMode:"number"===e.type?"numeric":void 0,value:"number"===e.type&&"0"===a?"":a,placeholder:"number"===e.type?"0":e.placeholder,disabled:h,onChange:t=>g(r,e.key,"number"===e.type?t.target.value.replace(/[^\d]/g,""):t.target.value),className:(0,o.cn)(l,"number"===e.type&&"tabular text-right")})]},e.key)})}),!h&&(0,s.jsx)("button",{type:"button",onClick:()=>a(t.filter((e,t)=>t!==r)),className:(0,o.cn)("grid size-10 shrink-0 place-items-center self-end rounded-md text-muted hover:text-error",0===r&&"sm:mt-5"),"aria-label":`Remove row ${r+1} from ${p}`,children:(0,s.jsx)(i.Trash2,{"aria-hidden":!0,className:"size-4"})})]},r))}),!h&&t.length<m&&(0,s.jsxs)("button",{type:"button",onClick:()=>a([...t,n()]),className:"mt-3 inline-flex h-10 items-center gap-1.5 rounded-md border border-dashed border-border-strong px-3 text-sm hover:border-fg",children:[(0,s.jsx)(r.Plus,{"aria-hidden":!0,className:"size-4"})," ",c]})]})}],55099);var c=e.i(81307),u=e.i(16148);let m=e=>c.z.string().max(e).default(""),h=(e,t=60)=>c.z.array(c.z.object(e)).max(t).default([]),p=c.z.object({timeline:h({date:m(20),time:m(20),title:m(120),place:m(160)}),shots:h({text:m(200),by:m(20)},150),venues:h({event:m(60),name:m(120),address:m(240),map:m(400)}),family:h({name:m(80),relation:m(60),side:m(20),phone:m(30),note:m(200)},100)}),g=["teaser","photos","videos","album"],b=["Not started","In progress","Ready"],f=c.z.object({code:c.z.string().regex(/^ZF-[A-Z0-9]{4,8}$/),title:m(120),client:c.z.object({names:m(120),email:m(200),phone:m(30)}).default({names:"",email:"",phone:""}),eventDate:m(20),package:c.z.object({name:m(80),items:h({label:m(160),amount:c.z.number().min(0).default(0)},40),discount:c.z.number().min(0).default(0),gstRate:c.z.number().min(0).max(28).default(18),notes:m(1e3)}).default({name:"",items:[],discount:0,gstRate:18,notes:""}),advance:c.z.number().min(0).default(0),contract:c.z.object({text:m(2e4),signed:c.z.object({name:c.z.string(),at:c.z.number(),text:c.z.string()}).optional()}).default({text:""}),payments:h({id:c.z.string(),amount:c.z.number().min(0),reference:m(80),at:c.z.number(),method:m(30),status:c.z.enum(["claimed","confirmed"])},30),planning:p.default({timeline:[],shots:[],venues:[],family:[]}),team:h({name:m(80),role:m(60),phone:m(30)},20),schedule:h({date:m(20),time:m(20),title:m(160)}),delivery:h({kind:c.z.enum(g),status:c.z.enum(b),url:m(400),note:m(200),expected:m(20)},8),updatedAt:c.z.number().default(0)}),x=(e,t)=>Array.from(crypto.getRandomValues(new Uint8Array(t)),t=>e[t%e.length]).join("");function y(e){let t=e.package.items.reduce((e,t)=>e+t.amount,0),a=Math.max(0,t-e.package.discount),n=Math.round(a*e.package.gstRate/100),s=a+n,r=e.payments.filter(e=>"confirmed"===e.status).reduce((e,t)=>e+t.amount,0);return{subtotal:t,taxable:a,gst:n,total:s,paid:r,claimed:e.payments.filter(e=>"claimed"===e.status).reduce((e,t)=>e+t.amount,0),balance:Math.max(0,s-r),advanceDue:Math.max(0,e.advance-r)}}e.s(["blankBooking",0,function(){return f.parse({code:`ZF-${x("ABCDEFGHJKLMNPQRSTUVWXYZ23456789",5)}`,package:{name:"",items:[],discount:0,gstRate:18,notes:""},delivery:g.map(e=>({kind:e,status:"Not started",url:"",note:"",expected:""}))})},"bookingSchema",0,f,"deliveryNames",0,{teaser:"Teaser",photos:"Photos",videos:"Videos",album:"Album"},"deliveryStatuses",0,b,"money",0,y,"newPin",0,()=>x("0123456789",6),"stage",0,function(e){if(!e.contract.signed)return"agreement";let t=y(e);return t.paid>=e.advance?"confirmed":t.paid+t.claimed>=e.advance?"verifying":"payment"},"stageLabel",0,{agreement:"Waiting for signature",payment:"Waiting for advance",verifying:"Checking payment",confirmed:"Confirmed"},"standardAgreement",0,function(e){var t;let a,n=y(e),s=e.package.items.map(e=>`  • ${e.label}${e.amount?`: ${(0,u.formatRupees)(e.amount)}`:""}`).join("\n");return`PHOTOGRAPHY AND FILM AGREEMENT

This agreement is between ${u.brand.name}, ${u.brand.city}, ${u.brand.region} ("the Studio"), and ${e.client.names||"the Client"} ("the Client"), for ${e.title||"the event"} on ${Number.isNaN(a=Date.parse(t=e.eventDate))?t||"the agreed date":new Date(a).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}.

1. Services
The Studio will provide the ${e.package.name||"agreed"} package:
${s||"  • As described in the quote"}
${e.package.notes?`
Notes: ${e.package.notes}
`:""}
2. Fees and payment
The total fee is ${(0,u.formatRupees)(n.total)}, including GST at ${e.package.gstRate}%. An advance of ${(0,u.formatRupees)(e.advance)} confirms the booking and reserves the date. The balance is due on or before the event date, unless agreed otherwise in writing.

3. Cancellation and changes
The advance is non-refundable, as the Studio turns away other work for the date. If the Client cancels more than 60 days before the event, any amount paid beyond the advance is refunded. If the date moves, the Studio will try to transfer the booking to the new date, subject to availability. If the Studio cannot attend for reasons beyond its control, it will arrange a suitable replacement photographer or refund all payments.

4. Travel and stay
Coverage outside ${u.brand.city} includes travel and stay for the team, quoted at cost and payable in addition to the fee.

5. Delivery
A preview is delivered within 72 hours. The edited photographs, films and album are delivered within the timelines given in the quote, usually four to eight weeks. Album designs are shared for approval before printing.

6. Client responsibilities
The Client will share the schedule, venues and key family contacts at least two weeks before the event, and will arrange any permissions the venues require for photography, video or drone.

7. Copyright and use
The Studio owns the copyright in the photographs and films and grants the Client a personal licence to print, share and keep them for any non-commercial use. The Studio may use a selection of the work for its portfolio and social media; the Client can ask in writing for any image to be left out.

8. Liability
The Studio works with backup cameras and duplicate cards. In the unlikely event that work is lost or damaged, the Studio's liability is limited to the amount the Client has paid.

By signing below, both parties agree to these terms.`}],70382),e.s(["blanks",0,{timeline:()=>({date:"",time:"",title:"",place:""}),shots:()=>({text:"",by:""}),venues:()=>({event:"",name:"",address:"",map:""}),family:()=>({name:"",relation:"",side:"Bride",phone:"",note:""}),items:()=>({label:"",amount:0}),team:()=>({name:"",role:"",phone:""}),schedule:()=>({date:"",time:"",title:""})},"bookingFields",0,{timeline:[{key:"date",label:"Date",type:"date",span:3,half:!0},{key:"time",label:"Time",type:"time",span:2,half:!0},{key:"title",label:"What",placeholder:"Haldi",span:3},{key:"place",label:"Where",placeholder:"Home, Cuttack",span:4}],shots:[{key:"text",label:"Photo you'd like",placeholder:"Bride with her grandmother",span:12}],venues:[{key:"event",label:"Event",placeholder:"Reception",span:2},{key:"name",label:"Venue",placeholder:"Mayfair Lagoon",span:3},{key:"address",label:"Address",span:4},{key:"map",label:"Map link",type:"url",placeholder:"https://maps.app.goo.gl/…",span:3}],family:[{key:"name",label:"Name",span:3},{key:"relation",label:"Relation",placeholder:"Bride's mother",span:3,half:!0},{key:"side",label:"Side",type:"select",options:["Bride","Groom","Both"],span:2,half:!0},{key:"phone",label:"Phone",type:"tel",span:2},{key:"note",label:"Note",placeholder:"Must be in the family photos",span:2}],items:[{key:"label",label:"Item",placeholder:"Wedding day: 2 photographers, 1 cinematographer",span:9},{key:"amount",label:"Amount (₹)",type:"number",span:3}],team:[{key:"name",label:"Name",span:4},{key:"role",label:"Role",placeholder:"Lead photographer",span:4,half:!0},{key:"phone",label:"Phone",type:"tel",span:4,half:!0}],schedule:[{key:"date",label:"Date",type:"date",span:3,half:!0},{key:"time",label:"Time",type:"time",span:2,half:!0},{key:"title",label:"What happens",placeholder:"Team arrives at the venue",span:7}],delivery:[{key:"status",label:"Status",type:"select",options:b,span:2,half:!0},{key:"expected",label:"Expected",type:"date",span:2,half:!0},{key:"url",label:"Link",type:"url",placeholder:"YouTube, Google Drive or gallery link",span:4},{key:"note",label:"Note",span:4}]}],19496)},67784,e=>{"use strict";var t=e.i(56420);let a={name:"log-out",size:24,node:[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]};a.node;let n=(0,t.default)(a);e.s(["LogOut",0,n],67784)},15227,32330,e=>{"use strict";var t=e.i(56420);let a={name:"message-circle",size:24,node:[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]]};a.node;let n=(0,t.default)(a);async function s(e,t){let a=await fetch(e,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(t)});if(!a.ok)throw Error(`The sheet answered ${a.status}`);return a.json()}e.s(["MessageCircle",0,n],15227),e.s(["callSheet",0,s],32330)},77071,e=>{"use strict";var t=e.i(56420);let a={name:"plus",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]};a.node;let n=(0,t.default)(a);e.s(["Plus",0,n],77071)},59659,e=>{"use strict";var t=e.i(56420);let a={name:"trash",size:24,node:[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],aliases:["trash-2"]};a.node;let n=(0,t.default)(a);e.s(["Trash2",0,n],59659)},83890,e=>{"use strict";var t=e.i(43476),a=e.i(22016),n=e.i(18566),s=e.i(45060);let r=[{href:"/admin",label:"Photos"},{href:"/admin/clients",label:"Clients"},{href:"/admin/pricing",label:"Prices"},{href:"/admin/dashboard",label:"Dashboard"}];e.s(["default",0,function(){let e=(0,n.usePathname)().replace(/\/$/,"");return(0,t.jsx)("nav",{"aria-label":"Admin",className:"flex max-w-full gap-1 overflow-x-auto rounded-full border border-border p-1 text-sm",children:r.map(n=>(0,t.jsx)(a.default,{href:n.href,"aria-current":e===n.href?"page":void 0,className:(0,s.cn)("shrink-0 whitespace-nowrap rounded-full px-4 py-2 transition-colors",e===n.href?"bg-fg text-bg":"text-muted hover:text-fg"),children:n.label},n.href))})}])},78725,e=>{"use strict";var t=e.i(43476),a=e.i(71645),n=e.i(22016),s=e.i(11241),r=e.i(89664),i=e.i(22768),o=e.i(85595),l=e.i(8734),d=e.i(95774),c=e.i(56420);let u={name:"key-round",size:24,node:[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]]};u.node;let m=(0,c.default)(u);var h=e.i(11568),p=e.i(67784),g=e.i(15227),b=e.i(77071),f=e.i(59659),x=e.i(65649),y=e.i(59544),k=e.i(3923),v=e.i(55099),j=e.i(19496),N=e.i(60538),w=e.i(32650),S=e.i(70382),C=e.i(31925),T=e.i(43080),R=e.i(32330),A=e.i(43668),L=e.i(16148),P=e.i(31338),M=e.i(45060);let z=(0,P.absoluteUrl)("/portal"),O={agreement:"border-border text-muted",payment:"border-[var(--marigold)] text-[var(--marigold)]",verifying:"border-[var(--rani)] text-[var(--rani)]",confirmed:"border-success text-success"};function I({notice:e}){let a="error"===e.kind;return(0,t.jsxs)("p",{role:a?"alert":"status",className:(0,M.cn)("flex items-start gap-2 rounded-md border p-4 text-sm",a?"border-error/40 text-error":"border-success/40"),children:[a?(0,t.jsx)(i.CircleAlert,{"aria-hidden":!0,className:"mt-0.5 size-4 shrink-0"}):(0,t.jsx)(o.CircleCheck,{"aria-hidden":!0,className:"mt-0.5 size-4 shrink-0 text-success"}),e.text]})}function U({token:e,settings:n,onSaved:s}){let[r,i]=(0,a.useState)(n.upiId??""),[o,l]=(0,a.useState)(n.upiName??L.brand.name),[d,c]=(0,a.useState)({}),u=async()=>{if(r&&!A.UPI_PATTERN.test(r.trim()))return c({error:"That doesn't look like a UPI ID. It should look like name@bank."});c({busy:!0});try{let t={...n,upiId:r.trim(),upiName:o.trim()};await (0,C.commitChange)(e,e=>({content:{settings:{...e.settings,upiId:t.upiId,upiName:t.upiName}},message:"Update UPI details for client payments"})),s(t),c({done:!0})}catch(e){c({error:(0,w.explain)(e)})}};return(0,t.jsxs)("section",{"aria-labelledby":"upi-title",className:"max-w-2xl rounded-lg border border-border bg-surface p-6",children:[(0,t.jsx)("h2",{id:"upi-title",className:"font-display text-2xl",children:"Advance payments"}),(0,t.jsx)("p",{className:"mt-2 text-sm text-muted",children:"Clients pay the advance by UPI from the portal: on a phone it opens Google Pay, PhonePe or Paytm with the amount filled in; on a computer it shows a QR code. They then enter the payment reference, and you confirm it here once it reaches your account."}),(0,t.jsxs)("div",{className:"mt-5 grid gap-4 sm:grid-cols-2",children:[(0,t.jsx)(k.TextField,{id:"upi-id",label:"UPI ID",placeholder:"zoominfotos@okhdfcbank",value:r,onChange:e=>i(e.target.value),error:d.error}),(0,t.jsx)(k.TextField,{id:"upi-name",label:"Name shown to clients",value:o,onChange:e=>l(e.target.value)})]}),(0,t.jsxs)("div",{className:"mt-4 flex items-center gap-4",children:[(0,t.jsx)(y.Button,{type:"button",variant:"secondary",onClick:()=>void u(),loading:d.busy,loadingLabel:"Saving…",children:"Save UPI details"}),d.done&&(0,t.jsx)("span",{className:"text-sm text-muted",children:"Saved. The portal uses it in about two minutes."})]})]})}function $({title:e,icon:a,children:n,note:s}){return(0,t.jsxs)("details",{open:!0,className:"group rounded-lg border border-border bg-surface",children:[(0,t.jsxs)("summary",{className:"flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden",children:[a&&(0,t.jsx)("span",{"aria-hidden":!0,className:"text-muted",children:a}),(0,t.jsx)("span",{className:"font-display text-2xl",children:e}),s&&(0,t.jsx)("span",{className:"hidden text-sm text-muted sm:inline",children:s}),(0,t.jsx)("span",{"aria-hidden":!0,className:"ml-auto text-muted transition-transform group-open:rotate-180",children:"⌄"})]}),(0,t.jsx)("div",{className:"border-t border-border p-5",children:n})]})}let E="h-11 w-full rounded-md border border-border-strong bg-bg px-3 text-sm outline-none focus:border-fg";function D({initial:e,token:n,endpoint:i,onClose:c}){let[u,h]=(0,a.useState)(e.entry.data),[p,b]=(0,a.useState)(e.entry.signature),[N,C]=(0,a.useState)(e.pin),[T,A]=(0,a.useState)(!e.isNew),[P,I]=(0,a.useState)(e.isNew),[U,F]=(0,a.useState)(!1),[V,H]=(0,a.useState)(null),[G,_]=(0,a.useState)(!1),[Y,J]=(0,a.useState)(!1),[W,K]=(0,a.useState)({amount:"",reference:""}),Z=e=>{h(t=>({...t,...e})),I(!0)},Q=(0,S.money)(u),X=(0,S.stage)(u);async function ee(){F(!0),H(null);try{let e={...u,status:S.stageLabel[(0,S.stage)(u)]},t=await (0,R.callSheet)(i,{type:"save-booking",token:n,booking:e,pin:N});if(!t.ok)throw Error(t.error);h(S.bookingSchema.parse(t.booking)),b(t.signature),A(!0),I(!1),H({kind:"success",text:N?"Saved. Share the code and PIN with the client.":"Saved."})}catch(e){H({kind:"error",text:(0,w.explain)(e)})}finally{F(!1)}}async function et(){F(!0);try{let e=await (0,R.callSheet)(i,{type:"delete-booking",token:n,code:u.code});if(!e.ok)throw Error(e.error);c(!0)}catch(e){H({kind:"error",text:(0,w.explain)(e)}),F(!1)}}let ea=N?`Hello ${u.client.names.split(/[ &]/)[0]||"there"}, your ${L.brand.name} client portal is ready.

Open ${z}
Booking code: ${u.code}
PIN: ${N}

You can review and sign the agreement, pay the advance, and share your plans and family details there.`:"",en=u.client.phone.replace(/\D/g,""),es=N&&en.length>=10?`https://wa.me/${10===en.length?`91${en}`:en}?text=${encodeURIComponent(ea)}`:null;return(0,t.jsxs)("div",{className:"space-y-6 pb-28",children:[(0,t.jsxs)("button",{type:"button",onClick:()=>(!P||confirm("Leave without saving your changes?"))&&c(T),className:"inline-flex items-center gap-2 text-sm text-muted hover:text-fg",children:[(0,t.jsx)(s.ArrowLeft,{"aria-hidden":!0,className:"size-4"})," All bookings"]}),(0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-3",children:[(0,t.jsx)("h2",{className:"font-display text-h3",children:u.title||"New booking"}),(0,t.jsx)("span",{className:(0,M.cn)("rounded-full border px-2.5 py-0.5 text-xs",O[X]),children:S.stageLabel[X]})]}),(0,t.jsx)($,{title:"Client and event",icon:(0,t.jsx)(x.UserRound,{className:"size-5"}),children:(0,t.jsxs)("div",{className:"grid gap-4 sm:grid-cols-2",children:[(0,t.jsx)(k.TextField,{id:"b-title",label:"Booking name",placeholder:"Priya and Arjun's wedding",value:u.title,onChange:e=>Z({title:e.target.value})}),(0,t.jsx)(k.TextField,{id:"b-date",label:"Main event date",type:"date",value:u.eventDate,onChange:e=>Z({eventDate:e.target.value})}),(0,t.jsx)(k.TextField,{id:"b-names",label:"Client names",placeholder:"Priya Mohanty and Arjun Das",value:u.client.names,onChange:e=>Z({client:{...u.client,names:e.target.value}})}),(0,t.jsx)(k.TextField,{id:"b-phone",label:"Client phone or WhatsApp",type:"tel",value:u.client.phone,onChange:e=>Z({client:{...u.client,phone:e.target.value}})}),(0,t.jsx)(k.TextField,{id:"b-email",label:"Client email",type:"email",value:u.client.email,onChange:e=>Z({client:{...u.client,email:e.target.value}})})]})}),(0,t.jsxs)($,{title:"Portal access",icon:(0,t.jsx)(m,{className:"size-5"}),children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-x-8 gap-y-3 text-sm",children:[(0,t.jsxs)("p",{children:["Booking code ",(0,t.jsx)("span",{className:"tabular ml-1 rounded bg-fg/[0.06] px-2 py-1 font-medium",children:u.code})]}),(0,t.jsxs)("p",{children:["PIN"," ",N?(0,t.jsx)("span",{className:"tabular ml-1 rounded bg-fg/[0.06] px-2 py-1 font-medium",children:N}):(0,t.jsx)("span",{className:"text-muted",children:"set (hidden for safety)"})]}),(0,t.jsx)("button",{type:"button",onClick:()=>{C((0,S.newPin)()),I(!0)},className:"text-muted underline underline-offset-2 hover:text-fg",children:N?"Make a different PIN":"Reset PIN"})]}),N&&(0,t.jsxs)("div",{className:"mt-4 space-y-3",children:[(0,t.jsx)("p",{className:"text-sm text-muted",children:T&&!P?"Send this to the client:":"Save the booking first, then send this to the client:"}),(0,t.jsx)("pre",{className:"whitespace-pre-wrap rounded-md border border-border bg-bg p-3 font-sans text-sm",children:ea}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-2",children:[(0,t.jsxs)(y.Button,{type:"button",variant:"secondary",disabled:!T||P,onClick:()=>{navigator.clipboard?.writeText(ea).then(()=>{J(!0),setTimeout(()=>J(!1),2e3)})},children:[(0,t.jsx)(l.Copy,{"aria-hidden":!0,className:"size-4"})," ",Y?"Copied":"Copy message"]}),es&&T&&!P&&(0,t.jsxs)("a",{href:es,target:"_blank",rel:"noreferrer",className:"inline-flex h-11 items-center gap-2 rounded-md border border-border-strong px-4 text-sm font-medium hover:border-fg",children:[(0,t.jsx)(g.MessageCircle,{"aria-hidden":!0,className:"size-4"})," Send on WhatsApp"]})]})]})]}),(0,t.jsx)($,{title:"Package and invoice",note:"What the agreement and invoice list",children:(0,t.jsxs)("div",{className:"space-y-5",children:[(0,t.jsx)(k.TextField,{id:"b-package",label:"Package name",placeholder:"Signature, with drone",value:u.package.name,onChange:e=>Z({package:{...u.package,name:e.target.value}})}),(0,t.jsx)(v.default,{label:"Package items",fields:j.bookingFields.items,rows:u.package.items,blank:j.blanks.items,addLabel:"Add item",empty:"Add each part of the package with its price.",onChange:e=>Z({package:{...u.package,items:e}})}),(0,t.jsxs)("div",{className:"grid gap-4 sm:grid-cols-3",children:[(0,t.jsx)(B,{id:"b-discount",label:"Discount (₹)",value:u.package.discount,onChange:e=>Z({package:{...u.package,discount:e}})}),(0,t.jsx)(B,{id:"b-gst",label:"GST (%)",value:u.package.gstRate,onChange:e=>Z({package:{...u.package,gstRate:Math.min(28,e)}})}),(0,t.jsx)(B,{id:"b-advance",label:"Advance to confirm (₹)",value:u.advance,onChange:e=>Z({advance:e})})]}),(0,t.jsxs)("label",{className:"block text-sm",children:[(0,t.jsx)("span",{className:"font-medium",children:"Notes for the client"}),(0,t.jsx)("textarea",{value:u.package.notes,onChange:e=>Z({package:{...u.package,notes:e.target.value}}),rows:2,className:"mt-2 w-full rounded-md border border-border-strong bg-bg p-3 outline-none focus:border-fg"})]}),(0,t.jsxs)("p",{className:"tabular rounded-md bg-fg/[0.04] p-4 text-sm",children:["Subtotal ",(0,L.formatRupees)(Q.subtotal),u.package.discount>0&&(0,t.jsxs)(t.Fragment,{children:[" − discount ",(0,L.formatRupees)(u.package.discount)]})," + GST ",(0,L.formatRupees)(Q.gst)," ="," ",(0,t.jsx)("b",{children:(0,L.formatRupees)(Q.total)}),". Advance ",(0,L.formatRupees)(u.advance),Q.total>0&&(0,t.jsxs)(t.Fragment,{children:[" (",Math.round(u.advance/Q.total*100),"%)"]}),"."]})]})}),(0,t.jsx)($,{title:"Agreement",icon:(0,t.jsx)(d.FileSignature,{className:"size-5"}),children:u.contract.signed?(0,t.jsxs)("div",{className:"space-y-4 text-sm",children:[(0,t.jsxs)("p",{className:"flex items-center gap-2 text-success",children:[(0,t.jsx)(o.CircleCheck,{"aria-hidden":!0,className:"size-4"})," Signed by ",u.contract.signed.name," on"," ",new Date(u.contract.signed.at).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})]}),p&&(0,t.jsx)("img",{src:p,alt:`Signature of ${u.contract.signed.name}`,className:"h-20 rounded border border-border bg-white p-1"}),(0,t.jsxs)("details",{children:[(0,t.jsx)("summary",{className:"cursor-pointer text-muted hover:text-fg",children:"Read the signed agreement"}),(0,t.jsx)("pre",{className:"mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-bg p-4 font-sans",children:u.contract.signed.text})]}),(0,t.jsx)("button",{type:"button",onClick:()=>{confirm("Clear the signature? The client will need to sign again.")&&Z({contract:{text:u.contract.text}})},className:"text-muted underline underline-offset-2 hover:text-error",children:"Change the agreement and ask for a new signature"})]}):(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-3",children:[(0,t.jsx)("p",{className:"text-sm text-muted",children:"The client reads this in the portal and signs it. Fill in the client and package first."}),(0,t.jsx)(y.Button,{type:"button",variant:"secondary",onClick:()=>(!u.contract.text||confirm("Replace the agreement text with the standard agreement?"))&&Z({contract:{text:(0,S.standardAgreement)(u)}}),children:u.contract.text?"Refill the standard agreement":"Use the standard agreement"})]}),(0,t.jsx)("textarea",{"aria-label":"Agreement text",value:u.contract.text,onChange:e=>Z({contract:{text:e.target.value}}),rows:14,className:"w-full rounded-md border border-border-strong bg-bg p-4 font-sans text-sm leading-relaxed outline-none focus:border-fg"})]})}),(0,t.jsx)($,{title:"Payments",note:`${(0,L.formatRupees)(Q.paid)} received of ${(0,L.formatRupees)(Q.total)}`,children:(0,t.jsxs)("div",{className:"space-y-4",children:[0===u.payments.length&&(0,t.jsx)("p",{className:"text-sm text-muted",children:"No payments yet."}),(0,t.jsx)("ul",{className:"space-y-2",children:u.payments.map(e=>(0,t.jsxs)("li",{className:"flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-border p-3 text-sm",children:[(0,t.jsx)("span",{className:"tabular font-medium",children:(0,L.formatRupees)(e.amount)}),(0,t.jsxs)("span",{className:"text-muted",children:[e.method," · ",e.reference||"no reference"," · ",new Date(e.at).toLocaleDateString("en-IN",{day:"numeric",month:"short"})]}),"confirmed"===e.status?(0,t.jsxs)("span",{className:"ml-auto inline-flex items-center gap-1 text-success",children:[(0,t.jsx)(r.Check,{"aria-hidden":!0,className:"size-4"})," Received"]}):(0,t.jsxs)("button",{type:"button",onClick:()=>Z({payments:u.payments.map(t=>t.id===e.id?{...t,status:"confirmed"}:t)}),className:"ml-auto inline-flex h-9 items-center gap-1.5 rounded-md bg-fg px-3 text-bg",children:[(0,t.jsx)(r.Check,{"aria-hidden":!0,className:"size-4"})," Mark as received"]}),(0,t.jsx)("button",{type:"button",onClick:()=>Z({payments:u.payments.filter(t=>t.id!==e.id)}),className:"text-muted hover:text-error","aria-label":`Remove payment of ${(0,L.formatRupees)(e.amount)}`,children:(0,t.jsx)(f.Trash2,{"aria-hidden":!0,className:"size-4"})})]},e.id))}),(0,t.jsxs)("div",{className:"flex flex-wrap items-end gap-3",children:[(0,t.jsxs)("label",{className:"text-sm",children:[(0,t.jsx)("span",{className:"font-medium",children:"Amount (₹)"}),(0,t.jsx)("input",{inputMode:"numeric",value:W.amount,onChange:e=>K({...W,amount:e.target.value.replace(/\D/g,"")}),className:(0,M.cn)(E,"mt-2 w-36")})]}),(0,t.jsxs)("label",{className:"text-sm",children:[(0,t.jsx)("span",{className:"font-medium",children:"Reference or method"}),(0,t.jsx)("input",{value:W.reference,placeholder:"Cash, bank transfer…",onChange:e=>K({...W,reference:e.target.value}),className:(0,M.cn)(E,"mt-2 w-56")})]}),(0,t.jsx)(y.Button,{type:"button",variant:"secondary",disabled:!Number(W.amount),onClick:()=>{Z({payments:[...u.payments,{id:crypto.randomUUID().slice(0,8),amount:Number(W.amount),reference:W.reference,at:Date.now(),method:"Recorded by studio",status:"confirmed"}]}),K({amount:"",reference:""})},children:"Add a received payment"})]})]})}),(0,t.jsx)($,{title:"Planning",note:"The client can edit these too",children:(0,t.jsxs)("div",{className:"space-y-8",children:[(0,t.jsx)(q,{title:"Timeline",children:(0,t.jsx)(v.default,{label:"Timeline",fields:j.bookingFields.timeline,rows:u.planning.timeline,blank:j.blanks.timeline,addLabel:"Add an event",onChange:e=>Z({planning:{...u.planning,timeline:e}})})}),(0,t.jsx)(q,{title:"Venues",children:(0,t.jsx)(v.default,{label:"Venues",fields:j.bookingFields.venues,rows:u.planning.venues,blank:j.blanks.venues,addLabel:"Add a venue",onChange:e=>Z({planning:{...u.planning,venues:e}})})}),(0,t.jsx)(q,{title:"Shot list",children:(0,t.jsx)(v.default,{label:"Shot list",fields:j.bookingFields.shots,rows:u.planning.shots,blank:()=>({text:"",by:"Studio"}),addLabel:"Add a shot",onChange:e=>Z({planning:{...u.planning,shots:e}})})}),(0,t.jsx)(q,{title:"Family details",children:(0,t.jsx)(v.default,{label:"Family",fields:j.bookingFields.family,rows:u.planning.family,blank:j.blanks.family,addLabel:"Add a person",onChange:e=>Z({planning:{...u.planning,family:e}})})})]})}),(0,t.jsx)($,{title:"Wedding day",children:(0,t.jsxs)("div",{className:"space-y-8",children:[(0,t.jsx)(q,{title:"Your team",children:(0,t.jsx)(v.default,{label:"Team",fields:j.bookingFields.team,rows:u.team,blank:j.blanks.team,addLabel:"Add a team member",onChange:e=>Z({team:e})})}),(0,t.jsx)(q,{title:"Schedule",children:(0,t.jsx)(v.default,{label:"Schedule",fields:j.bookingFields.schedule,rows:u.schedule,blank:j.blanks.schedule,addLabel:"Add a time",onChange:e=>Z({schedule:e})})})]})}),(0,t.jsx)($,{title:"Delivery",children:(0,t.jsx)("ul",{className:"space-y-5",children:u.delivery.map((e,a)=>(0,t.jsxs)("li",{children:[(0,t.jsx)("p",{className:"mb-2 font-medium",children:S.deliveryNames[e.kind]}),(0,t.jsxs)("div",{className:"grid gap-2 sm:grid-cols-12",children:[(0,t.jsx)("select",{"aria-label":`${S.deliveryNames[e.kind]} status`,value:e.status,onChange:e=>Z({delivery:u.delivery.map((t,n)=>n===a?{...t,status:e.target.value}:t)}),className:(0,M.cn)(E,"sm:col-span-2"),children:S.deliveryStatuses.map(e=>(0,t.jsx)("option",{children:e},e))}),["expected","url","note"].map(n=>(0,t.jsx)("input",{"aria-label":`${S.deliveryNames[e.kind]} ${"expected"===n?"expected date":"url"===n?"link":"note"}`,type:"expected"===n?"date":"url"===n?"url":"text",placeholder:"url"===n?"Link: YouTube, Google Drive or gallery":"note"===n?"Note for the client":void 0,value:e[n],onChange:e=>Z({delivery:u.delivery.map((t,s)=>s===a?{...t,[n]:e.target.value}:t)}),className:(0,M.cn)(E,"expected"===n?"sm:col-span-2":"sm:col-span-4")},n))]})]},e.kind))})}),(0,t.jsx)("div",{className:"flex flex-wrap items-center gap-4",children:G?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("button",{type:"button",onClick:()=>void et(),className:"inline-flex h-11 items-center gap-2 rounded-md bg-error px-4 text-sm font-medium text-white",children:[(0,t.jsx)(f.Trash2,{"aria-hidden":!0,className:"size-4"})," Yes, delete this booking"]}),(0,t.jsx)("button",{type:"button",onClick:()=>_(!1),className:"text-sm text-muted",children:"Keep it"})]}):T&&(0,t.jsxs)("button",{type:"button",onClick:()=>_(!0),className:"inline-flex items-center gap-1.5 text-sm text-muted hover:text-error",children:[(0,t.jsx)(f.Trash2,{"aria-hidden":!0,className:"size-4"})," Delete booking"]})}),(0,t.jsx)("div",{className:"sticky bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+0.75rem)] z-30 lg:bottom-4",children:(0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface/95 p-3 shadow-lg backdrop-blur-md",children:[(0,t.jsx)(y.Button,{type:"button",onClick:()=>void ee(),loading:U,loadingLabel:"Saving…",disabled:!P&&T,children:T?"Save changes":"Create booking"}),(0,t.jsx)("span",{className:"min-w-0 flex-1 text-sm text-muted",children:V?(0,t.jsx)("span",{className:"error"===V.kind?"text-error":"",children:V.text}):P?"Unsaved changes":"All changes saved"})]})})]})}function q({title:e,children:a}){return(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"mb-3 text-sm font-medium uppercase tracking-wide text-muted",children:e}),a]})}function B({id:e,label:a,value:n,onChange:s}){return(0,t.jsxs)("label",{htmlFor:e,className:"block text-sm",children:[(0,t.jsx)("span",{className:"font-medium",children:a}),(0,t.jsx)("input",{id:e,inputMode:"numeric",value:n?String(n):"",placeholder:"0",onChange:e=>s(Number(e.target.value.replace(/\D/g,""))||0),className:(0,M.cn)(E,"tabular mt-2")})]})}e.s(["default",0,function(){let[e,s]=(0,a.useState)(null),[r,i]=(0,a.useState)(!0),[o,l]=(0,a.useState)(null),[d,c]=(0,a.useState)({}),[u,m]=(0,a.useState)(null),[g,f]=(0,a.useState)(!1),[x,k]=(0,a.useState)(!1),[v,j]=(0,a.useState)(null),A=d.dataEndpoint,P=(0,a.useCallback)(async(e,t)=>{i(!0),l(null);try{let{canSave:a}=await (0,C.verifyToken)(e);if(!a)throw new C.GitHubError("forbidden",403);let{content:n}=await (0,C.loadContent)(e);(0,w.storeToken)(e,t),s(e),c(n.settings)}catch(e){(0,w.storeToken)(null,!1),s(null),l({kind:"error",text:(0,w.explain)(e)})}finally{i(!1)}},[]);(0,a.useEffect)(()=>{let e=(0,w.readStoredToken)();e?P(e,(0,w.remembered)()):i(!1)},[P]);let $=(0,a.useCallback)(async()=>{if(e&&A){k(!0),l(null);try{let t=await (0,R.callSheet)(A,{type:"bookings",token:e});if(!t.ok&&"Unknown request"===t.error)return void f(!0);if(!t.ok)throw Error("not-allowed"===t.error?"The sheet did not accept your access key.":t.error);f((t.version??1)<T.SCRIPT_VERSION);let a=(t.bookings??[]).flatMap(e=>{let t=S.bookingSchema.safeParse(e.data);return t.success?[{data:t.data,signature:e.signature,hasPin:e.hasPin}]:[]});m(a.sort((e,t)=>(e.data.eventDate||"9").localeCompare(t.data.eventDate||"9")))}catch(e){l({kind:"error",text:(0,w.explain)(e)})}finally{k(!1)}}},[e,A]);if((0,a.useEffect)(()=>{$()},[$]),r)return(0,t.jsxs)("p",{className:"flex items-center gap-2 text-muted",role:"status",children:[(0,t.jsx)(h.LoaderCircle,{"aria-hidden":!0,className:"size-4 animate-spin"})," Checking your sign-in…"]});if(!e)return(0,t.jsx)(w.SignIn,{onSignIn:P,notice:o});let E=(0,t.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6",children:[(0,t.jsxs)("p",{className:"max-w-[60ch] text-sm text-muted",children:["Each booking gets a code and PIN for the client portal at ",(0,t.jsx)("span",{className:"text-fg",children:z.replace(/^https:\/\//,"")}),"."]}),(0,t.jsxs)("button",{type:"button",onClick:()=>{(0,w.storeToken)(null,!1),s(null),m(null)},className:"inline-flex items-center gap-2 text-sm font-medium hover:text-accent",children:[(0,t.jsx)(p.LogOut,{"aria-hidden":!0,className:"size-4"})," Sign out"]})]});return A?v?(0,t.jsxs)("div",{className:"space-y-8",children:[E,(0,t.jsx)(D,{initial:v,token:e,endpoint:A,onClose:e=>{j(null),e&&$()}},v.entry.data.code)]}):(0,t.jsxs)("div",{className:"space-y-10",children:[E,o&&(0,t.jsx)(I,{notice:o}),g&&(0,t.jsx)(N.default,{reason:"Client bookings need the newer sheet script.",onDone:()=>void $()}),!g&&(0,t.jsxs)("section",{"aria-labelledby":"bookings-title",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-end justify-between gap-4",children:[(0,t.jsx)("h2",{id:"bookings-title",className:"font-display text-h3",children:"Bookings"}),(0,t.jsxs)(y.Button,{type:"button",onClick:()=>j({entry:{data:(0,S.blankBooking)(),signature:"",hasPin:!1},pin:(0,S.newPin)(),isNew:!0}),children:[(0,t.jsx)(b.Plus,{"aria-hidden":!0,className:"size-4"})," New booking"]})]}),x&&!u?(0,t.jsxs)("p",{className:"mt-6 flex items-center gap-2 text-muted",role:"status",children:[(0,t.jsx)(h.LoaderCircle,{"aria-hidden":!0,className:"size-4 animate-spin"})," Loading bookings…"]}):u&&0===u.length?(0,t.jsx)("p",{className:"mt-6 text-sm text-muted",children:"No bookings yet. Create one when a client accepts a quote."}):(0,t.jsx)("ul",{className:"mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3",children:u?.map(e=>{let a,n=(0,S.stage)(e.data),s=(0,S.money)(e.data);return(0,t.jsx)("li",{children:(0,t.jsxs)("button",{type:"button",onClick:()=>j({entry:e,isNew:!1}),className:"block w-full rounded-lg border border-border bg-surface p-5 text-left transition-colors hover:border-fg",children:[(0,t.jsxs)("div",{className:"flex items-start justify-between gap-3",children:[(0,t.jsx)("p",{className:"font-medium",children:e.data.title||e.data.client.names||"Untitled booking"}),(0,t.jsx)("span",{className:(0,M.cn)("shrink-0 rounded-full border px-2.5 py-0.5 text-xs",O[n]),children:S.stageLabel[n]})]}),(0,t.jsxs)("p",{className:"mt-1 text-sm text-muted",children:[Number.isNaN(a=Date.parse(e.data.eventDate))?"Date to be set":new Date(a).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})," · ",e.data.code]}),(0,t.jsxs)("p",{className:"tabular mt-4 text-sm",children:[(0,L.formatRupees)(s.total)," total · ",(0,L.formatRupees)(s.paid)," received",s.claimed>0&&(0,t.jsxs)("span",{className:"text-[var(--rani)]",children:[" · ",(0,L.formatRupees)(s.claimed)," to check"]})]})]})},e.data.code)})})]}),(0,t.jsx)(U,{token:e,settings:d,onSaved:c})]}):(0,t.jsxs)("div",{className:"space-y-8",children:[E,(0,t.jsxs)("p",{className:"max-w-[60ch]",children:["Client bookings are kept in your Google Sheet. Connect it first on the"," ",(0,t.jsx)(n.default,{href:"/admin/dashboard",className:"underline underline-offset-2",children:"Dashboard"})," ","tab, then come back here."]})]})}],78725)},32650,31925,e=>{"use strict";var t=e.i(43476),a=e.i(71645),n=e.i(59544),s=e.i(3923);let{owner:r,repo:i,branch:o}=e.i(31338).contentRepo,l=`/repos/${r}/${i}`,d={photos:"src/content/photos.json",videos:"src/content/videos.json",settings:"src/content/settings.json",pricing:"src/content/pricing.json"};class c extends Error{status;constructor(e,t){super(e),this.status=t}}async function u(e,t,a={}){let n=await fetch(`https://api.github.com${t}`,{...a,cache:"no-store",headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${e}`,"X-GitHub-Api-Version":"2022-11-28",...a.body?{"Content-Type":"application/json"}:{}}});if(!n.ok)throw new c((await n.json().catch(()=>({}))).message??n.statusText,n.status);return n.json()}async function m(e){let[t,a]=await Promise.all([u(e,"/user").catch(()=>({login:""})),u(e,l)]);return{login:t.login,canSave:!!a.permissions?.push}}async function h(e){return(await u(e,`${l}/git/ref/heads/${o}`)).object.sha}async function p(e,t){let a=async(a,n=[])=>{try{let n,s=await u(e,`${l}/contents/${a}?ref=${t}`);return JSON.parse((n=s.content,new TextDecoder().decode(Uint8Array.from(atob(n.replace(/\s/g,"")),e=>e.charCodeAt(0)))))}catch(e){if(e instanceof c&&404===e.status)return n;throw e}},[n,s,r,i]=await Promise.all([a(d.photos),a(d.videos),a(d.settings,{}),a(d.pricing,{prices:{},eventShare:{}})]);return{photos:n,videos:s,settings:r,pricing:i}}async function g(e){let t=await h(e);return{sha:t,content:await p(e,t)}}async function b(e,t,a=0){let n=await h(e),[s,r]=await Promise.all([p(e,n),u(e,`${l}/git/commits/${n}`)]),{content:i,files:m=[],message:g}=t(s),f=(t,a)=>u(e,`${l}/git/blobs`,{method:"POST",body:JSON.stringify({content:t,encoding:a})}),x=await Promise.all([...Object.keys(i).map(async e=>({path:d[e],sha:(await f(`${JSON.stringify(i[e],null,2)}
`,"utf-8")).sha})),...m.map(async e=>({path:e.path,sha:null===e.base64?null:(await f(e.base64,"base64")).sha}))]),y=await u(e,`${l}/git/trees`,{method:"POST",body:JSON.stringify({base_tree:r.tree.sha,tree:x.map(e=>({path:e.path,mode:"100644",type:"blob",sha:e.sha}))})}),k=await u(e,`${l}/git/commits`,{method:"POST",body:JSON.stringify({message:g,tree:y.sha,parents:[n]})});try{await u(e,`${l}/git/refs/heads/${o}`,{method:"PATCH",body:JSON.stringify({sha:k.sha,force:!1})})}catch(n){if(n instanceof c&&422===n.status&&a<2)return b(e,t,a+1);throw n}return{sha:k.sha,content:{...s,...i}}}async function f(e,t){return(await u(e,`${l}/commits/gh-pages`)).commit.message.includes(t)}e.s(["GitHubError",0,c,"commitChange",0,b,"isPublished",0,f,"loadContent",0,g,"rawUrl",0,(e,t)=>`https://raw.githubusercontent.com/${r}/${i}/${t}/public${e}`,"verifyToken",0,m],31925);var x=e.i(74629);let y="zf-admin-token";e.s(["SignIn",0,function({onSignIn:e,notice:r}){let[i,o]=(0,a.useState)(""),[l,d]=(0,a.useState)(!0);return(0,t.jsxs)("div",{className:"grid gap-12 lg:grid-cols-12 lg:gap-x-10",children:[(0,t.jsxs)("form",{className:"space-y-5 lg:col-span-5",onSubmit:t=>{t.preventDefault(),i.trim()&&e(i.trim(),l)},children:[(0,t.jsx)(s.TextField,{id:"admin-key",label:"Access key",type:"password",autoComplete:"current-password",value:i,onChange:e=>o(e.target.value),error:r?.kind==="error"?r.text:void 0,hint:"Your GitHub access key for the website. It stays on this device and is only sent to GitHub and to your own dashboard sheet.",required:!0}),(0,t.jsxs)("label",{className:"flex items-center gap-2 text-sm",children:[(0,t.jsx)("input",{type:"checkbox",checked:l,onChange:e=>d(e.target.checked),className:"size-4 accent-[var(--rani)]"}),"Keep me signed in on this device"]}),(0,t.jsx)(n.Button,{type:"submit",children:"Sign in"})]}),(0,t.jsxs)("div",{className:"rounded-lg border border-border bg-surface p-6 text-sm leading-relaxed lg:col-span-6 lg:col-start-7",children:[(0,t.jsx)("h2",{className:"font-medium",children:"Getting an access key (one time)"}),(0,t.jsxs)("ol",{className:"mt-3 list-decimal space-y-2 pl-5 text-muted",children:[(0,t.jsxs)("li",{children:["Sign in to GitHub and open"," ",(0,t.jsx)("a",{className:"text-fg underline underline-offset-2",href:"https://github.com/settings/personal-access-tokens/new",target:"_blank",rel:"noreferrer",children:"new fine-grained token"}),"."]}),(0,t.jsx)("li",{children:"Name it “Zoomin Fotos admin” and pick an expiry date."}),(0,t.jsxs)("li",{children:["Under ",(0,t.jsx)("span",{className:"text-fg",children:"Repository access"}),", choose ",(0,t.jsx)("span",{className:"text-fg",children:"Only select repositories"})," and pick ",(0,t.jsx)("span",{className:"text-fg",children:"Zoomin-Fotos"}),"."]}),(0,t.jsxs)("li",{children:["Under ",(0,t.jsx)("span",{className:"text-fg",children:"Permissions"}),", set ",(0,t.jsx)("span",{className:"text-fg",children:"Contents"})," to"," ",(0,t.jsx)("span",{className:"text-fg",children:"Read and write"}),"."]}),(0,t.jsx)("li",{children:"Generate the token, copy it, and paste it here."})]})]})]})},"explain",0,function(e){return e instanceof c?401===e.status?"That access key was not accepted. It may have expired; create a new one and sign in again.":403===e.status||404===e.status?"This access key cannot change the website. Check it has Contents: Read and write access to the Zoomin-Fotos repository.":`GitHub said: ${e.message}`:e instanceof Error?e.message:"Something went wrong. Please try again."},"readStoredToken",0,function(){try{return localStorage.getItem(y)??sessionStorage.getItem(y)}catch{return null}},"remembered",0,function(){try{return null!==localStorage.getItem(y)}catch{return!1}},"storeToken",0,function(e,t){try{if(localStorage.removeItem(y),sessionStorage.removeItem(y),!e)return;(t?localStorage:sessionStorage).setItem(y,e),localStorage.setItem(x.NO_TRACK_KEY,"1")}catch{}}],32650)}]);