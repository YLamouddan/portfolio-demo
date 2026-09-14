import Link from "next/link";

export function WorkspaceShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <main className="demo-page min-h-screen bg-[#080b10] px-4 py-7 text-white sm:px-8"><div className="max-w-7xl mx-auto">
    <Link href="/#projects" className="text-sm text-green-400">← Yassir Lamouddan / Projects</Link>
    <header className="flex flex-wrap items-end justify-between gap-5 my-8"><div><p className="text-xs uppercase tracking-[.2em] text-gray-400 mb-3">Interactive project</p><h1 className="text-3xl sm:text-4xl font-semibold">{title}</h1><p className="text-gray-400 mt-3 max-w-2xl">{description}</p></div><span className="rounded-full border border-green-400/25 px-3 py-1.5 text-xs text-green-300">Sample workspace</span></header>
    {children}
    <p className="text-xs text-gray-500 mt-8 mb-4">Independent prototype with fictional data. Changes stay in this session; approvals and exports do not update external systems.</p>
  </div></main>;
}
export function Metric({ label, value, note }: { label: string; value: string | number; note: string }) {
  return <div className="ops-metric"><p className="text-xs text-gray-400">{label}</p><p className="text-2xl sm:text-3xl font-semibold my-2">{value}</p><p className="text-xs text-gray-500">{note}</p></div>;
}
export function saveCsv(csv: string, name: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const eur = (cents: number) => new Intl.NumberFormat("en", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100);
export const exactEur = (cents: number) => new Intl.NumberFormat("en", { style: "currency", currency: "EUR" }).format(cents / 100);
