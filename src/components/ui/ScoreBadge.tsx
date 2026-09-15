export function ScoreBadge({ score }: { readonly score: number }) {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  const label = s >= 90 ? "Encaje muy alto" : s >= 75 ? "Encaje alto" : s >= 60 ? "Encaje medio" : "Encaje ajustado";
  return (
    <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1.5 rounded-full">
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
      <span className="font-mono font-bold text-emerald-300 text-sm">{label} — {s}/100</span>
    </div>
  );
}
