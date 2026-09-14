"use client";

import { useState } from "react";
import DemoShell from "@/components/demo-shell";
import { dateDay, exportCsv, parseInvoices, planInvoices } from "@/lib/business-tools";

const header = "customer,email,invoice,amount,due_date";
function download(text: string, name: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function InvoicePlanner() {
  const [csv, setCsv] = useState(header + "\n");
  const [asOf, setAsOf] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [result, setResult] = useState<ReturnType<typeof planInvoices> | null>(null);
  const [resultCurrency, setResultCurrency] = useState("EUR");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const overdue = result?.filter((invoice) => invoice.days > 0) ?? [];
  const money = (cents: number) => new Intl.NumberFormat("en", { style: "currency", currency: resultCurrency }).format(cents / 100);
  const resetResult = () => { setResult(null); setError(""); setNotice(""); };

  function sample() {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const date = (offset: number) => new Date((dateDay(today) + offset) * 86400000).toISOString().slice(0, 10);
    const value = `${header}\nSample Studio,accounts@example.com,DEMO-101,1250.00,${date(-4)}\nSample Workshop,billing@example.com,DEMO-102,680.50,${date(-18)}\nSample Services,finance@example.com,DEMO-103,2400.00,${date(-38)}\nSample Shop,shop@example.com,DEMO-104,350.00,${date(7)}`;
    setCsv(value); setAsOf(today); setCurrency("EUR"); setError("");
    setResult(planInvoices(parseInvoices(value), today, "EUR")); setResultCurrency("EUR"); setNotice("Loaded four fictional invoices. All amounts are in EUR.");
  }

  function analyse(event: React.FormEvent) {
    event.preventDefault(); setError(""); setNotice(""); setResult(null);
    try { setResult(planInvoices(parseInvoices(csv), asOf, currency)); setResultCurrency(currency); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to read these invoices."); }
  }

  return <DemoShell title="Invoice follow-up planner" intro="Turn a spreadsheet of unpaid invoices into a prioritised follow-up list. Load the fictional dataset to see the workflow, or paste a CSV of your own.">
    <div className="flex flex-wrap gap-3 mb-6">
      <button type="button" className="demo-button" onClick={sample}>Load sample & run</button>
      <button type="button" className="demo-secondary" onClick={() => download(header + "\nSample Customer,accounts@example.com,DEMO-001,100.00,2026-01-15\n", "invoice-template.csv")}>Download CSV template</button>
    </div>
    <form onSubmit={analyse} className="demo-panel space-y-5">
      <label className="block">Unpaid invoices CSV<textarea className="demo-input mt-2 font-mono text-sm min-h-48" value={csv} onChange={(e) => { setCsv(e.target.value); resetResult(); }} spellCheck={false} maxLength={200000} aria-describedby="csv-help" /></label>
      <p id="csv-help" className="text-sm text-gray-400">Columns: customer, email, invoice, amount, due_date. Use one currency per import, YYYY-MM-DD dates, and amounts such as 1250.00. Only include unpaid invoices. Limit: 500 rows.</p>
      <div className="grid sm:grid-cols-2 gap-5">
        <label>Review date<input className="demo-input mt-2" type="date" required value={asOf} onChange={(e) => { setAsOf(e.target.value); resetResult(); }} /></label>
        <label>Invoice currency<select className="demo-input mt-2" value={currency} onChange={(e) => { setCurrency(e.target.value); resetResult(); }}><option>EUR</option><option>PLN</option><option>USD</option><option>GBP</option><option>SAR</option></select></label>
      </div>
      <button className="demo-button" type="submit">Create follow-up plan</button>
      {error && <p role="alert" className="text-red-300">{error}</p>}
    </form>
    <p role="status" className="mt-4 text-green-300">{notice}</p>
    {result && <section className="mt-8" aria-labelledby="results-heading">
      <h2 id="results-heading" className="text-2xl font-bold">Your follow-up plan</h2>
      <p role="status" className="mt-3 text-gray-300">{overdue.length} overdue of {result.length} invoices · {money(overdue.reduce((sum, row) => sum + row.amount, 0))} overdue</p>
      <p className="mt-3 text-sm text-gray-400">Rules: 1–7 days → gentle reminder; 8–30 → follow-up; 31+ → personal review. Due today or later → no reminder.</p>
      <div className="mt-5 mb-6"><button className="demo-secondary" type="button" onClick={() => download(exportCsv([["invoice", "customer", "email", "amount", "currency", "days_overdue", "next_action", "subject", "draft"], ...result.map((row) => [row.invoice, row.customer, row.email, (row.amount / 100).toFixed(2), resultCurrency, row.days, row.stage, row.days > 0 ? row.subject : "", row.message])]), "invoice-follow-up-plan.csv")}>Export plan & drafts</button></div>
      <div className="space-y-4">{result.map((row) => <article key={row.invoice} className="demo-panel">
        <div className="flex flex-wrap justify-between gap-4"><div><h3 className="text-lg font-semibold">{row.invoice} · {row.customer}</h3><p className="mt-1 text-gray-400">{money(row.amount)} · Due {row.due_date} · {row.days} days overdue</p></div><span className="text-green-300">{row.stage}</span></div>
        {row.days > 0 && <details className="mt-4"><summary className="cursor-pointer text-green-400">Review message draft</summary><p className="mt-4 text-sm text-gray-400">To: {row.email}</p><p className="mt-2 font-semibold">{row.subject}</p><pre className="mt-3 whitespace-pre-wrap font-sans text-gray-300 leading-relaxed">{row.message}</pre></details>}
      </article>)}</div>
    </section>}
    <aside className="mt-10 mb-5 text-gray-400 text-sm leading-relaxed max-w-3xl"><h2 className="text-lg text-white mb-2">Where this fits in a business</h2><p>This prototype automates CSV validation, ageing calculations, prioritisation, and first-draft preparation. A production integration could fetch unpaid invoices from an accounting system and send reviewed drafts through a mail service. Those external connections are not part of this demo.</p></aside>
  </DemoShell>;
}
