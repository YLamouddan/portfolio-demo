"use client";
import { useState } from "react";
import { WorkspaceShell, Metric, eur, exactEur, saveCsv } from "@/components/workspace-shell";
import { sampleDeals, quoteCatalog, calculateQuote, advanceDeal, forecast, stageProbability, Deal, Stage } from "@/lib/operations";
import { exportCsv } from "@/lib/business-tools";

export default function Revenue() {
  const [deals, setDeals] = useState<Deal[]>(sampleDeals);
  const [selected, setSelected] = useState("OP-102");
  const [events, setEvents] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const deal = deals.find((item) => item.id === selected)!;
  const quote = calculateQuote(deal.lines, deal.discount);
  const totals = forecast(deals);
  const stages: Stage[] = ["New", "Qualified", "Proposal", "Won"];
  const blocked = quote.total <= 0 || (quote.needsApproval && !deal.approved);
  const log = (message: string) => setEvents((old) => [`${new Date().toLocaleTimeString()} · ${message}`, ...old]);
  function replace(next: Deal) { setDeals(deals.map((item) => item.id === next.id ? next : item)); setError(""); setNotice(""); }
  function changeQuote(next: Deal) {
    if (deal.stage === "Won") return;
    replace({ ...next, approved: false, stage: deal.stage === "Proposal" ? "Qualified" : deal.stage });
    log(`${deal.id}: quote updated; prior approval cleared${deal.stage === "Proposal" ? " and opportunity returned to qualification" : ""}.`);
  }
  function advance() {
    try { const next = advanceDeal(deal); replace(next); log(`${deal.id} moved from ${deal.stage} to ${next.stage}.`); setNotice(`${deal.company} moved to ${next.stage}.`); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to advance opportunity."); }
  }
  function addSample() {
    const email = "cedar@example.com";
    if (deals.some((item) => item.email.toLowerCase() === email)) { setNotice("Duplicate detected: this sample enquiry is already in the pipeline."); return; }
    const next: Deal = { id: "OP-105", company: "Cedar Operations", email, owner: "Solutions", stage: "New", lines: quoteCatalog, discount: 0, approved: false };
    setDeals([...deals, next]); setSelected(next.id); setError(""); setNotice("New sample enquiry added and assigned to Solutions."); log("OP-105 created from sample enquiry; email duplicate check passed.");
  }
  return <WorkspaceShell title="Revenue Desk" description="Keep an enquiry, its quote, and the next decision in one place. Move a sample opportunity from qualification to a won deal.">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"><Metric label="Open pipeline" value={eur(totals.open)} note="Unwon sample opportunities" /><Metric label="Weighted forecast" value={eur(totals.weighted)} note="Scenario based on stage probabilities" /><Metric label="Won business" value={eur(totals.won)} note="Fictional sample value" /><Metric label="Open opportunities" value={deals.filter((item) => item.stage !== "Won").length} note="Across the active pipeline" /></div>
    <div className="ops-toolbar"><h2 className="font-semibold">Opportunity pipeline</h2><div className="flex flex-wrap gap-2"><button className="ops-tab" onClick={() => { setDeals(sampleDeals); setSelected("OP-102"); setEvents([]); setError(""); setNotice("Sample workspace reset."); }}>Reset sample</button><button className="demo-button" onClick={addSample}>+ Add sample enquiry</button></div></div>
    <div role="status" className="text-green-300 text-sm min-h-6 mt-3">{notice}</div>
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">{stages.map((stage) => <section key={stage} className="ops-panel p-3"><div className="flex justify-between text-xs text-gray-400 p-2 mb-2"><h3>{stage}</h3><span>{deals.filter((item) => item.stage === stage).length}</span></div><div className="space-y-2">{deals.filter((item) => item.stage === stage).map((item) => <button key={item.id} onClick={() => { setSelected(item.id); setError(""); setNotice(""); }} aria-pressed={item.id === selected} className={`w-full text-left rounded-lg border p-4 transition-colors ${item.id === selected ? "bg-green-400/10 border-green-400/50" : "bg-white/[.03] border-white/10 hover:border-white/30"}`}><p className="font-medium text-sm">{item.company}</p><p className="text-xl font-semibold mt-3">{eur(calculateQuote(item.lines, item.discount).total)}</p><p className="text-xs text-gray-500 mt-3">{item.owner} · {item.id}</p></button>)}{!deals.some((item) => item.stage === stage) && <p className="text-xs text-gray-600 p-4">No opportunities here.</p>}</div></section>)}</div>
    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5 items-start">
      <section className="ops-panel p-5 sm:p-6" aria-labelledby="quote-title"><div className="flex flex-wrap justify-between gap-4"><div><p className="text-xs text-gray-500 mb-2">{deal.id} / {deal.stage}</p><h2 id="quote-title" className="text-xl font-semibold">{deal.company}</h2></div><span className="text-xs text-green-300">{deal.owner}</span></div>
        <p className="text-sm text-gray-400 mt-5 mb-4">Configure the scope. The quote, margin, and pipeline forecast update together.</p>
        <div className="overflow-x-auto"><table className="ops-table"><caption className="sr-only">Quote editor, prices in EUR before tax</caption><thead><tr><th>Scope</th><th>Quantity</th><th>Unit price</th><th>Total</th></tr></thead><tbody>{deal.lines.map((line, index) => <tr key={line.name}><td>{line.name}</td><td><input aria-label={`${line.name} quantity`} className="w-16 bg-white/5 rounded p-2 border border-white/10 disabled:opacity-50" type="number" min="0" max="100" disabled={deal.stage === "Won"} value={line.quantity} onChange={(e) => changeQuote({ ...deal, lines: deal.lines.map((item, i) => i === index ? { ...item, quantity: Math.max(0, Math.min(100, Math.round(Number(e.target.value) || 0))) } : item) })} /></td><td>{eur(line.unitPrice)}</td><td>{exactEur(line.unitPrice * line.quantity)}</td></tr>)}</tbody></table></div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4"><label className="text-sm text-gray-300 flex items-center gap-3">Discount <input type="range" aria-label="Quote discount" min="0" max="25" step="1" disabled={deal.stage === "Won"} value={deal.discount} className="accent-green-400 disabled:opacity-40" onChange={(e) => changeQuote({ ...deal, discount: Number(e.target.value) })} /><span>{deal.discount}%</span></label><div className="text-right"><p className="text-xs text-gray-500">Quote total · EUR, before tax</p><p className="text-2xl font-semibold mt-1">{exactEur(quote.total)}</p></div></div>
        <div className="flex flex-wrap gap-3 mt-6"><span className="ops-chip">Estimated delivery cost {eur(quote.cost)}</span><span className="ops-chip">Estimated margin {quote.margin.toFixed(1)}%</span></div>
        <button className="demo-secondary mt-6" onClick={() => saveCsv(exportCsv([["company", "scope", "quantity", "unit_price_eur", "line_total_eur"], ...deal.lines.map((line) => [deal.company, line.name, line.quantity, (line.unitPrice / 100).toFixed(2), (line.quantity * line.unitPrice / 100).toFixed(2)]), ["", "Discount", `${deal.discount}%`, "", (-quote.discountAmount / 100).toFixed(2)], ["", "Total before tax", "", "", (quote.total / 100).toFixed(2)]]), `${deal.id}-quote.csv`)}>Export quote ↓</button>
      </section>
      <div className="space-y-5"><section className="ops-panel p-5"><h2 className="font-semibold">Next decision</h2><p className="text-gray-400 text-sm mt-3">{deal.stage === "New" ? "Review the enquiry and qualify the opportunity." : deal.stage === "Qualified" ? "Confirm scope and pricing before preparing the proposal." : deal.stage === "Proposal" ? "Record the customer's acceptance to mark the opportunity won." : "Opportunity won. The quote is locked for delivery handover."}</p>
        <div className={`p-4 rounded-lg my-5 ${quote.needsApproval && !deal.approved ? "bg-amber-400/10" : "bg-green-400/10"}`}><p className={`text-sm font-medium ${quote.needsApproval && !deal.approved ? "text-amber-300" : "text-green-300"}`}>{quote.needsApproval ? deal.approved ? "Quote exception approved in demo" : "Quote requires review" : "Within pricing policy"}</p><p className="text-xs text-gray-400 mt-2">Discounts above 10% or margins below 25% need approval. Prices and costs are illustrative.</p></div>
        {quote.needsApproval && !deal.approved && deal.stage !== "Won" && <button className="demo-secondary mb-3 w-full" disabled={quote.total <= 0} onClick={() => { replace({ ...deal, approved: true }); log(`${deal.id}: pricing exception approved in demo at ${deal.discount}% discount.`); }}>Approve exception in demo</button>}
        {deal.stage !== "Won" && <button className="demo-button w-full disabled:opacity-40 disabled:cursor-not-allowed" disabled={deal.stage !== "New" && blocked} onClick={advance}>{deal.stage === "New" ? "Qualify opportunity" : deal.stage === "Qualified" ? "Prepare proposal" : "Mark as won"}</button>}
        {error && <p role="alert" className="text-red-300 text-sm mt-3">{error}</p>}
      </section><section className="ops-panel p-5"><h2 className="font-semibold">Forecast assumptions</h2><div className="space-y-3 mt-4">{stages.map((stage) => <div key={stage} className="flex justify-between text-sm"><span className="text-gray-400">{stage}</span><span>{Math.round(stageProbability[stage] * 100)}%</span></div>)}</div><p className="text-xs text-gray-500 mt-4">Weighted forecast includes open opportunities only. These probabilities illustrate the model; they are not predictions.</p></section></div>
    </div>
    <section className="ops-panel p-5 mt-5"><h2 className="font-semibold">Activity log</h2><ol className="text-sm text-gray-400 space-y-2 mt-4">{events.length ? events.map((event, i) => <li key={i}>{event}</li>) : <li>Sample pipeline loaded. Select an opportunity to explore its scope and next decision.</li>}</ol></section>
  </WorkspaceShell>;
}
