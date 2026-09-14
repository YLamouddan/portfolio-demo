"use client";
import { useState } from "react";
import { WorkspaceShell, Metric, eur, exactEur, saveCsv } from "@/components/workspace-shell";
import { purchaseOrders, sampleReceipts, sampleBills, reconcile, Bill, Receipt } from "@/lib/operations";
import { exportCsv } from "@/lib/business-tools";

export default function Purchasing() {
  const [bills, setBills] = useState<Bill[]>(sampleBills);
  const [receipts, setReceipts] = useState<Receipt[]>(sampleReceipts);
  const [tolerance, setTolerance] = useState(2);
  const [selected, setSelected] = useState("BILL-02");
  const [approved, setApproved] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [filter, setFilter] = useState("All");
  const rows = reconcile(purchaseOrders, receipts, bills, tolerance);
  const current = rows.find((row) => row.id === selected) ?? rows[0];
  const ready = rows.filter((row) => row.ready);
  const exceptions = rows.filter((row) => !row.ready);
  const visible = rows.filter((row) => filter === "All" || (filter === "Exceptions" ? !row.ready : row.ready));
  const log = (message: string) => setEvents((old) => [`${new Date().toLocaleTimeString()} · ${message}`, ...old]);
  function change(reason: string) { setApproved([]); log(reason + " Prior approvals cleared for recheck."); }
  function reset() { setBills(sampleBills); setReceipts(sampleReceipts); setTolerance(2); setSelected("BILL-02"); setApproved([]); setEvents([]); setFilter("All"); }
  function approve() {
    if (!current.ready || approved.includes(current.id)) return;
    setApproved([...approved, current.id]); log(`${current.id} / ${current.number} approved in the demo after all matching checks passed.`);
  }
  function updateLine(index: number, field: "quantity" | "unitPrice", amount: number) {
    if (!Number.isFinite(amount)) return;
    const value = Math.max(1, Math.min(field === "quantity" ? 10000 : 10000000, Math.round(amount)));
    setBills(bills.map((bill) => bill.id !== current.id ? bill : { ...bill, lines: bill.lines.map((line, i) => i === index ? { ...line, [field]: value } : line) }));
    change(`${current.id}: ${field} updated.`);
  }
  return <WorkspaceShell title="Purchasing Control" description="Check what was ordered, what arrived, and what was billed. Resolve the differences before approving an invoice.">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"><Metric label="Invoices checked" value={rows.length} note="Current sample batch" /><Metric label="Ready for approval" value={ready.length} note="All matching checks passed" /><Metric label="Needs attention" value={exceptions.length} note="Held for review" /><Metric label="Approved value" value={eur(rows.filter((row) => approved.includes(row.id)).reduce((sum, row) => sum + row.total, 0))} note="Simulated approvals only" /></div>
    <div className="ops-toolbar"><div className="flex flex-wrap gap-2" aria-label="Invoice filters">{["All", "Exceptions", "Ready"].map((item) => <button key={item} aria-pressed={filter === item} className={filter === item ? "ops-tab active" : "ops-tab"} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="flex flex-wrap gap-2"><button className="ops-tab" onClick={reset}>Reset sample</button><button className="ops-tab" onClick={() => saveCsv(exportCsv([["record_id", "invoice", "supplier", "amount_eur", "status", "exceptions"], ...rows.map((row) => [row.id, row.number, row.supplier, (row.total / 100).toFixed(2), approved.includes(row.id) ? "Approved in demo" : row.ready ? "Ready" : "Held", row.issues.join("; ")])]), "purchasing-review.csv")}>Export review ↓</button></div></div>
    <div className="grid lg:grid-cols-[.9fr_1.4fr] gap-5 mt-5 items-start">
      <section className="ops-panel overflow-hidden" aria-label="Supplier invoices"><div className="p-5 border-b border-white/10 flex justify-between gap-2"><h2 className="font-semibold">Review queue</h2><span className="text-xs text-gray-500">{visible.length} records</span></div>
        {visible.length === 0 && <p className="p-5 text-gray-400">No invoices in this view.</p>}
        {visible.map((row) => <button key={row.id} onClick={() => setSelected(row.id)} aria-pressed={current.id === row.id} className={`w-full text-left p-5 border-b border-white/5 transition-colors ${current.id === row.id ? "bg-green-400/10 border-l-2 border-l-green-400" : "hover:bg-white/5"}`}><div className="flex justify-between gap-3"><span className="font-medium">{row.supplier}</span><span>{eur(row.total)}</span></div><div className="flex justify-between gap-3 mt-2 text-xs"><span className="text-gray-500">{row.number} · {row.id}</span><span className={row.ready ? "text-green-300" : "text-amber-300"}>{approved.includes(row.id) ? "Approved" : row.ready ? "Ready" : "On hold"}</span></div></button>)}
      </section>
      <section className="ops-panel p-5 sm:p-6" aria-labelledby="match-title"><div className="flex flex-wrap justify-between gap-4"><div><p className="text-xs text-gray-500 mb-2">{current.id} / {current.po}</p><h2 id="match-title" className="text-xl font-semibold">{current.supplier}</h2></div><span className="text-xl font-semibold">{exactEur(current.total)}</span></div>
        <div className="grid grid-cols-3 gap-2 mt-6 mb-6">{["Purchase order", "Goods received", "Supplier invoice"].map((step, i) => <div key={step} className="rounded-lg bg-white/5 p-3"><span className="text-green-400 text-xs">0{i + 1}</span><p className="text-xs mt-2">{step}</p></div>)}</div>
        <div className="overflow-x-auto"><table className="ops-table"><caption className="sr-only">Line-by-line matching evidence</caption><thead><tr><th>Item</th><th>Ordered</th><th>Received</th><th>Batch billed</th></tr></thead><tbody>{current.lines.map((line, index) => <tr key={`${line.sku}-${index}`}><td>{line.sku}</td><td>{line.ordered}</td><td>{line.received}</td><td className={line.batchQuantity > line.received ? "text-amber-300" : "text-green-300"}>{line.batchQuantity}</td></tr>)}</tbody></table></div>
        <label className="flex flex-wrap gap-3 items-center text-sm mt-6">Allowed price difference <input aria-label="Allowed price difference" type="range" min="0" max="10" step="1" value={tolerance} className="accent-green-400" onChange={(e) => { setTolerance(Number(e.target.value)); change(`Price tolerance changed to ${e.target.value}%.`); }} /><span className="text-green-300">{tolerance}%</span></label>
        <div role="status" className={`mt-5 rounded-xl p-4 ${current.ready ? "bg-green-400/10" : "bg-amber-400/10"}`}><p className={current.ready ? "text-green-300 font-medium" : "text-amber-300 font-medium"}>{current.ready ? "Ready for approval" : "Approval blocked"}</p>{current.issues.length > 0 ? <ul className="mt-3 space-y-2 text-sm text-gray-300">{current.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul> : <p className="text-sm text-gray-400 mt-2">Supplier, quantities, delivery, price, and duplicate checks passed.</p>}</div>
        <div className="flex flex-wrap gap-3 mt-5"><button className="demo-button disabled:opacity-40 disabled:cursor-not-allowed" disabled={!current.ready || approved.includes(current.id)} onClick={approve}>{approved.includes(current.id) ? "Approved in demo" : "Approve in demo"}</button>
          {current.po === "PO-411" && receipts.find((row) => row.po === "PO-411")?.quantity === 6 && <button className="demo-secondary" onClick={() => { setReceipts(receipts.map((row) => row.po === "PO-411" ? { ...row, quantity: 10 } : row)); change("Remaining delivery recorded for PO-411."); }}>Record remaining delivery</button>}
          {current.number === "NS-404" && bills.some((row) => row.id === "BILL-05") && <button className="demo-secondary" onClick={() => { setBills(bills.filter((row) => row.id !== "BILL-05")); setSelected("BILL-04"); change("Duplicate BILL-05 removed from the sample batch."); }}>Resolve duplicate copy</button>}
        </div>
        <details className="mt-6 text-sm"><summary className="cursor-pointer text-gray-400">Edit invoice lines</summary><p className="my-3 text-gray-500">Change the billed quantity or unit price to test the matching rules.</p>{current.lines.map((line, index) => <div key={`${line.sku}-${index}`} className="grid grid-cols-2 gap-4 my-4"><label>{line.sku} quantity<input aria-label={`${line.sku} billed quantity`} className="demo-input mt-2" type="number" min="1" max="10000" value={line.quantity} onChange={(e) => updateLine(index, "quantity", Number(e.target.value))} /></label><label>Unit price (EUR)<input aria-label={`${line.sku} unit price EUR`} className="demo-input mt-2" type="number" min="0.01" step="0.01" value={line.unitPrice / 100} onChange={(e) => updateLine(index, "unitPrice", Number(e.target.value) * 100)} /><span className="text-xs text-gray-500">PO price: {exactEur(line.expectedPrice)}</span></label></div>)}</details>
      </section>
    </div>
    <section className="ops-panel p-5 mt-5"><h2 className="font-semibold">Activity log</h2><p className="text-xs text-gray-500 mt-2">Session-only record of rule changes, resolutions, and simulated approvals.</p><ol className="mt-4 text-sm text-gray-400 space-y-2">{events.length ? events.map((event, i) => <li key={i}>{event}</li>) : <li>Sample batch loaded. Select a held invoice to start resolving it.</li>}</ol></section>
  </WorkspaceShell>;
}
