"use client";
import { useState } from "react";
import Image from "next/image";
// v1.1 (backlog): next/image con fill + sizes — srcset responsive y sin CLS.
// El padre ya es relative con aspect o tamaño fijo en todos los usos.
export function ProductImage({ src, alt, className="aspect-[4/3]", sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" }: { src: string; alt: string; className?: string; sizes?: string }) {
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
    <div className={`${className} relative overflow-hidden rounded-xl bg-white border border-stone-200 flex items-center justify-center p-0`}>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
    <Image src={src} alt={alt} fill sizes={sizes} onError={()=>setErr(true)} className="relative object-contain brightness-100 contrast-100 drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] mix-blend-normal" />
    </div>
  );
}
