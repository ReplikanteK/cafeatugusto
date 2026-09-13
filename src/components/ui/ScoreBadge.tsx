export function ScoreBadge({ score }: { readonly score: number }) {
  return (
    <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1.5 rounded-full">
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="font-mono font-bold text-emerald-300 text-sm">{score} / 100</span>
    </div>
  );
}
