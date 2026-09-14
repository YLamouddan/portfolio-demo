"use client";

import { useState } from "react";
import DemoShell from "@/components/demo-shell";
import { exportCsv, Lead, routeLead } from "@/lib/business-tools";

const empty: Lead = { name: "", company: "", email: "", service: "Automation", budget: 0, urgent: false, message: "" };
const sample: Lead = { name: "Alex Demo", company: "Sample Services", email: "alex@example.com", service: "Automation", budget: 3500, urgent: true, message: "We copy enquiries from a shared inbox into a spreadsheet, then assign them manually. We'd like one intake process and a clear owner for each enquiry." };

export default function LeadRouter() {
  const [lead, setLead] = useState<Lead>(empty);
  const [threshold, setThreshold] = useState(1500);
  const [result, setResult] = useState<ReturnType<typeof routeLead> | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  function update<K extends keyof Lead>(key: K, value: Lead[K]) { setLead({ ...lead, [key]: value }); setResult(null); setError(""); setNotice(""); }
  function run(event: React.FormEvent) {
    event.preventDefault(); setError(""); setNotice(""); setResult(null);
    try { setResult(routeLead(lead, threshold)); } catch (err) { setError(err instanceof Error ? err.message : "Check the enquiry details."); }
  }
  function download() {
    if (!result) return;
    const data = exportCsv([["name", "company", "email", "service", "budget_eur", "urgent", "brief", "priority", "owner", "next_step", "reply_draft"], [lead.name, lead.company, lead.email, lead.service, lead.budget, lead.urgent ? "yes" : "no", lead.message, result.priority, result.owner, result.nextStep, result.reply]]);
    const url = URL.createObjectURL(new Blob([data], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "routed-enquiry.csv"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <DemoShell title="Lead intake & routing" intro="Turn a business enquiry into an assigned next action. Change the budget threshold, service, or urgency to see how clear rules can reduce manual sorting.">
    <button type="button" className="demo-button mb-6" onClick={() => { setLead(sample); setThreshold(1500); setResult(routeLead(sample, 1500)); setError(""); setNotice("Loaded and routed a fictional enquiry."); }}>Load sample & run</button>
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <form className="demo-panel space-y-5" onSubmit={run}>
        <h2 className="text-xl font-semibold">Incoming enquiry</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label>Name<input className="demo-input mt-2" required maxLength={100} value={lead.name} onChange={(e) => update("name", e.target.value)} /></label>
          <label>Company<input className="demo-input mt-2" required maxLength={150} value={lead.company} onChange={(e) => update("company", e.target.value)} /></label>
        </div>
        <label className="block">Email<input className="demo-input mt-2" type="email" required maxLength={254} value={lead.email} onChange={(e) => update("email", e.target.value)} /></label>
        <label className="block">Service<select className="demo-input mt-2" value={lead.service} onChange={(e) => update("service", e.target.value as Lead["service"])}><option>Automation</option><option>Website</option><option>Integration</option></select></label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label>Estimated budget (EUR)<input className="demo-input mt-2" type="number" min={0} max={100000000} step="0.01" required value={Number.isNaN(lead.budget) ? "" : lead.budget} onChange={(e) => update("budget", e.target.value === "" ? NaN : Number(e.target.value))} /></label>
          <label>Qualification threshold (EUR)<input className="demo-input mt-2" type="number" min={0} max={100000000} step="0.01" required value={Number.isNaN(threshold) ? "" : threshold} onChange={(e) => { setThreshold(e.target.value === "" ? NaN : Number(e.target.value)); setResult(null); setError(""); setNotice(""); }} /></label>
        </div>
        <label className="flex gap-3 items-center"><input type="checkbox" className="h-5 w-5 accent-green-500" checked={lead.urgent} onChange={(e) => update("urgent", e.target.checked)} />Urgent enquiry</label>
        <label className="block">Business need<textarea className="demo-input mt-2 min-h-28" maxLength={3000} value={lead.message} onChange={(e) => update("message", e.target.value)} /></label>
        <p className="text-sm text-gray-400">Routing uses the service, budget, and urgency fields. The written brief is preserved for the team to review.</p>
        <button className="demo-button" type="submit">Qualify & route enquiry</button>
        {error && <p role="alert" className="text-red-300">{error}</p>}
      </form>
      <section className="demo-panel" aria-labelledby="routing-heading">
        <h2 id="routing-heading" className="text-xl font-semibold">Routing result</h2>
        <p role="status" className="mt-3 text-green-300">{notice || (result ? "Enquiry routed. Review the next action and draft below." : "Load the sample or submit an enquiry to see its route.")}</p>
        {result ? <div className="mt-5 space-y-5">
          <dl className="space-y-4"><div><dt className="text-sm text-gray-400">Priority</dt><dd className="text-2xl font-semibold text-green-400">{result.priority}</dd></div><div><dt className="text-sm text-gray-400">Responsible team</dt><dd className="text-lg">{result.owner}</dd></div><div><dt className="text-sm text-gray-400">Next action</dt><dd>{result.nextStep}</dd></div></dl>
          <p className="text-sm text-gray-400">Why: {result.reason}</p>
          <div className="border-t border-white/10 pt-5"><h3 className="font-semibold">Reply draft</h3><pre className="font-sans whitespace-pre-wrap leading-relaxed text-gray-300 mt-3">{result.reply}</pre></div>
          <button type="button" className="demo-secondary" onClick={download}>Export enquiry & draft</button>
        </div> : <p className="mt-5 text-gray-400 leading-relaxed">Qualified and urgent enquiries receive high priority. Qualified enquiries receive normal priority. Enquiries below your threshold need scoping first. The chosen service determines the responsible team.</p>}
      </section>
    </div>
    <aside className="mt-10 text-gray-400 text-sm leading-relaxed max-w-3xl"><h2 className="text-lg text-white mb-2">Where this fits in a business</h2><p>This prototype automates qualification rules, team assignment, next actions, and reply preparation. Its CSV can be mapped into a CRM. A production workflow could receive enquiries through a form webhook, create CRM records, and notify the assigned team. This demo keeps those steps manual.</p></aside>
  </DemoShell>;
}
