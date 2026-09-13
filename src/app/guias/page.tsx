import Link from "next/link";
export default function GuiasPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-black">Guías</h1>
      <p className="text-sm text-stone-400 mt-2">Próximamente: 54mm vs 58mm, thermoblock vs caldera, dial-in molienda.</p>
      <ul className="mt-6 space-y-2 text-sm list-disc ml-6">
        <li><Link href="/metodologia" className="text-amber-500 underline">Metodología de scoring</Link></li>
        <li>Guía 54 vs 58mm — en borrador</li>
        <li>Guía sistemas calentamiento — en borrador</li>
      </ul>
    </main>
  );
}
