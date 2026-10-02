import { principles } from "@/lib/data";

export default function Approach() {
  return (
    <section aria-labelledby="approach-title" className="surface-inverse">
      <div className="container-page section-y grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
        <p className="label text-inverse-muted lg:col-span-3 lg:pt-4">Our approach</p>
        <div className="lg:col-span-9">
          <h2 id="approach-title" className="reveal max-w-[20ch] font-display text-h1">
            We would rather catch the laugh <em>after</em> the pose.
          </h2>
          <ol className="mt-14 grid gap-px bg-inverse-border md:mt-20 md:grid-cols-2">
            {principles.map((p, i) => (
              <li key={p.title} className="reveal bg-inverse py-8 md:odd:pr-10 md:even:pl-10">
                <p className="label tabular text-inverse-muted">0{i + 1}</p>
                <h3 className="mt-6 font-display text-h3">{p.title}</h3>
                <p className="mt-3 max-w-[42ch] leading-relaxed text-inverse-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
