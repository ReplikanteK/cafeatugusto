"use client";
import { useState } from "react";
export function ProductImage({ src, alt, className="aspect-[4/3]" }: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className={`${className} bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 rounded-xl flex flex-col items-center justify-center gap-2 text-stone-500`}>
        <span className="text-2xl">☕</span>
        <span className="text-xs font-mono text-amber-500/60">portafiltro • {alt}</span>
      </div>
    );
  }
  return (
    <div className={`${className} relative overflow-hidden rounded-xl bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 flex items-center justify-center`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} onError={()=>setErr(true)} className="relative w-full h-full object-cover brightness-95 contrast-105 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] mix-blend-normal" />
    </div>
  );
}
