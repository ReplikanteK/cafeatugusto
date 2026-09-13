"use client";
import { useState, useMemo } from "react";
import { MACHINES_SEED } from "@/data/machines";
import { GRINDERS_SEED } from "@/data/grinders";

type Cat = "all" | "machines" | "grinders";
type Diam = "all" | "51" | "54" | "57" | "58";

interface Item {
  id: string; type: "machine" | "grinder"; name: string; brand: string; price: number; image: string; asin: string;
  diam?: number; pid?: boolean; boiler?: string; heat?: number; integrated?: boolean;
  burr?: string; burrSize?: number; adj?: string; retention?: string; focus?: string;
}

const allItems: Item[] = [
  ...MACHINES_SEED.map(m=> ({ id: m.id, type:"machine" as const, name: m.model, brand: m.brand, price: m.priceApproxEUR, image: m.image, asin: m.asin, diam: m.specs.portafilterDiameter, pid: m.specs.pid, boiler: m.specs.boilerType, heat: m.specs.startupTimeSeconds, integrated: m.grinderIntegrated })),
  ...GRINDERS_SEED.map(g=> ({ id: g.id, type:"grinder" as const, name: g.model, brand: g.brand, price: g.priceApproxEUR, image: g.image, asin: g.asin, burr: g.specs.burrType, burrSize: g.specs.burrSizeMM, adj: g.specs.grindAdjustment, retention: g.performance.retention>=4 ? "Single-Dose" : g.specs.hopperCapacityGrams>100 ? "Con Tolva" : "Manual", focus: g.specs.espressoCapable && g.specs.filterCapable ? "Polivalente" : g.specs.espressoCapable ? "Espresso" : "Filtro" })),
];

const PAGE_SIZE = 12;

export default function CatalogoPage() {
  const [cat, setCat] = useState<Cat>("all");
  const [diam, setDiam] = useState<Diam>("all");
  const [pidOnly, setPidOnly] = useState(false);
  const [noIntegrated, setNoIntegrated] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(()=> allItems.filter(i=>{
    if (cat==="machines" && i.type!=="machine") return false;
    if (cat==="grinders" && i.type!=="grinder") return false;
    if (i.price > maxPrice) return false;
    if (query.trim()) { const q=query.toLowerCase(); if (!`${i.brand} ${i.name}`.toLowerCase().includes(q)) return false; }
    if (i.type==="machine") {
      if (diam!=="all" && String(i.diam)!==diam) return false;
      if (pidOnly && !i.pid) return false;
      if (noIntegrated && i.integrated) return false;
    }
    return true;
  }), [cat, diam, pidOnly, noIntegrated, maxPrice, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(()=> {
    const start=(page-1)*PAGE_SIZE;
    return filtered.slice(start, start+PAGE_SIZE);
  }, [filtered, page]);

  // reset page on filter change
  const onFilterChange = (fn:()=>void)=> { fn(); setPage(1); };

  const toggle = (id:string)=> setSelected(s=> s.includes(id) ? s.filter(x=>x!==id) : s.length>=3 ? s : [...s, id]);
  const selItems = allItems.filter(i=> selected.includes(i.id));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-black">Catálogo — Behind the Curtain</h1>
      <p className="text-sm text-stone-400 mt-1">Ficha técnica auditable. Filtra como en BGG — mira la arquitectura real.</p>

      <div className="mt-6 flex flex-col gap-3 border-y border-stone-800 py-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            {(["all","machines","grinders"] as Cat[]).map(c=> <button key={c} onClick={()=>onFilterChange(()=>setCat(c))} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${cat===c?"bg-amber-600 text-white border-amber-600":"bg-stone-900 text-stone-400 border-stone-800"}`}>{c==="all"?"Todas":c==="machines"?"Máquinas":"Molinillos"}</button>)}
          </div>
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <input value={query} onChange={e=>onFilterChange(()=>setQuery(e.target.value))} placeholder="Buscar Sage, Gaggia, K6…" className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-sm placeholder:text-stone-500" />
            <span className="absolute left-2.5 top-2 text-stone-500 text-xs">🔍</span>
          </div>
          <select value={diam} onChange={e=>onFilterChange(()=>setDiam(e.target.value as Diam))} className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs">
            <option value="all">Diámetro — Cualquiera</option><option value="51">51mm</option><option value="54">54mm</option><option value="57">57mm</option><option value="58">58mm Pro</option>
          </select>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={pidOnly} onChange={e=>onFilterChange(()=>setPidOnly(e.target.checked))} /> Solo PID</label>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={noIntegrated} onChange={e=>onFilterChange(()=>setNoIntegrated(e.target.checked))} /> Sin molino integrado</label>
          <div className="flex items-center gap-2 text-xs"><span>≤{maxPrice}€</span><input type="range" min={100} max={2000} step={50} value={maxPrice} onChange={e=>onFilterChange(()=>setMaxPrice(Number(e.target.value)))} className="accent-amber-600" /></div>
        </div>
        <div className="flex justify-between items-center text-xs text-stone-500">
          <span>Mostrando {paginated.length} de {filtered.length} productos{filtered.length!==allItems.length ? ` (filtrado de ${allItems.length})` : ""} — página {page}/{totalPages}</span>
          {filtered.length===0 && <span className="text-amber-400">No encontramos productos con ese filtro — prueba “Lelit” o “K6”.</span>}
        </div>
      </div>

      {filtered.length===0 ? (
        <div className="mt-12 text-center py-12 rounded-xl bg-stone-900 border border-stone-800">
          <p className="text-stone-400 text-sm">No encontramos productos con ese filtro.</p>
          <button onClick={()=>{setQuery(""); setCat("all"); setDiam("all"); setPidOnly(false); setNoIntegrated(false); setMaxPrice(2000); setPage(1);}} className="mt-3 px-4 py-2 bg-stone-800 rounded-lg text-xs font-bold">Limpiar filtros</button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {paginated.map(i=> (
              <div key={i.id} className="rounded-xl bg-stone-900 border border-stone-800 overflow-hidden flex flex-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt={i.name} className="w-full aspect-[4/3] object-cover bg-stone-800" onError={e=>{ (e.target as HTMLImageElement).style.display='none'}} />
                <div className="p-3 flex-1 flex flex-col">
                  <p className="text-xs font-mono text-stone-500">{i.brand}</p>
                  <p className="font-bold text-sm text-white">{i.name}</p>
                  <p className="text-xs text-amber-400 font-mono">{i.price}€</p>
                  {i.type==="machine" ? (
                    <div className="grid grid-cols-2 gap-1 mt-2 text-[10px]">
                      <span className="bg-stone-950 border border-stone-800 rounded px-1.5 py-1">📏 {i.diam ?? "—"}mm</span>
                      <span className="bg-stone-950 border border-stone-800 rounded px-1.5 py-1">🌡️ {i.boiler}</span>
                      <span className={`rounded px-1.5 py-1 border ${i.pid?"bg-amber-900/30 border-amber-500/30 text-amber-300":"bg-stone-950 border-stone-800 text-stone-400"}`}>🎯 PID: {i.pid?"Sí":"No"}</span>
                      <span className="bg-stone-950 border border-stone-800 rounded px-1.5 py-1">⏱️ {i.heat! <60 ? `${i.heat}s` : `${Math.round(i.heat!/60)}min`}</span>
                      <span className="col-span-2 bg-stone-950 border border-stone-800 rounded px-1.5 py-1">⚙️ {i.integrated?"Con molino":"Solo extracción"}</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1 mt-2 text-[10px]">
                      <span className="bg-stone-950 border border-stone-800 rounded px-1.5 py-1">⚙️ {i.burr} {i.burrSize}mm</span>
                      <span className="bg-stone-950 border border-stone-800 rounded px-1.5 py-1">🔄 {i.retention}</span>
                      <span className="bg-stone-950 border border-stone-800 rounded px-1.5 py-1">📐 {i.adj==="stepless" ? "Stepless" : "Stepped"}</span>
                      <span className="bg-stone-950 border border-stone-800 rounded px-1.5 py-1">🎯 {i.focus}</span>
                    </div>
                  )}
                  <label className="mt-3 flex items-center gap-2 text-xs cursor-pointer">
                    <input type="checkbox" checked={selected.includes(i.id)} onChange={()=>toggle(i.id)} className="accent-amber-600" />
                    Comparar
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center items-center gap-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs disabled:opacity-30">← Anterior</button>
            <span className="text-xs font-mono text-stone-400">Página {page} de {totalPages}</span>
            <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs disabled:opacity-30">Siguiente →</button>
          </div>
        </>
      )}

      {selected.length>0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-amber-500/30 p-3 flex items-center gap-3 justify-center z-40">
          <div className="flex -space-x-2">
            {selItems.map(s=> (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s.id} src={s.image} alt={s.name} className="w-10 h-10 rounded-full border-2 border-stone-900 object-cover bg-stone-800" />
            ))}
          </div>
          <span className="text-xs font-bold">{selected.length}/3 seleccionados</span>
          <button onClick={()=>setShowModal(true)} className="px-4 py-2 bg-amber-600 rounded-lg text-xs font-black">Comparar cara a cara →</button>
          <button onClick={()=>setSelected([])} className="text-xs underline text-stone-400">Limpiar</button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={()=>setShowModal(false)}>
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-5xl w-full max-h-[80vh] overflow-auto p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center"><h3 className="font-black text-lg">Versus — Specs cara a cara</h3><button onClick={()=>setShowModal(false)} className="text-stone-400">✕</button></div>
            <table className="w-full text-sm mt-4">
              <thead><tr className="text-stone-400"><th className="p-2 text-left">Spec</th>{selItems.map(s=> <th key={s.id} className="p-2 text-left">{s.brand} {s.name}</th>)}</tr></thead>
              <tbody>
                <tr className="border-t border-stone-800"><td className="p-2 font-bold">Precio</td>{selItems.map(s=> <td key={s.id} className="p-2 font-mono">{s.price}€</td>)}</tr>
                <tr className="border-t border-stone-800"><td className="p-2 font-bold">Tipo</td>{selItems.map(s=> <td key={s.id} className="p-2">{s.type}</td>)}</tr>
                {selItems[0]?.type==="machine" && (
                  <>
                    <tr className="border-t border-stone-800"><td className="p-2 font-bold">Portafiltro</td>{selItems.map(s=> <td key={s.id} className={`p-2 ${s.diam===58?"text-amber-400 font-bold":""}`}>{s.diam}mm</td>)}</tr>
                    <tr className="border-t border-stone-800"><td className="p-2 font-bold">PID</td>{selItems.map(s=> <td key={s.id} className={`p-2 ${s.pid?"bg-amber-900/20 text-amber-300":""}`}>{s.pid?"Sí":"No"}</td>)}</tr>
                    <tr className="border-t border-stone-800"><td className="p-2 font-bold">Térmico</td>{selItems.map(s=> <td key={s.id} className="p-2">{s.boiler}</td>)}</tr>
                    <tr className="border-t border-stone-800"><td className="p-2 font-bold">Calentamiento</td>{selItems.map(s=> { const v = selItems.map(x=>x.heat!); const best = Math.min(...v); return <td key={s.id} className={`p-2 ${s.heat===best?"text-emerald-400 font-bold":""}`}>{s.heat! <60 ? `${s.heat}s` : `${Math.round(s.heat!/60)}min`}</td>; })}</tr>
                  </>
                )}
                {selItems[0]?.type==="grinder" && (
                  <>
                    <tr className="border-t border-stone-800"><td className="p-2 font-bold">Muelas</td>{selItems.map(s=> <td key={s.id} className="p-2">{s.burr} {s.burrSize}mm</td>)}</tr>
                    <tr className="border-t border-stone-800"><td className="p-2 font-bold">Ajuste</td>{selItems.map(s=> <td key={s.id} className={`p-2 ${s.adj==="stepless"?"text-amber-400":""}`}>{s.adj}</td>)}</tr>
                  </>
                )}
              </tbody>
            </table>
            <div className="mt-4 flex gap-2">
              {selItems.map(s=> <a key={s.id} href={`https://www.amazon.es/dp/${s.asin}?tag=cafeatugusto-21`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-amber-600 rounded-lg text-center text-xs font-bold">Ver {s.brand} →</a>)}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
