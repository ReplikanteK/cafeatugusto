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
            <b className="text-white">Scoring Ponderado (0–100):</b> Ponderación algorítmica dividida en: Presupuesto (40%), Curva de Aprendizaje y Workflow (25%), Espacio en encimera (15%), Facilidad de Limpieza (10%) y Capacidad de Emulsión de Leche (10%).
          </li>
          <li>
            <b className="text-white">Verificación de Datos:</b> Las especificaciones técnicas son auditadas manualmente a partir de las fichas de los fabricantes. No utilizamos contenido generado por IA para la asignación de puntuaciones de hardware.
          </li>
        </ol>
      </div>
    </main>
  );
}
