export default function PlaceholderPage({ title, description }) {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center rounded-2xl border border-dashed border-ink-950/10 bg-white/60 px-6 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">Coming soon</p>
      <h2 className="mt-2 text-xl font-extrabold text-ink-950">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-ink-950/50">{description}</p>
    </div>
  );
}
