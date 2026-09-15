export default function Metodologia() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-6 bg-stone-900 border border-stone-800 rounded-2xl p-8">
        <h1 className="text-3xl font-black text-white">Metodología de Evaluación</h1>
        <p className="text-stone-400 text-sm">
          Nuestro sistema evalúa la compatibilidad del equipamiento espresso mediante dos capas de filtrado objetivo:
        </p>
        <ol className="list-decimal ml-6 space-y-4 text-stone-300 text-sm">
          <li>
            <b className="text-white">Filtros Críticos de Compatibilidad:</b> Eliminación estricta por presupuesto máximo, restricciones de espacio físico o requisitos indispensables (molinillo integrado vs molinillo exento).
          </li>
          <li>
            <b className="text-white">Scoring Ponderado 7 dims (0–100):</b> Presupuesto 35% · Workflow 20% · Espacio 15% · Mantenimiento 10% · Leche 10% · Uso diario 5% · Molinillo 5%.<br />
            <span className="text-xs text-stone-400">
              Variante alta demanda (6+ cafés/día): Presupuesto 32% · Workflow 18% · Espacio 12% · Mantenimiento 10% · Leche 10% · Uso diario 13% · Molinillo 5%. En uso intensivo el rendimiento diario pasa de 5% a 13% porque la capacidad se vuelve criterio primario — el peso se toma de workflow (−2) y espacio (−3), documentado en <code>src/engine/compatibility.ts:253</code>.
            </span>
          </li>
          <li>
            <b className="text-white">Verificación de Datos:</b> Las especificaciones técnicas son auditadas manualmente a partir de las fichas de los fabricantes. No utilizamos contenido generado por IA para la asignación de puntuaciones de hardware.
          </li>
        </ol>
      </div>
    </main>
  );
}
