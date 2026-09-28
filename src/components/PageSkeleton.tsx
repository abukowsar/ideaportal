export default function PageSkeleton({ variant = "cards", bare = false }: { variant?: "cards" | "list"; bare?: boolean }) {
  const body = (
    <div aria-busy="true" aria-live="polite">
      <div className="skel skel-eyebrow" />
      <div className="skel skel-title" />
      <div className="skel skel-line" />
      <div className={`skel-grid skel-${variant}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="skel skel-block" key={i} />
        ))}
      </div>
    </div>
  );
  if (bare) return body;
  return (
    <section>
      <div className="wrap">{body}</div>
    </section>
  );
}
