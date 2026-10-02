type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export default function JsonLd({ data }: { data: { [key: string]: Json } | { [key: string]: Json }[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for "<" so it cannot close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
