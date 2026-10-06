import type { RowField } from "./RowsEditor";
import { deliveryStatuses } from "@/lib/booking";

/** The list fields shared by the admin booking editor and the client portal. */
export const bookingFields = {
  timeline: [
    { key: "date", label: "Date", type: "date", span: 3, half: true },
    { key: "time", label: "Time", type: "time", span: 2, half: true },
    { key: "title", label: "What", placeholder: "Haldi", span: 3 },
    { key: "place", label: "Where", placeholder: "Home, Cuttack", span: 4 },
  ],
  shots: [{ key: "text", label: "Photo you'd like", placeholder: "Bride with her grandmother", span: 12 }],
  venues: [
    { key: "event", label: "Event", placeholder: "Reception", span: 2 },
    { key: "name", label: "Venue", placeholder: "Mayfair Lagoon", span: 3 },
    { key: "address", label: "Address", span: 4 },
    { key: "map", label: "Map link", type: "url", placeholder: "https://maps.app.goo.gl/…", span: 3 },
  ],
  family: [
    { key: "name", label: "Name", span: 3 },
    { key: "relation", label: "Relation", placeholder: "Bride's mother", span: 3, half: true },
    { key: "side", label: "Side", type: "select", options: ["Bride", "Groom", "Both"], span: 2, half: true },
    { key: "phone", label: "Phone", type: "tel", span: 2 },
    { key: "note", label: "Note", placeholder: "Must be in the family photos", span: 2 },
  ],
  items: [
    { key: "label", label: "Item", placeholder: "Wedding day: 2 photographers, 1 cinematographer", span: 9 },
    { key: "amount", label: "Amount (₹)", type: "number", span: 3 },
  ],
  team: [
    { key: "name", label: "Name", span: 4 },
    { key: "role", label: "Role", placeholder: "Lead photographer", span: 4, half: true },
    { key: "phone", label: "Phone", type: "tel", span: 4, half: true },
  ],
  schedule: [
    { key: "date", label: "Date", type: "date", span: 3, half: true },
    { key: "time", label: "Time", type: "time", span: 2, half: true },
    { key: "title", label: "What happens", placeholder: "Team arrives at the venue", span: 7 },
  ],
  delivery: [
    { key: "status", label: "Status", type: "select", options: deliveryStatuses, span: 2, half: true },
    { key: "expected", label: "Expected", type: "date", span: 2, half: true },
    { key: "url", label: "Link", type: "url", placeholder: "YouTube, Google Drive or gallery link", span: 4 },
    { key: "note", label: "Note", span: 4 },
  ],
} satisfies Record<string, RowField[]>;

export const blanks = {
  timeline: () => ({ date: "", time: "", title: "", place: "" }),
  shots: () => ({ text: "", by: "" }),
  venues: () => ({ event: "", name: "", address: "", map: "" }),
  family: () => ({ name: "", relation: "", side: "Bride", phone: "", note: "" }),
  items: () => ({ label: "", amount: 0 }),
  team: () => ({ name: "", role: "", phone: "" }),
  schedule: () => ({ date: "", time: "", title: "" }),
};
