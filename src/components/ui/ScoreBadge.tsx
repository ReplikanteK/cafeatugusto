export function ScoreBadge({ score }: { readonly score: number }) {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  return (
    <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1.5 rounded-full">
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
      <span className="font-mono font-bold text-emerald-300 text-sm">{s} / 100</span>
    </div>
  );
}
