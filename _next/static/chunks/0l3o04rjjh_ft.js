(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,8734,e=>{"use strict";var t=e.i(56420);let a={name:"copy",size:24,node:[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]};a.node;let o=(0,t.default)(a);e.s(["Copy",0,o],8734)},67784,e=>{"use strict";var t=e.i(56420);let a={name:"log-out",size:24,node:[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]};a.node;let o=(0,t.default)(a);e.s(["LogOut",0,o],67784)},83890,e=>{"use strict";var t=e.i(43476),a=e.i(22016),o=e.i(18566),s=e.i(45060);let r=[{href:"/admin",label:"Photos"},{href:"/admin/clients",label:"Clients"},{href:"/admin/pricing",label:"Prices"},{href:"/admin/billing",label:"Quotes & bills"},{href:"/admin/reviews",label:"Reviews"},{href:"/admin/dashboard",label:"Dashboard"}];e.s(["default",0,function(){let e=(0,o.usePathname)().replace(/\/$/,"");return(0,t.jsx)("nav",{"aria-label":"Admin",className:"flex max-w-full gap-1 overflow-x-auto rounded-full border border-border p-1 text-sm",children:r.map(o=>(0,t.jsx)(a.default,{href:o.href,"aria-current":e===o.href?"page":void 0,className:(0,s.cn)("shrink-0 whitespace-nowrap rounded-full px-4 py-2 transition-colors",e===o.href?"bg-fg text-bg":"text-muted hover:text-fg"),children:o.label},o.href))})}])},60538,41120,43080,e=>{"use strict";var t=e.i(43476),a=e.i(71645),o=e.i(8734),s=e.i(56420);let r={name:"refresh-cw",size:24,node:[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]};r.node;let i=(0,s.default)(r);e.s(["RefreshCw",0,i],41120);var n=e.i(59544);e.i(95768);var d=e.i(54626),l=e.i(31338);let c=`// Zoomin Fotos dashboard and client portal. Paste this whole file into Extensions > Apps Script.
const VERSION = 4;
const REPO = "${l.contentRepo.owner}/${l.contentRepo.repo}";
const NOTIFY_EMAIL = "${d.brand.email}";

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
  if (!q.name || !(q.phone || q.email)) return { ok: false, error: "Missing name or phone" };
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
      replyTo: String(q.email || NOTIFY_EMAIL),
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
`;e.s(["SCRIPT_VERSION",0,4,"dashboardScript",0,c],43080),e.s(["default",0,function({onDone:e,reason:s}){let[r,d]=(0,a.useState)(!1),l=async()=>{try{await navigator.clipboard.writeText(c),d(!0),setTimeout(()=>d(!1),2500)}catch{}};return(0,t.jsxs)("section",{"aria-labelledby":"update-title",className:"max-w-3xl rounded-lg border border-border-strong bg-surface p-6",children:[(0,t.jsx)("h2",{id:"update-title",className:"font-display text-2xl",children:"Update your sheet script"}),(0,t.jsxs)("p",{className:"mt-2 text-sm text-muted",children:[s," It takes about two minutes, and the web address stays the same."]}),(0,t.jsxs)("ol",{className:"mt-5 list-decimal space-y-2 pl-5 text-sm leading-relaxed",children:[(0,t.jsxs)("li",{children:["Open your “Zoomin Fotos dashboard” Google Sheet and choose ",(0,t.jsx)("b",{children:"Extensions › Apps Script"}),"."]}),(0,t.jsx)("li",{children:"Delete all the code there, paste the new code, and click the save icon."}),(0,t.jsxs)("li",{children:["Click ",(0,t.jsx)("b",{children:"Deploy › Manage deployments"}),", click the pencil icon, set ",(0,t.jsx)("b",{children:"Version"})," to ",(0,t.jsx)("b",{children:"New version"}),", and click"," ",(0,t.jsx)("b",{children:"Deploy"}),". If Google asks, authorise it again."]}),(0,t.jsx)("li",{children:"Come back here and press Check again."})]}),(0,t.jsxs)("div",{className:"mt-5 flex flex-wrap gap-3",children:[(0,t.jsxs)(n.Button,{type:"button",variant:"secondary",onClick:()=>void l(),children:[(0,t.jsx)(o.Copy,{"aria-hidden":!0,className:"size-4"})," ",r?"Copied":"Copy the new code"]}),(0,t.jsxs)(n.Button,{type:"button",onClick:e,children:[(0,t.jsx)(i,{"aria-hidden":!0,className:"size-4"})," Check again"]})]}),(0,t.jsx)("textarea",{readOnly:!0,value:c,"aria-label":"Sheet script",onFocus:e=>e.currentTarget.select(),className:"mt-4 h-28 w-full rounded-md border border-border bg-bg p-3 font-mono text-xs"})]})}],60538)},32650,31925,e=>{"use strict";var t=e.i(43476),a=e.i(71645),o=e.i(59544),s=e.i(3923);let{owner:r,repo:i,branch:n}=e.i(31338).contentRepo,d=`/repos/${r}/${i}`,l={photos:"src/content/photos.json",videos:"src/content/videos.json",settings:"src/content/settings.json",pricing:"src/content/pricing.json",testimonials:"src/content/testimonials.json"};class c extends Error{status;constructor(e,t){super(e),this.status=t}}async function p(e,t,a={}){let o=await fetch(`https://api.github.com${t}`,{...a,cache:"no-store",headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${e}`,"X-GitHub-Api-Version":"2022-11-28",...a.body?{"Content-Type":"application/json"}:{}}});if(!o.ok)throw new c((await o.json().catch(()=>({}))).message??o.statusText,o.status);return o.json()}async function h(e){let[t,a]=await Promise.all([p(e,"/user").catch(()=>({login:""})),p(e,d)]);return{login:t.login,canSave:!!a.permissions?.push}}async function g(e){return(await p(e,`${d}/git/ref/heads/${n}`)).object.sha}async function u(e,t){let a=async(a,o=[])=>{try{let o,s=await p(e,`${d}/contents/${a}?ref=${t}`);return JSON.parse((o=s.content,new TextDecoder().decode(Uint8Array.from(atob(o.replace(/\s/g,"")),e=>e.charCodeAt(0)))))}catch(e){if(e instanceof c&&404===e.status)return o;throw e}},[o,s,r,i,n]=await Promise.all([a(l.photos),a(l.videos),a(l.settings,{}),a(l.pricing,{prices:{},eventShare:{}}),a(l.testimonials)]);return{photos:o,videos:s,settings:r,pricing:i,testimonials:n}}async function m(e){let t=await g(e);return{sha:t,content:await u(e,t)}}async function y(e,t,a=0){let o=await g(e),[s,r]=await Promise.all([u(e,o),p(e,`${d}/git/commits/${o}`)]),{content:i,files:h=[],message:m}=t(s),b=(t,a)=>p(e,`${d}/git/blobs`,{method:"POST",body:JSON.stringify({content:t,encoding:a})}),f=await Promise.all([...Object.keys(i).map(async e=>({path:l[e],sha:(await b(`${JSON.stringify(i[e],null,2)}
`,"utf-8")).sha})),...h.map(async e=>({path:e.path,sha:null===e.base64?null:(await b(e.base64,"base64")).sha}))]),w=await p(e,`${d}/git/trees`,{method:"POST",body:JSON.stringify({base_tree:r.tree.sha,tree:f.map(e=>({path:e.path,mode:"100644",type:"blob",sha:e.sha}))})}),k=await p(e,`${d}/git/commits`,{method:"POST",body:JSON.stringify({message:m,tree:w.sha,parents:[o]})});try{await p(e,`${d}/git/refs/heads/${n}`,{method:"PATCH",body:JSON.stringify({sha:k.sha,force:!1})})}catch(o){if(o instanceof c&&422===o.status&&a<2)return y(e,t,a+1);throw o}return{sha:k.sha,content:{...s,...i}}}async function b(e,t){return(await p(e,`${d}/commits/gh-pages`)).commit.message.includes(t)}e.s(["GitHubError",0,c,"commitChange",0,y,"isPublished",0,b,"loadContent",0,m,"rawUrl",0,(e,t)=>`https://raw.githubusercontent.com/${r}/${i}/${t}/public${e}`,"verifyToken",0,h],31925);var f=e.i(74629);let w="zf-admin-token";e.s(["SignIn",0,function({onSignIn:e,notice:r}){let[i,n]=(0,a.useState)(""),[d,l]=(0,a.useState)(!0);return(0,t.jsxs)("div",{className:"grid gap-12 lg:grid-cols-12 lg:gap-x-10",children:[(0,t.jsxs)("form",{className:"space-y-5 lg:col-span-5",onSubmit:t=>{t.preventDefault(),i.trim()&&e(i.trim(),d)},children:[(0,t.jsx)(s.TextField,{id:"admin-key",label:"Access key",type:"password",autoComplete:"current-password",value:i,onChange:e=>n(e.target.value),error:r?.kind==="error"?r.text:void 0,hint:"Your GitHub access key for the website. It stays on this device and is only sent to GitHub and to your own dashboard sheet.",required:!0}),(0,t.jsxs)("label",{className:"flex items-center gap-2 text-sm",children:[(0,t.jsx)("input",{type:"checkbox",checked:d,onChange:e=>l(e.target.checked),className:"size-4 accent-[var(--rani)]"}),"Keep me signed in on this device"]}),(0,t.jsx)(o.Button,{type:"submit",children:"Sign in"})]}),(0,t.jsxs)("div",{className:"rounded-lg border border-border bg-surface p-6 text-sm leading-relaxed lg:col-span-6 lg:col-start-7",children:[(0,t.jsx)("h2",{className:"font-medium",children:"Getting an access key (one time)"}),(0,t.jsxs)("ol",{className:"mt-3 list-decimal space-y-2 pl-5 text-muted",children:[(0,t.jsxs)("li",{children:["Sign in to GitHub and open"," ",(0,t.jsx)("a",{className:"text-fg underline underline-offset-2",href:"https://github.com/settings/personal-access-tokens/new",target:"_blank",rel:"noreferrer",children:"new fine-grained token"}),"."]}),(0,t.jsx)("li",{children:"Name it “Zoomin Fotos admin” and pick an expiry date."}),(0,t.jsxs)("li",{children:["Under ",(0,t.jsx)("span",{className:"text-fg",children:"Repository access"}),", choose ",(0,t.jsx)("span",{className:"text-fg",children:"Only select repositories"})," and pick ",(0,t.jsx)("span",{className:"text-fg",children:"Zoomin-Fotos"}),"."]}),(0,t.jsxs)("li",{children:["Under ",(0,t.jsx)("span",{className:"text-fg",children:"Permissions"}),", set ",(0,t.jsx)("span",{className:"text-fg",children:"Contents"})," to"," ",(0,t.jsx)("span",{className:"text-fg",children:"Read and write"}),"."]}),(0,t.jsx)("li",{children:"Generate the token, copy it, and paste it here."})]})]})]})},"explain",0,function(e){return e instanceof c?401===e.status?"That access key was not accepted. It may have expired; create a new one and sign in again.":403===e.status||404===e.status?"This access key cannot change the website. Check it has Contents: Read and write access to the Zoomin-Fotos repository.":`GitHub said: ${e.message}`:e instanceof Error?e.message:"Something went wrong. Please try again."},"readStoredToken",0,function(){try{return localStorage.getItem(w)??sessionStorage.getItem(w)}catch{return null}},"remembered",0,function(){try{return null!==localStorage.getItem(w)}catch{return!1}},"storeToken",0,function(e,t){try{if(localStorage.removeItem(w),sessionStorage.removeItem(w),!e)return;(t?localStorage:sessionStorage).setItem(w,e),localStorage.setItem(f.NO_TRACK_KEY,"1")}catch{}}],32650)},3923,22768,e=>{"use strict";var t=e.i(43476),a=e.i(89664),o=e.i(56420);let s={name:"circle-alert",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],aliases:["alert-circle"]};s.node;let r=(0,o.default)(s);e.s(["CircleAlert",0,r],22768);var i=e.i(45060);let n="block w-full rounded-md border bg-elevated px-3.5 text-base text-fg transition-[border-color,box-shadow] duration-150 placeholder:text-muted/70 hover:border-border-strong focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60";function d({id:e,label:a,hint:o,error:s,optional:i,children:n}){return(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"flex items-baseline justify-between gap-4",children:[(0,t.jsx)("label",{htmlFor:e,className:"text-sm font-semibold",children:a}),i&&(0,t.jsx)("span",{className:"text-xs text-muted",children:"Optional"})]}),(0,t.jsx)("div",{className:"mt-2",children:n}),s?(0,t.jsxs)("p",{id:`${e}-error`,className:"mt-2 flex items-start gap-1.5 text-sm text-error",children:[(0,t.jsx)(r,{"aria-hidden":!0,className:"mt-0.5 size-3.5 shrink-0"}),s]}):o&&(0,t.jsx)("p",{id:`${e}-hint`,className:"mt-2 text-sm text-muted",children:o})]})}function l(e,t,a){return t?`${e}-error`:a?`${e}-hint`:void 0}e.s(["ChoiceGroup",0,function({legend:e,name:a,type:o,options:s,defaultValue:n=[],value:d,onValueChange:l,error:c}){let p=`${a}-error`,h=void 0!==d;return(0,t.jsxs)("fieldset",{"aria-describedby":c?p:void 0,"aria-invalid":!!c||void 0,children:[(0,t.jsx)("legend",{className:"text-sm font-semibold",children:e}),(0,t.jsx)("div",{className:"mt-3 flex flex-wrap gap-2",children:s.map(e=>(0,t.jsxs)("label",{className:(0,i.cn)("chip relative inline-flex min-h-11 cursor-pointer select-none items-center rounded-md border px-3.5 py-2 text-sm font-medium transition-colors","border-border bg-elevated hover:border-border-strong","has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-fg","has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fg",c&&"border-error/60"),children:[(0,t.jsx)("input",{type:o,name:a,value:e,...h?{checked:d===e,onChange:()=>l?.(e)}:{defaultChecked:n.includes(e)},className:"sr-only"}),e]},e))}),c&&(0,t.jsxs)("p",{id:p,className:"mt-2 flex items-start gap-1.5 text-sm text-error",children:[(0,t.jsx)(r,{"aria-hidden":!0,className:"mt-0.5 size-3.5 shrink-0"}),c]})]})},"TextField",0,function({id:e,label:o,hint:s,error:r,optional:c,valid:p,className:h,...g}){return(0,t.jsx)(d,{id:e,label:o,hint:s,error:r,optional:c,children:(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)("input",{id:e,"aria-invalid":!!r||void 0,"aria-describedby":l(e,r,s),className:(0,i.cn)(n,"h-12",r?"border-error":p?"border-success/60 pr-10":"border-border",h),...g}),p&&!r&&(0,t.jsx)(a.Check,{"aria-hidden":!0,className:"pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-success"})]})})},"TextareaField",0,function({id:e,label:a,hint:o,error:s,optional:r,className:c,...p}){return(0,t.jsx)(d,{id:e,label:a,hint:o,error:s,optional:r,children:(0,t.jsx)("textarea",{id:e,"aria-invalid":!!s||void 0,"aria-describedby":l(e,s,o),className:(0,i.cn)(n,"min-h-24 resize-y py-3 leading-relaxed",s?"border-error":"border-border",c),...p})})},"control",0,n],3923)},16498,(e,t,a)=>{t.exports=JSON.parse('[{"id":"21","category":"weddings","title":"Haldi laughter","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/wedding-haldi.webp"},{"id":"38","category":"pre-wedding","title":"Two rings, in rose petals","place":"Studio","aspect":"landscape","tone":"rose","src":"/photos/prewedding-rings-rose-petals.webp"},{"id":"84","category":"portraits","title":"A look over the shoulder","place":"Studio","aspect":"tall","tone":"amber","src":"/photos/portraits-a-look-over-the-shoulder.webp"},{"id":"53","category":"weddings","title":"Sindoor, in the courtyard","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/wedding-sindoor-courtyard.webp"},{"id":"81","category":"weddings","title":"A reflection in rose gold","place":"Odisha","aspect":"tall","tone":"amber","src":"/photos/weddings-a-reflection-in-rose-gold.webp","featured":true},{"id":"68","category":"weddings","title":"The groom, in navy and lanterns","place":"Odisha","aspect":"tall","tone":"dusk","src":"/photos/weddings-the-groom-in-navy.webp"},{"id":"30","category":"weddings","title":"Getting ready, golden dust","place":"Odisha","aspect":"tall","tone":"amber","src":"/photos/wedding-golden-powder.webp"},{"id":"46","category":"commercial","title":"Product shoot, capsules and packaging","place":"Studio","aspect":"landscape","tone":"sky","src":"/photos/commercial-pharma-capsules.webp"},{"id":"56","category":"weddings","title":"A stolen kiss","place":"Odisha","aspect":"tall","tone":"rose","src":"/photos/weddings-a-stolen-kiss.webp","featured":true},{"id":"02","category":"portraits","title":"Yellow allamanda","place":"Odisha","aspect":"tall","tone":"sage","src":"/photos/portrait-saree-garden.webp"},{"id":"73","category":"portraits","title":"Fuchsia, on white","place":"Studio","aspect":"tall","tone":"rose","src":"/photos/portraits-fuchsia-on-white.webp","featured":true},{"id":"44","category":"maternity-newborn","title":"First steps under the bougainvillea","place":"Odisha","aspect":"portrait","tone":"rose","src":"/photos/kids-bougainvillea-walk.webp","featured":true},{"id":"41","category":"commercial","title":"Dahi bara aloo dum, in a leaf bowl","place":"Studio","aspect":"tall","tone":"amber","src":"/photos/commercial-dahi-bara-aloo-dum.webp"},{"id":"04","category":"weddings","title":"Bridal portrait","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/wedding-bridal-portrait.webp"},{"id":"59","category":"weddings","title":"Caught by the family","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/weddings-caught-by-the-family.webp"},{"id":"78","category":"weddings","title":"All smiles, in red and silver","place":"Odisha","aspect":"tall","tone":"rose","src":"/photos/weddings-all-smiles-in-red-and-silver.webp"},{"id":"33","category":"weddings","title":"Haldi, a shower of petals","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/wedding-haldi-petal-shower.webp"},{"id":"63","category":"weddings","title":"Smiling for two cameras","place":"Odisha","aspect":"landscape","tone":"rose","src":"/photos/weddings-smiling-for-two-cameras.webp"},{"id":"82","category":"weddings","title":"The groom, in a slant of light","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/weddings-the-groom-in-a-slant-of-light.webp"},{"id":"23","category":"portraits","title":"Golden hour glow","place":"Odisha","aspect":"tall","tone":"amber","src":"/photos/portrait-sunset-florals.webp"},{"id":"74","category":"portraits","title":"In black, arms crossed","place":"Studio","aspect":"tall","tone":"sage","src":"/photos/portraits-in-black-arms-crossed.webp"},{"id":"40","category":"weddings","title":"Crowned, hand in hand","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/wedding-mukut-ceremony.webp"},{"id":"65","category":"weddings","title":"Flower jewellery, golden hour","place":"Odisha","aspect":"landscape","tone":"rose","src":"/photos/weddings-flower-jewellery-golden-hour.webp","featured":true},{"id":"24","category":"pre-wedding","title":"The ring, at golden hour","place":"Odisha","aspect":"tall","tone":"amber","src":"/photos/prewedding-ring-golden.webp","featured":true},{"id":"34","category":"weddings","title":"Getting ready, a rain of petals","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/wedding-bride-petal-rain.webp"},{"id":"20","category":"weddings","title":"Bridal details","place":"Odisha","aspect":"landscape","tone":"rose","src":"/photos/wedding-bridal-collage.webp"},{"id":"67","category":"weddings","title":"Reception, in navy and gold","place":"Odisha","aspect":"tall","tone":"dusk","src":"/photos/weddings-reception-in-navy-and-gold.webp"},{"id":"60","category":"weddings","title":"Haldi, a bucketful of gold","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/weddings-haldi-a-bucketful-of-gold.webp"},{"id":"36","category":"pre-wedding","title":"Laughter under the lanterns","place":"Odisha","aspect":"landscape","tone":"rose","src":"/photos/prewedding-lantern-laughter.webp","featured":true},{"id":"48","category":"commercial","title":"Packshot, capsules in afternoon sun","place":"Studio","aspect":"landscape","tone":"amber","src":"/photos/commercial-nutraceutical.webp"},{"id":"49","category":"maternity-newborn","title":"A flower crown in the park","place":"Odisha","aspect":"landscape","tone":"sage","src":"/photos/kids-pink-flower-crown.webp"},{"id":"42","category":"commercial","title":"Sizzling brownie, the chocolate pour","place":"Studio","aspect":"tall","tone":"amber","src":"/photos/commercial-sizzling-brownie.webp"},{"id":"14","category":"weddings","title":"The reception","place":"Odisha","aspect":"tall","tone":"amber","src":"/photos/wedding-couple-reception.webp"},{"id":"58","category":"weddings","title":"Laughing through the petals","place":"Odisha","aspect":"landscape","tone":"rose","src":"/photos/weddings-laughing-through-the-petals.webp"},{"id":"83","category":"portraits","title":"Through the curls","place":"Studio","aspect":"tall","tone":"amber","src":"/photos/portraits-through-the-curls.webp"},{"id":"80","category":"weddings","title":"Bangles, and a smile","place":"Odisha","aspect":"tall","tone":"amber","src":"/photos/weddings-bangles-and-a-smile.webp"},{"id":"52","category":"weddings","title":"In a beam of light","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/wedding-bride-light-beam.webp"},{"id":"61","category":"weddings","title":"Eyes down, in gold","place":"Odisha","aspect":"tall","tone":"amber","src":"/photos/weddings-eyes-down-in-gold.webp"},{"id":"26","category":"portraits","title":"Crimson veil","place":"Studio","aspect":"tall","tone":"rose","src":"/photos/portrait-crimson-veil.webp","featured":true},{"id":"09","category":"weddings","title":"Bidaai","place":"Odisha","aspect":"landscape","tone":"dusk","src":"/photos/wedding-bidaai.webp"},{"id":"64","category":"weddings","title":"Haldi, under the petal rain","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/weddings-haldi-under-the-petal-rain.webp"},{"id":"57","category":"weddings","title":"Red and gold, by candlelight","place":"Odisha","aspect":"landscape","tone":"rose","src":"/photos/weddings-red-and-gold-by-candlelight.webp"},{"id":"54","category":"weddings","title":"The groom, in ivory and pearls","place":"Studio","aspect":"tall","tone":"sage","src":"/photos/wedding-groom-ivory-sherwani.webp"},{"id":"62","category":"weddings","title":"A twirl in the morning light","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/weddings-a-twirl-in-the-morning-light-3.webp","featured":true},{"id":"22","category":"portraits","title":"Light through the blinds","place":"Studio","aspect":"tall","tone":"rose","src":"/photos/portrait-red-blazer-blinds.webp"},{"id":"45","category":"commercial","title":"Product shoot, tablets in morning light","place":"Studio","aspect":"landscape","tone":"amber","src":"/photos/commercial-pharma-product.webp"},{"id":"01","category":"weddings","title":"Sindoor daan","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/wedding-sindoor.webp"},{"id":"17","category":"portraits","title":"In olive, backlit","place":"Studio","aspect":"portrait","tone":"sage","src":"/photos/portrait-olive-backlit.webp"},{"id":"75","category":"portraits","title":"The red blazer","place":"Studio","aspect":"portrait","tone":"rose","src":"/photos/portraits-red-blazer.webp"},{"id":"35","category":"weddings","title":"A blushing bride","place":"Odisha","aspect":"landscape","tone":"rose","src":"/photos/wedding-bride-blush-petals.webp"},{"id":"66","category":"weddings","title":"In the mirror","place":"Odisha","aspect":"landscape","tone":"rose","src":"/photos/weddings-in-the-mirror.webp"},{"id":"79","category":"weddings","title":"Seated, in warm light","place":"Odisha","aspect":"tall","tone":"amber","src":"/photos/weddings-seated-in-warm-light.webp"},{"id":"31","category":"portraits","title":"A shy smile in silk","place":"Odisha","aspect":"tall","tone":"rose","src":"/photos/portrait-silk-saree.webp"},{"id":"76","category":"portraits","title":"Over the shoulder, in green","place":"Studio","aspect":"tall","tone":"sage","src":"/photos/portraits-over-the-shoulder-in-green.webp","featured":true},{"id":"72","category":"portraits","title":"Red, with copper waves","place":"Studio","aspect":"tall","tone":"rose","src":"/photos/portraits-red-with-copper-waves-2.webp"},{"id":"77","category":"portraits","title":"Feathers and white","place":"Studio","aspect":"tall","tone":"rose","src":"/photos/portraits-feathers-and-white.webp"},{"id":"29","category":"weddings","title":"Haldi, petals flying","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/wedding-haldi-petals.webp"},{"id":"50","category":"maternity-newborn","title":"A little fairy, mid-dance","place":"Odisha","aspect":"tall","tone":"rose","src":"/photos/kids-little-fairy.webp"},{"id":"37","category":"pre-wedding","title":"The groom, among marigolds","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/prewedding-groom-marigolds.webp"},{"id":"43","category":"commercial","title":"Herbs, crisp onions and grilled bread","place":"Studio","aspect":"portrait","tone":"sage","src":"/photos/commercial-herb-bowl-sunlight.webp"},{"id":"27","category":"pre-wedding","title":"Warm lights, closer","place":"Odisha","aspect":"landscape","tone":"amber","src":"/photos/prewedding-couple-evening.webp"},{"id":"51","category":"weddings","title":"A quiet moment by lamplight","place":"Odisha","aspect":"tall","tone":"rose","src":"/photos/wedding-bride-lamplight.webp"},{"id":"69","category":"weddings","title":"Blue and gold, in a shaft of light","place":"Odisha","aspect":"landscape","tone":"dusk","src":"/photos/weddings-blue-and-gold-in-a-shaft-of-light.webp"},{"id":"55","category":"weddings","title":"Veiled, against the moon","place":"Odisha","aspect":"tall","tone":"rose","src":"/photos/wedding-veil-moon.webp","featured":true},{"id":"28","category":"weddings","title":"Hands joined, everyone smiling","place":"Odisha","aspect":"landscape","tone":"rose","src":"/photos/wedding-hasta-milap.webp"},{"id":"47","category":"commercial","title":"Packaging range, stacked","place":"Studio","aspect":"landscape","tone":"sky","src":"/photos/commercial-pharma-boxes.webp"},{"id":"70","category":"events","title":"The first birthday","place":"Odisha","aspect":"landscape","tone":"dusk","src":"/photos/events-the-first-birthday.webp","featured":true},{"id":"71","category":"events","title":"A birthday hug","place":"Odisha","aspect":"landscape","tone":"dusk","src":"/photos/events-a-birthday-hug.webp"}]')},8187,(e,t,a)=>{t.exports=[]},95768,e=>{"use strict";var t=e.i(81307),a=e.i(16498),o=e.i(8187);e.i(54626);let s=["weddings","pre-wedding","portraits","maternity-newborn","events","commercial"],r={q:"When will we receive our photographs?",a:"It depends on the package and the size of the shoot. We tell you the delivery date in your quote, before you book, so you know exactly when to expect your photos and videos."},i={q:"Do you travel outside Bhubaneswar?",a:"Yes. We photograph across Odisha and travel further for weddings and shoots. Travel and stay are quoted separately, so you see them before you book."},n=[{slug:"weddings",title:"Weddings",short:"Every ritual, every relative, every quiet glance between you, told as one continuous story.",intro:"From haldi to bidaai, we document your wedding the way it actually unfolds: candid, unhurried and true to colour. Every package pairs photography with video, from one photographer and one cinematographer up to a full crew with drone.",idealFor:"Multi-day celebrations, intimate ceremonies and destination weddings.",includes:[{title:"A team sized to your day",text:"From one photographer and one cinematographer up to a full crew with drone, so both families and both sides of the mandap are covered."},{title:"Ritual planning call",text:"We walk through the schedule with you and your family so we are in place before each moment."},{title:"Couple portraits",text:"A relaxed, guided half hour away from the crowd, timed for the best light of the day."},{title:"Premium album",text:"Every package includes a printed album, designed by us. Infinity upgrades to a 14x40 luxury album."}],deliverables:["All raw photos and videos","Premium photo album","Full-length edited video","Online gallery"],faqs:[{q:"Are the package prices fixed?",a:"Prices are for one day of coverage, plus GST, and are negotiable. Multi-day weddings, travel and add-ons are quoted together so you get one clear number."},{q:"How far in advance should we book?",a:"As soon as you know your date. Dates are booked in the order they are confirmed, so send yours early and we will tell you straight away if it is free."},r,i],packages:[{name:"Essence",price:25e3,tagline:"The beginning of beautiful memories",team:"1 photographer, 1 cinematographer",items:["All raw photos (high resolution)","All raw videos","1 premium photo album (standard size)","1 full-length edited video"]},{name:"Signature",price:35e3,tagline:"More moments, more stories",team:"2 photographers, 1 cinematographer",items:["All raw photos and videos","1 premium photo album (standard size)","20 edited photos","Highlight video (4 to 5 mins)","1 full-length edited video"]},{name:"Luxe",price:45e3,tagline:"Every detail, beautifully told",team:"2 photographers, 2 cinematographers",items:["All raw photos and videos","1 premium photo album (standard size)","50 edited photos","Teaser video","Highlight video (4 to 5 mins)","1 full-length edited video","1 Instagram reel"]},{name:"Infinity",price:55e3,tagline:"A complete story from every angle",team:"2 photographers, 2 cinematographers, 1 drone",featured:!0,items:["All raw photos and videos","150 edited photos","Wedding invitation video","1 highlight film (7 to 10 mins, cinematic and storyline driven)","1 full-length edited video","1 luxury album (14x40, 35 pages)","2 to 3 Instagram reels"]}]},{slug:"pre-wedding",title:"Pre-wedding",short:"An unhurried session somewhere that means something to you both, before the rush begins.",intro:"A pre-wedding shoot is the best way to get comfortable in front of the camera before the big day. We help you choose a location, outfits and time of day, then let the conversation do the rest.",idealFor:"Save-the-dates, invitations and couples who want images with room to breathe.",includes:[{title:"Location scouting",text:"Beaches, temples, old streets or your favourite cafe: we suggest places that suit your story and the light."},{title:"Styling guidance",text:"A short guide on outfits, colours and props so the photographs feel timeless, not trendy."},{title:"Golden-hour timing",text:"Sessions are planned around the softest light of the day, morning or evening."},{title:"Save-the-date edits",text:"A few images formatted for invitations and social posts, delivered first."}],deliverables:["Edited photos","Drone shots","Premium album","Save-the-date edits"],packagesIntro:"One session, everything included. Tell us where you would like to shoot and we will plan the light, the outfits and the route.",packages:[{name:"Pre-wedding shoot",price:15e3,startingFrom:!0,unit:"per shoot + GST",note:"Includes everything",tagline:"More than pictures, a story of you",items:["Professional photography","Drone shots","Edited photos","Premium album"]}],faqs:[{q:"How much does a pre-wedding shoot cost?",a:"Pre-wedding shoots start from ₹15,000 plus GST and include everything: professional photography, drone shots, edited photos and a premium album. Travel to faraway locations is quoted separately."},{q:"How long is a pre-wedding session?",a:"It depends on the locations you choose. We plan the timing, the route and your outfit changes with you before the shoot."},i,r]},{slug:"portraits",title:"Portraits",short:"Honest portraits for individuals, couples and families, made without stiff poses.",intro:"Whether it is a family gathering, a milestone birthday or a new profile picture, we direct gently and keep things moving so you look like yourself on your best day.",idealFor:"Families, couples, graduates, artists and professionals.",includes:[{title:"Studio or outdoors",text:"Shoot in our studio with controlled light, or on location at home, in a park or by the sea."},{title:"Gentle direction",text:"Small prompts instead of rigid poses, so expressions stay natural."},{title:"Wardrobe check",text:"We help pick outfits that photograph well together before the day."},{title:"Light retouching",text:"Skin and stray hairs tidied, never reshaped. You still look like you."}],deliverables:["Online gallery","Retouched selects","Print-ready files"],faqs:[{q:"Can we bring our pets?",a:"Please do. Tell us in advance so we can plan the session around them."},{q:"How many people can be in a family session?",a:"Up to twelve people in a standard session. Larger gatherings are quoted as an event."},r]},{slug:"maternity-newborn",title:"Maternity & Newborn",short:"Soft, calm sessions for the weeks you will want to remember in detail.",intro:"We photograph maternity sessions from around 30 weeks and newborns in their first two weeks. Sessions are slow, warm and led entirely by the baby's routine, with safety first in every set-up.",idealFor:"Expecting parents, new families and siblings meeting the baby.",includes:[{title:"Home or studio",text:"We come to you, or you visit our warm, quiet studio set up for little ones."},{title:"Baby-led pace",text:"Feeds, cuddles and naps come first. A session takes as long as it needs."},{title:"Safe posing",text:"Simple, natural positions only, with a parent's hand always close by."},{title:"Wraps and props",text:"Neutral wraps, blankets and a few heirloom props are provided."}],deliverables:["Online gallery","Retouched selects","Fine-art prints"],faqs:[{q:"When should we book a newborn session?",a:"During pregnancy. We pencil in your due date and confirm the session once the baby arrives."},{q:"Is the studio safe for newborns?",a:"Yes. It is kept warm, quiet and clean, and we never use poses that rely on balance or props to hold the baby."},r]},{slug:"events",title:"Events",short:"Birthdays, anniversaries, launches and gatherings, captured without interrupting them.",intro:"We blend into the room and photograph the people, speeches and small moments that make an event worth remembering, then deliver quickly so you can share while the excitement is fresh.",idealFor:"Birthdays, anniversaries, family functions, corporate events and launches.",includes:[{title:"Discreet coverage",text:"We work quietly in the background so guests behave like guests, not subjects."},{title:"Group photographs",text:"Organised family and team groups, done quickly so nobody misses the party."},{title:"Same-day selects",text:"A handful of edited images sent the same evening for social sharing."},{title:"Flexible hours",text:"Book by the hour, from short gatherings to full-day programmes."}],deliverables:["Online gallery","Same-day selects","Print-ready files"],faqs:[{q:"Can you cover an event at short notice?",a:"Often, yes. Message us on WhatsApp with the date and time and we will tell you whether we are free."},i,r]},{slug:"commercial",title:"Commercial",short:"Product, food, interior and brand photography that sells as well as it looks.",intro:"Clear, consistent images for menus, catalogues, websites and campaigns. We plan each shot list around where the photographs will be used, from marketplace listings to billboards.",idealFor:"Restaurants, retailers, hotels, makers and growing brands.",includes:[{title:"Shot list planning",text:"We agree every angle, crop and format before the shoot, so nothing is missed."},{title:"Studio and on-site",text:"Tabletop and product work in our studio; interiors and teams on location."},{title:"Consistent styling",text:"Backgrounds, light and colour kept consistent across the whole catalogue."},{title:"Usage licence",text:"Clear commercial usage rights for web, print and advertising."}],deliverables:["Edited image set","Marketplace crops","Web-optimised files","Usage licence"],faqs:[{q:"Do you provide props and styling?",a:"Basic surfaces and props are included. Food and prop stylists can be arranged for larger shoots."},{q:"Can you match our brand guidelines?",a:"Yes. Share your guidelines and any reference images, and we will match colour and mood across every shot."},r]}],d=t.z.object({id:t.z.string().min(1),category:t.z.enum(s),title:t.z.string().min(1),place:t.z.string(),aspect:t.z.enum(["tall","portrait","landscape","square"]),tone:t.z.enum(["dusk","amber","rose","sage","sky","ink"]),src:t.z.string().startsWith("/photos/"),featured:t.z.boolean().optional()}),l=t.z.array(d).parse(a.default);[...l],l.filter(e=>e.featured);let c=t.z.object({id:t.z.string().min(1),youtubeId:t.z.string().regex(/^[A-Za-z0-9_-]{11}$/),title:t.z.string().min(1),category:t.z.enum(s)});t.z.array(c).parse(o.default),n.map(e=>[e.slug,e]),e.s(["realPhotos",0,l,"services",0,n])},32330,e=>{"use strict";async function t(e,t){let a=await fetch(e,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(t)});if(!a.ok)throw Error(`The sheet answered ${a.status}`);return a.json()}e.s(["callSheet",0,t])}]);