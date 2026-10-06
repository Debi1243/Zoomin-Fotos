(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,89664,e=>{"use strict";var t=e.i(56420);let a={name:"check",size:24,node:[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]};a.node;let s=(0,t.default)(a);e.s(["Check",0,s],89664)},22768,3923,e=>{"use strict";var t=e.i(56420);let a={name:"circle-alert",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],aliases:["alert-circle"]};a.node;let s=(0,t.default)(a);e.s(["CircleAlert",0,s],22768);var n=e.i(43476),i=e.i(89664),r=e.i(45060);let o="block w-full rounded-md border bg-elevated px-3.5 text-[0.9375rem] text-fg shadow-sm transition-[border-color,box-shadow] duration-150 placeholder:text-muted/70 hover:border-border-strong focus:border-fg focus:outline-none focus:ring-4 focus:ring-fg/10 disabled:cursor-not-allowed disabled:opacity-60";function l({id:e,label:t,hint:a,error:i,optional:r,children:o}){return(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"flex items-baseline justify-between gap-4",children:[(0,n.jsx)("label",{htmlFor:e,className:"text-sm font-medium",children:t}),r&&(0,n.jsx)("span",{className:"text-xs text-muted",children:"Optional"})]}),(0,n.jsx)("div",{className:"mt-2",children:o}),i?(0,n.jsxs)("p",{id:`${e}-error`,className:"mt-2 flex items-start gap-1.5 text-sm text-error",children:[(0,n.jsx)(s,{"aria-hidden":!0,className:"mt-0.5 size-3.5 shrink-0"}),i]}):a&&(0,n.jsx)("p",{id:`${e}-hint`,className:"mt-2 text-sm text-muted",children:a})]})}function d(e,t,a){return t?`${e}-error`:a?`${e}-hint`:void 0}e.s(["ChoiceGroup",0,function({legend:e,name:t,type:a,options:i,defaultValue:o,error:l}){let d=`${t}-error`;return(0,n.jsxs)("fieldset",{"aria-describedby":l?d:void 0,"aria-invalid":!!l||void 0,children:[(0,n.jsx)("legend",{className:"text-sm font-medium",children:e}),(0,n.jsx)("div",{className:"mt-3 flex flex-wrap gap-2",children:i.map(e=>(0,n.jsxs)("label",{className:(0,r.cn)("relative inline-flex h-10 cursor-pointer select-none items-center rounded-md border px-3.5 text-sm transition-colors","border-border bg-elevated hover:border-border-strong","has-[:checked]:border-fg has-[:checked]:bg-fg has-[:checked]:text-bg","has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fg"),children:[(0,n.jsx)("input",{type:a,name:t,value:e,defaultChecked:o.includes(e),className:"sr-only"}),e]},e))}),l&&(0,n.jsxs)("p",{id:d,className:"mt-2 flex items-start gap-1.5 text-sm text-error",children:[(0,n.jsx)(s,{"aria-hidden":!0,className:"mt-0.5 size-3.5 shrink-0"}),l]})]})},"TextField",0,function({id:e,label:t,hint:a,error:s,optional:c,valid:u,className:h,...m}){return(0,n.jsx)(l,{id:e,label:t,hint:a,error:s,optional:c,children:(0,n.jsxs)("div",{className:"relative",children:[(0,n.jsx)("input",{id:e,"aria-invalid":!!s||void 0,"aria-describedby":d(e,s,a),className:(0,r.cn)(o,"h-12",s?"border-error":u?"border-success/60 pr-10":"border-border",h),...m}),u&&!s&&(0,n.jsx)(i.Check,{"aria-hidden":!0,className:"pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-success"})]})})},"TextareaField",0,function({id:e,label:t,hint:a,error:s,className:i,...c}){return(0,n.jsx)(l,{id:e,label:t,hint:a,error:s,children:(0,n.jsx)("textarea",{id:e,"aria-invalid":!!s||void 0,"aria-describedby":d(e,s,a),className:(0,r.cn)(o,"min-h-36 resize-y py-3 leading-relaxed",s?"border-error":"border-border",i),...c})})},"control",0,o],3923)},8734,e=>{"use strict";var t=e.i(56420);let a={name:"copy",size:24,node:[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]};a.node;let s=(0,t.default)(a);e.s(["Copy",0,s],8734)},67784,e=>{"use strict";var t=e.i(56420);let a={name:"log-out",size:24,node:[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]};a.node;let s=(0,t.default)(a);e.s(["LogOut",0,s],67784)},77071,e=>{"use strict";var t=e.i(56420);let a={name:"plus",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]};a.node;let s=(0,t.default)(a);e.s(["Plus",0,s],77071)},41120,e=>{"use strict";var t=e.i(56420);let a={name:"refresh-cw",size:24,node:[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]};a.node;let s=(0,t.default)(a);e.s(["RefreshCw",0,s],41120)},86563,e=>{"use strict";var t=e.i(56420);let a={name:"star",size:24,node:[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]};a.node;let s=(0,t.default)(a);e.s(["Star",0,s],86563)},59659,e=>{"use strict";var t=e.i(56420);let a={name:"trash",size:24,node:[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],aliases:["trash-2"]};a.node;let s=(0,t.default)(a);e.s(["Trash2",0,s],59659)},83890,e=>{"use strict";var t=e.i(43476),a=e.i(22016),s=e.i(18566),n=e.i(45060);let i=[{href:"/admin",label:"Photos"},{href:"/admin/clients",label:"Clients"},{href:"/admin/pricing",label:"Prices"},{href:"/admin/reviews",label:"Reviews"},{href:"/admin/dashboard",label:"Dashboard"}];e.s(["default",0,function(){let e=(0,s.usePathname)().replace(/\/$/,"");return(0,t.jsx)("nav",{"aria-label":"Admin",className:"flex max-w-full gap-1 overflow-x-auto rounded-full border border-border p-1 text-sm",children:i.map(s=>(0,t.jsx)(a.default,{href:s.href,"aria-current":e===s.href?"page":void 0,className:(0,n.cn)("shrink-0 whitespace-nowrap rounded-full px-4 py-2 transition-colors",e===s.href?"bg-fg text-bg":"text-muted hover:text-fg"),children:s.label},s.href))})}])},13571,e=>{"use strict";var t=e.i(43476),a=e.i(71645),s=e.i(22768),n=e.i(56420);let i={name:"eye-off",size:24,node:[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]};i.node;let r=(0,n.default)(i);var o=e.i(11568),l=e.i(67784);let d={name:"pencil",size:24,node:[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]};d.node;let c=(0,n.default)(d);var u=e.i(77071),h=e.i(41120),m=e.i(86563),g=e.i(59659);let p={name:"undo-2",size:24,node:[["path",{d:"M9 14 4 9l5-5",key:"102s5s"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",key:"f3b9sd"}]]};p.node;let f=(0,n.default)(p);var x=e.i(59544),b=e.i(3923),y=e.i(32650),v=e.i(60538),w=e.i(31925),k=e.i(43080),S=e.i(32330),N=e.i(16148),j=e.i(54510),C=e.i(45060);function R({review:e,meta:a,muted:s,children:n}){return(0,t.jsxs)("article",{className:(0,C.cn)("flex h-full flex-col rounded-lg border border-border bg-surface p-5",s&&"opacity-70"),children:[(0,t.jsxs)("div",{className:"flex items-center justify-between gap-3",children:[(0,t.jsx)("span",{role:"img","aria-label":`${e.rating} out of 5 stars`,children:[1,2,3,4,5].map(a=>(0,t.jsx)(m.Star,{"aria-hidden":!0,className:(0,C.cn)("inline size-4",a<=e.rating?"fill-[var(--marigold-glow)] text-[var(--marigold-glow)]":"text-border-strong")},a))}),(0,t.jsx)("span",{className:"truncate text-xs text-muted",children:[e.event,(0,j.monthLabel)(e.date),"source"in e&&"google"===e.source&&"Google"].filter(Boolean).join(" · ")})]}),(0,t.jsx)("p",{className:"mt-3 line-clamp-6 whitespace-pre-line text-sm leading-relaxed",children:e.text}),(0,t.jsx)("p",{className:"mt-3 text-sm font-medium",children:e.name}),a&&(0,t.jsx)("p",{className:"truncate text-xs text-muted",children:a}),(0,t.jsx)("div",{className:"mt-auto flex flex-wrap items-center gap-2 pt-4",children:n})]})}function O({initial:e,from:n,busy:i,onSave:r,onCancel:o}){let[l,d]=(0,a.useState)(e),[c,u]=(0,a.useState)(null),h=(e,t)=>d(a=>({...a,[e]:t})),g=j.reviewEvents.includes(l.event)||!l.event?[...j.reviewEvents]:[l.event,...j.reviewEvents];return(0,t.jsxs)("form",{onSubmit:e=>{e.preventDefault();let t=j.testimonialSchema.safeParse({...l,name:l.name.trim(),text:l.text.trim(),photoId:l.photoId||void 0});t.success?r(t.data):u("Please fill in the name, a rating and the review.")},"aria-labelledby":"editor-title",className:"space-y-6 rounded-lg border border-border-strong bg-surface p-5 sm:p-8",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{id:"editor-title",className:"font-display text-2xl",children:n?"Publish this review":e.name?"Edit review":"Add a review"}),(0,t.jsx)("p",{className:"mt-1 text-sm text-muted",children:n?"Fix a typo if you need to, but keep the client's words. Choose a photo from their shoot to show beside it.":"Only add reviews clients really wrote, for example on WhatsApp or Google, with their permission."})]}),(0,t.jsxs)("fieldset",{children:[(0,t.jsx)("legend",{className:"text-sm font-medium",children:"Rating"}),(0,t.jsx)("div",{className:"mt-2 flex gap-1",children:[1,2,3,4,5].map(e=>(0,t.jsxs)("label",{className:"cursor-pointer",children:[(0,t.jsx)("input",{type:"radio",name:"edit-rating",checked:l.rating===e,onChange:()=>h("rating",e),className:"peer sr-only"}),(0,t.jsxs)("span",{className:"sr-only",children:[e," stars"]}),(0,t.jsx)(m.Star,{"aria-hidden":!0,className:(0,C.cn)("size-8 rounded peer-focus-visible:ring-2 peer-focus-visible:ring-fg",e<=l.rating?"fill-[var(--marigold-glow)] text-[var(--marigold-glow)]":"text-border-strong")})]},e))})]}),(0,t.jsxs)("div",{className:"grid gap-6 sm:grid-cols-3",children:[(0,t.jsx)(b.TextField,{id:"edit-name",label:"Name shown",value:l.name,maxLength:120,onChange:e=>h("name",e.target.value)}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{htmlFor:"edit-event",className:"text-sm font-medium",children:"Shoot"}),(0,t.jsx)("select",{id:"edit-event",value:l.event,onChange:e=>h("event",e.target.value),className:(0,C.cn)(b.control,"mt-2 h-12 border-border"),children:g.map(e=>(0,t.jsx)("option",{children:e},e))})]}),(0,t.jsx)(b.TextField,{id:"edit-date",label:"When",type:"month",optional:!0,value:l.date,onChange:e=>h("date",e.target.value)})]}),!n&&(0,t.jsxs)("label",{className:"flex items-center gap-3 text-sm",children:[(0,t.jsx)("input",{type:"checkbox",checked:"google"===l.source,onChange:e=>h("source",e.target.checked?"google":void 0),className:"size-4 accent-[var(--fg)]"}),"Copied from your Google reviews (shows “on Google” beside it)"]}),(0,t.jsx)(b.TextareaField,{id:"edit-text",label:"Review",rows:6,maxLength:2e3,value:l.text,onChange:e=>h("text",e.target.value)}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("label",{htmlFor:"edit-photo",className:"text-sm font-medium",children:["Photo beside the review ",(0,t.jsx)("span",{className:"font-normal text-muted",children:"(optional)"})]}),(0,t.jsxs)("select",{id:"edit-photo",value:l.photoId??"",onChange:e=>h("photoId",e.target.value||void 0),className:(0,C.cn)(b.control,"mt-2 h-12 border-border"),children:[(0,t.jsx)("option",{value:"",children:"No photo"}),N.realPhotos.map(e=>(0,t.jsxs)("option",{value:e.id,children:[e.title," (",e.id,")"]},e.id))]})]}),c&&(0,t.jsxs)("p",{role:"alert",className:"flex items-start gap-2 text-sm text-error",children:[(0,t.jsx)(s.CircleAlert,{"aria-hidden":!0,className:"mt-0.5 size-4 shrink-0"})," ",c]}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-3",children:[(0,t.jsx)(x.Button,{type:"submit",loading:i,loadingLabel:"Saving…",children:n?"Publish":"Save"}),(0,t.jsx)(x.Button,{type:"button",variant:"secondary",onClick:o,disabled:i,children:"Cancel"})]})]})}e.s(["default",0,function(){let[e,n]=(0,a.useState)(null),[i,d]=(0,a.useState)(!0),[m,p]=(0,a.useState)(null),[b,j]=(0,a.useState)(""),[E,L]=(0,a.useState)([]),[T,U]=(0,a.useState)(null),[M,I]=(0,a.useState)(!1),[P,z]=(0,a.useState)(null),[A,q]=(0,a.useState)(!1),[$,D]=(0,a.useState)(null),[V,B]=(0,a.useState)(null),[H,_]=(0,a.useState)(!1),F=(0,a.useCallback)(async(e,t)=>{d(!0),p(null);try{let{canSave:a}=await (0,w.verifyToken)(e);if(!a)throw new w.GitHubError("forbidden",403);let{content:s}=await (0,w.loadContent)(e);(0,y.storeToken)(e,t),n(e),j(s.settings.dataEndpoint??""),L(s.testimonials)}catch(e){(0,y.storeToken)(null,!1),n(null),p({kind:"error",text:(0,y.explain)(e)})}finally{d(!1)}},[]);(0,a.useEffect)(()=>{let e=(0,y.readStoredToken)();e?F(e,(0,y.remembered)()):d(!1)},[F]);let G=(0,a.useCallback)(async()=>{if(e&&b){I(!0),z(null);try{let t=await (0,S.callSheet)(b,{type:"reviews",token:e});if(!t.ok){if("Unknown request"===t.error){q(!0),U([]);return}throw Error("not-allowed"===t.error?"The sheet did not accept your access key.":t.error??"The sheet sent an error.")}U(t.reviews),q((t.version??1)<k.SCRIPT_VERSION)}catch(e){z((0,y.explain)(e))}finally{I(!1)}}},[e,b]);async function J(t,a){if(e&&b){U(e=>e?.map(e=>e.id===t?{...e,status:a}:e)??null);try{let s=await (0,S.callSheet)(b,{type:"review-status",token:e,id:t,status:a});if(!s.ok)throw Error(s.error)}catch{z("The website saved, but the sheet did not update that review's status. Refresh to try again.")}}}async function W(t,a,s){if(e){_(!0),z(null);try{let{content:n}=await (0,w.commitChange)(e,e=>({content:{testimonials:e.testimonials.some(e=>e.id===t.id)?e.testimonials.map(e=>e.id===t.id?t:e):[t,...e.testimonials]},message:a}));L(n.testimonials),B(null),D("Saved. The reviews page updates in about two minutes."),s&&await J(s.id,"Published")}catch(e){z((0,y.explain)(e))}finally{_(!1)}}}async function K(t){if(e&&confirm(`Take ${t.name}'s review off the website?`)){_(!0),z(null);try{let{content:a}=await (0,w.commitChange)(e,e=>({content:{testimonials:e.testimonials.filter(e=>e.id!==t.id)},message:`Remove the review from ${t.name}`}));L(a.testimonials),D("Removed. The reviews page updates in about two minutes."),T?.some(e=>e.id===t.id)&&await J(t.id,"Hidden")}catch(e){z((0,y.explain)(e))}finally{_(!1)}}}if((0,a.useEffect)(()=>{G()},[G]),i)return(0,t.jsxs)("p",{className:"flex items-center gap-2 text-muted",role:"status",children:[(0,t.jsx)(o.LoaderCircle,{"aria-hidden":!0,className:"size-4 animate-spin"})," Checking your sign-in…"]});if(!e)return(0,t.jsx)(y.SignIn,{onSignIn:F,notice:m});let Y=T?.filter(e=>"New"===e.status)??[],Z=T?.filter(e=>"Hidden"===e.status)??[];return(0,t.jsxs)("div",{className:"space-y-12",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6",children:[(0,t.jsxs)("div",{className:"flex flex-wrap gap-2",children:[(0,t.jsxs)(x.Button,{onClick:()=>B({review:{id:crypto.randomUUID().slice(0,8),name:"",event:"Wedding",date:"",rating:5,text:""}}),children:[(0,t.jsx)(u.Plus,{"aria-hidden":!0,className:"size-4"})," Add a review"]}),b&&(0,t.jsxs)("button",{type:"button",onClick:()=>void G(),disabled:M,className:"inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-muted hover:text-fg",children:[(0,t.jsx)(h.RefreshCw,{"aria-hidden":!0,className:(0,C.cn)("size-4",M&&"animate-spin")})," Refresh"]})]}),(0,t.jsxs)("button",{type:"button",onClick:()=>{(0,y.storeToken)(null,!1),n(null),U(null)},className:"inline-flex items-center gap-2 text-sm font-medium hover:text-accent",children:[(0,t.jsx)(l.LogOut,{"aria-hidden":!0,className:"size-4"})," Sign out"]})]}),P&&(0,t.jsxs)("p",{role:"alert",className:"flex items-start gap-2 rounded-md border border-error/40 p-4 text-sm text-error",children:[(0,t.jsx)(s.CircleAlert,{"aria-hidden":!0,className:"mt-0.5 size-4 shrink-0"})," ",P]}),$&&!P&&(0,t.jsx)("p",{role:"status",className:"rounded-md border border-success/40 p-4 text-sm",children:$}),V&&(0,t.jsx)(O,{initial:V.review,from:V.from,busy:H,onCancel:()=>B(null),onSave:e=>void W(e,V.from?`Publish the review from ${e.name}`:E.some(t=>t.id===e.id)?`Edit the review from ${e.name}`:`Add a review from ${e.name}`,V.from)},V.review.id),b?A?(0,t.jsx)(v.default,{reason:"A newer version of the sheet script collects reviews from your website.",onDone:()=>void G()}):(0,t.jsxs)("section",{"aria-labelledby":"waiting-title",children:[(0,t.jsxs)("h2",{id:"waiting-title",className:"font-display text-2xl",children:["Waiting for you ",T&&(0,t.jsxs)("span",{className:"tabular text-muted",children:["(",Y.length,")"]})]}),!T&&M?(0,t.jsxs)("p",{className:"mt-4 flex items-center gap-2 text-muted",role:"status",children:[(0,t.jsx)(o.LoaderCircle,{"aria-hidden":!0,className:"size-4 animate-spin"})," Loading reviews…"]}):0===Y.length?(0,t.jsx)("p",{className:"mt-4 text-sm text-muted",children:"No new reviews. When a client sends one from the reviews page, it shows up here and you get an email."}):(0,t.jsx)("ul",{className:"mt-5 grid gap-4 md:grid-cols-2",children:Y.map(e=>(0,t.jsx)("li",{children:(0,t.jsxs)(R,{review:e,meta:`Sent ${new Date(e.received).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}${e.email?` \xb7 ${e.email}`:""}`,children:[(0,t.jsx)(x.Button,{disabled:H,onClick:()=>B({review:{id:e.id,name:e.name,event:e.event,date:e.date,rating:e.rating,text:e.text},from:e}),children:"Review and publish"}),(0,t.jsxs)("button",{type:"button",disabled:H,onClick:()=>void J(e.id,"Hidden"),className:"inline-flex h-9 items-center gap-1.5 px-2 text-sm text-muted hover:text-fg",children:[(0,t.jsx)(r,{"aria-hidden":!0,className:"size-4"})," Don't publish"]})]})},e.id))})]}):(0,t.jsxs)("p",{className:"max-w-[60ch] rounded-lg border border-border bg-surface p-5 text-sm leading-relaxed text-muted",children:["Clients can send reviews from the website once your Google Sheet is connected on the"," ",(0,t.jsx)("a",{href:"../dashboard/",className:"link-underline text-fg",children:"Dashboard"})," tab. Until then the reviews page asks them to email you, and you can add those here with ",(0,t.jsx)("b",{children:"Add a review"}),"."]}),(0,t.jsxs)("section",{"aria-labelledby":"live-title",children:[(0,t.jsxs)("h2",{id:"live-title",className:"font-display text-2xl",children:["On the website ",(0,t.jsxs)("span",{className:"tabular text-muted",children:["(",E.length,")"]})]}),0===E.length?(0,t.jsx)("p",{className:"mt-4 text-sm text-muted",children:"Nothing published yet. The reviews page shows a short note until you publish the first review."}):(0,t.jsx)("ul",{className:"mt-5 grid gap-4 md:grid-cols-2",children:E.map(e=>(0,t.jsx)("li",{children:(0,t.jsxs)(R,{review:e,meta:e.photoId?`Photo: ${N.realPhotos.find(t=>t.id===e.photoId)?.title??e.photoId}`:void 0,children:[(0,t.jsxs)("button",{type:"button",disabled:H,onClick:()=>B({review:e}),className:"inline-flex h-9 items-center gap-1.5 px-2 text-sm hover:text-accent",children:[(0,t.jsx)(c,{"aria-hidden":!0,className:"size-4"})," Edit"]}),(0,t.jsxs)("button",{type:"button",disabled:H,onClick:()=>void K(e),className:"inline-flex h-9 items-center gap-1.5 px-2 text-sm text-muted hover:text-error",children:[(0,t.jsx)(g.Trash2,{"aria-hidden":!0,className:"size-4"})," Remove"]})]})},e.id))})]}),Z.length>0&&(0,t.jsxs)("details",{className:"group",children:[(0,t.jsxs)("summary",{className:"cursor-pointer text-sm text-muted hover:text-fg",children:["Not published (",Z.length,")"]}),(0,t.jsx)("ul",{className:"mt-5 grid gap-4 md:grid-cols-2",children:Z.map(e=>(0,t.jsx)("li",{children:(0,t.jsx)(R,{review:e,muted:!0,children:(0,t.jsxs)("button",{type:"button",disabled:H,onClick:()=>void J(e.id,"New"),className:"inline-flex h-9 items-center gap-1.5 px-2 text-sm hover:text-accent",children:[(0,t.jsx)(f,{"aria-hidden":!0,className:"size-4"})," Move back to waiting"]})})},e.id))})]})]})}],13571)},60538,43080,e=>{"use strict";var t=e.i(43476),a=e.i(71645),s=e.i(8734),n=e.i(41120),i=e.i(59544),r=e.i(16148),o=e.i(31338);let l=`// Zoomin Fotos dashboard and client portal. Paste this whole file into Extensions > Apps Script.
const VERSION = 3;
const REPO = "${o.contentRepo.owner}/${o.contentRepo.repo}";
const NOTIFY_EMAIL = "${r.brand.email}";

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
`;e.s(["SCRIPT_VERSION",0,3,"dashboardScript",0,l],43080),e.s(["default",0,function({onDone:e,reason:r}){let[o,d]=(0,a.useState)(!1),c=async()=>{try{await navigator.clipboard.writeText(l),d(!0),setTimeout(()=>d(!1),2500)}catch{}};return(0,t.jsxs)("section",{"aria-labelledby":"update-title",className:"max-w-3xl rounded-lg border border-border-strong bg-surface p-6",children:[(0,t.jsx)("h2",{id:"update-title",className:"font-display text-2xl",children:"Update your sheet script"}),(0,t.jsxs)("p",{className:"mt-2 text-sm text-muted",children:[r," It takes about two minutes, and the web address stays the same."]}),(0,t.jsxs)("ol",{className:"mt-5 list-decimal space-y-2 pl-5 text-sm leading-relaxed",children:[(0,t.jsxs)("li",{children:["Open your “Zoomin Fotos dashboard” Google Sheet and choose ",(0,t.jsx)("b",{children:"Extensions › Apps Script"}),"."]}),(0,t.jsx)("li",{children:"Delete all the code there, paste the new code, and click the save icon."}),(0,t.jsxs)("li",{children:["Click ",(0,t.jsx)("b",{children:"Deploy › Manage deployments"}),", click the pencil icon, set ",(0,t.jsx)("b",{children:"Version"})," to ",(0,t.jsx)("b",{children:"New version"}),", and click"," ",(0,t.jsx)("b",{children:"Deploy"}),". If Google asks, authorise it again."]}),(0,t.jsx)("li",{children:"Come back here and press Check again."})]}),(0,t.jsxs)("div",{className:"mt-5 flex flex-wrap gap-3",children:[(0,t.jsxs)(i.Button,{type:"button",variant:"secondary",onClick:()=>void c(),children:[(0,t.jsx)(s.Copy,{"aria-hidden":!0,className:"size-4"})," ",o?"Copied":"Copy the new code"]}),(0,t.jsxs)(i.Button,{type:"button",onClick:e,children:[(0,t.jsx)(n.RefreshCw,{"aria-hidden":!0,className:"size-4"})," Check again"]})]}),(0,t.jsx)("textarea",{readOnly:!0,value:l,"aria-label":"Sheet script",onFocus:e=>e.currentTarget.select(),className:"mt-4 h-28 w-full rounded-md border border-border bg-bg p-3 font-mono text-xs"})]})}],60538)},32650,31925,e=>{"use strict";var t=e.i(43476),a=e.i(71645),s=e.i(59544),n=e.i(3923);let{owner:i,repo:r,branch:o}=e.i(31338).contentRepo,l=`/repos/${i}/${r}`,d={photos:"src/content/photos.json",videos:"src/content/videos.json",settings:"src/content/settings.json",pricing:"src/content/pricing.json",testimonials:"src/content/testimonials.json"};class c extends Error{status;constructor(e,t){super(e),this.status=t}}async function u(e,t,a={}){let s=await fetch(`https://api.github.com${t}`,{...a,cache:"no-store",headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${e}`,"X-GitHub-Api-Version":"2022-11-28",...a.body?{"Content-Type":"application/json"}:{}}});if(!s.ok)throw new c((await s.json().catch(()=>({}))).message??s.statusText,s.status);return s.json()}async function h(e){let[t,a]=await Promise.all([u(e,"/user").catch(()=>({login:""})),u(e,l)]);return{login:t.login,canSave:!!a.permissions?.push}}async function m(e){return(await u(e,`${l}/git/ref/heads/${o}`)).object.sha}async function g(e,t){let a=async(a,s=[])=>{try{let s,n=await u(e,`${l}/contents/${a}?ref=${t}`);return JSON.parse((s=n.content,new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,"")),e=>e.charCodeAt(0)))))}catch(e){if(e instanceof c&&404===e.status)return s;throw e}},[s,n,i,r,o]=await Promise.all([a(d.photos),a(d.videos),a(d.settings,{}),a(d.pricing,{prices:{},eventShare:{}}),a(d.testimonials)]);return{photos:s,videos:n,settings:i,pricing:r,testimonials:o}}async function p(e){let t=await m(e);return{sha:t,content:await g(e,t)}}async function f(e,t,a=0){let s=await m(e),[n,i]=await Promise.all([g(e,s),u(e,`${l}/git/commits/${s}`)]),{content:r,files:h=[],message:p}=t(n),x=(t,a)=>u(e,`${l}/git/blobs`,{method:"POST",body:JSON.stringify({content:t,encoding:a})}),b=await Promise.all([...Object.keys(r).map(async e=>({path:d[e],sha:(await x(`${JSON.stringify(r[e],null,2)}
`,"utf-8")).sha})),...h.map(async e=>({path:e.path,sha:null===e.base64?null:(await x(e.base64,"base64")).sha}))]),y=await u(e,`${l}/git/trees`,{method:"POST",body:JSON.stringify({base_tree:i.tree.sha,tree:b.map(e=>({path:e.path,mode:"100644",type:"blob",sha:e.sha}))})}),v=await u(e,`${l}/git/commits`,{method:"POST",body:JSON.stringify({message:p,tree:y.sha,parents:[s]})});try{await u(e,`${l}/git/refs/heads/${o}`,{method:"PATCH",body:JSON.stringify({sha:v.sha,force:!1})})}catch(s){if(s instanceof c&&422===s.status&&a<2)return f(e,t,a+1);throw s}return{sha:v.sha,content:{...n,...r}}}async function x(e,t){return(await u(e,`${l}/commits/gh-pages`)).commit.message.includes(t)}e.s(["GitHubError",0,c,"commitChange",0,f,"isPublished",0,x,"loadContent",0,p,"rawUrl",0,(e,t)=>`https://raw.githubusercontent.com/${i}/${r}/${t}/public${e}`,"verifyToken",0,h],31925);var b=e.i(74629);let y="zf-admin-token";e.s(["SignIn",0,function({onSignIn:e,notice:i}){let[r,o]=(0,a.useState)(""),[l,d]=(0,a.useState)(!0);return(0,t.jsxs)("div",{className:"grid gap-12 lg:grid-cols-12 lg:gap-x-10",children:[(0,t.jsxs)("form",{className:"space-y-5 lg:col-span-5",onSubmit:t=>{t.preventDefault(),r.trim()&&e(r.trim(),l)},children:[(0,t.jsx)(n.TextField,{id:"admin-key",label:"Access key",type:"password",autoComplete:"current-password",value:r,onChange:e=>o(e.target.value),error:i?.kind==="error"?i.text:void 0,hint:"Your GitHub access key for the website. It stays on this device and is only sent to GitHub and to your own dashboard sheet.",required:!0}),(0,t.jsxs)("label",{className:"flex items-center gap-2 text-sm",children:[(0,t.jsx)("input",{type:"checkbox",checked:l,onChange:e=>d(e.target.checked),className:"size-4 accent-[var(--rani)]"}),"Keep me signed in on this device"]}),(0,t.jsx)(s.Button,{type:"submit",children:"Sign in"})]}),(0,t.jsxs)("div",{className:"rounded-lg border border-border bg-surface p-6 text-sm leading-relaxed lg:col-span-6 lg:col-start-7",children:[(0,t.jsx)("h2",{className:"font-medium",children:"Getting an access key (one time)"}),(0,t.jsxs)("ol",{className:"mt-3 list-decimal space-y-2 pl-5 text-muted",children:[(0,t.jsxs)("li",{children:["Sign in to GitHub and open"," ",(0,t.jsx)("a",{className:"text-fg underline underline-offset-2",href:"https://github.com/settings/personal-access-tokens/new",target:"_blank",rel:"noreferrer",children:"new fine-grained token"}),"."]}),(0,t.jsx)("li",{children:"Name it “Zoomin Fotos admin” and pick an expiry date."}),(0,t.jsxs)("li",{children:["Under ",(0,t.jsx)("span",{className:"text-fg",children:"Repository access"}),", choose ",(0,t.jsx)("span",{className:"text-fg",children:"Only select repositories"})," and pick ",(0,t.jsx)("span",{className:"text-fg",children:"Zoomin-Fotos"}),"."]}),(0,t.jsxs)("li",{children:["Under ",(0,t.jsx)("span",{className:"text-fg",children:"Permissions"}),", set ",(0,t.jsx)("span",{className:"text-fg",children:"Contents"})," to"," ",(0,t.jsx)("span",{className:"text-fg",children:"Read and write"}),"."]}),(0,t.jsx)("li",{children:"Generate the token, copy it, and paste it here."})]})]})]})},"explain",0,function(e){return e instanceof c?401===e.status?"That access key was not accepted. It may have expired; create a new one and sign in again.":403===e.status||404===e.status?"This access key cannot change the website. Check it has Contents: Read and write access to the Zoomin-Fotos repository.":`GitHub said: ${e.message}`:e instanceof Error?e.message:"Something went wrong. Please try again."},"readStoredToken",0,function(){try{return localStorage.getItem(y)??sessionStorage.getItem(y)}catch{return null}},"remembered",0,function(){try{return null!==localStorage.getItem(y)}catch{return!1}},"storeToken",0,function(e,t){try{if(localStorage.removeItem(y),sessionStorage.removeItem(y),!e)return;(t?localStorage:sessionStorage).setItem(y,e),localStorage.setItem(b.NO_TRACK_KEY,"1")}catch{}}],32650)},50371,(e,t,a)=>{t.exports=[]},54510,e=>{"use strict";var t=e.i(81307),a=e.i(50371);let s=t.z.object({id:t.z.string().min(1),name:t.z.string().min(1).max(120),event:t.z.string().max(80).default(""),date:t.z.string().max(7).default(""),rating:t.z.number().int().min(1).max(5),text:t.z.string().min(1).max(2e3),photoId:t.z.string().max(10).optional(),source:t.z.literal("google").optional()});t.z.array(s).parse(a.default),e.s(["monthLabel",0,e=>{let[t,a]=e.split("-").map(Number);return t&&a?new Date(t,a-1,1).toLocaleDateString("en-IN",{month:"long",year:"numeric"}):""},"reviewEvents",0,["Wedding","Pre-wedding","Portraits","Maternity & Newborn","Event","Commercial","Other"],"testimonialSchema",0,s])},32330,e=>{"use strict";async function t(e,t){let a=await fetch(e,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(t)});if(!a.ok)throw Error(`The sheet answered ${a.status}`);return a.json()}e.s(["callSheet",0,t])}]);