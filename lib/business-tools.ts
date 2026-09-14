export type Invoice = { customer: string; email: string; invoice: string; amount: number; due_date: string };

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], value = "", quoted = false, closed = false;
  const input = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') { value += '"'; i++; }
      else if (char === '"') { quoted = false; closed = true; }
      else value += char;
    } else if (char === '"') {
      if (value || closed) throw new Error("Unexpected quote in CSV. Put quotes around the whole field.");
      quoted = true;
    } else if (char === ",") {
      row.push(value); value = ""; closed = false;
    } else if (char === "\n" || char === "\r") {
      row.push(value);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = []; value = ""; closed = false;
      if (char === "\r" && input[i + 1] === "\n") i++;
    } else {
      if (closed) throw new Error("Unexpected text after a quoted CSV field.");
      value += char;
    }
  }
  if (quoted) throw new Error("A quoted CSV field is missing its closing quote.");
  row.push(value);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

export function dateDay(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Use dates in YYYY-MM-DD format.");
  const time = Date.parse(value + "T00:00:00Z");
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) throw new Error("Enter a valid calendar date.");
  return time / 86400000;
}

export function parseInvoices(text: string): Invoice[] {
  const [header, ...rows] = parseCsv(text);
  const expected = ["customer", "email", "invoice", "amount", "due_date"];
  if (!header || header.length !== expected.length || expected.some((key, i) => header[i].trim().toLowerCase() !== key)) {
    throw new Error("CSV columns must be: customer,email,invoice,amount,due_date");
  }
  if (!rows.length) throw new Error("Add at least one unpaid invoice, or load the sample data.");
  if (rows.length > 500) throw new Error("This demo supports up to 500 invoices at a time.");
  const seen = new Set<string>();
  return rows.map((row, index) => {
    const line = index + 2;
    if (row.length !== 5) throw new Error(`Row ${line}: expected five fields.`);
    const [customer, email, invoice, amountText, due_date] = row.map((value) => value.trim());
    if (!customer || !invoice || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(`Row ${line}: add a customer, invoice ID, and valid email.`);
    if (!/^\d+(\.\d{1,2})?$/.test(amountText)) throw new Error(`Row ${line}: amount must be positive, with up to two decimal places and no currency symbol.`);
    const amount = Math.round(Number(amountText) * 100);
    if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error(`Row ${line}: enter a positive amount within the supported range.`);
    try { dateDay(due_date); } catch { throw new Error(`Row ${line}: enter a valid due date as YYYY-MM-DD.`); }
    if (seen.has(invoice.toLowerCase())) throw new Error(`Row ${line}: duplicate invoice ID ${invoice}.`);
    seen.add(invoice.toLowerCase());
    return { customer, email, invoice, amount, due_date };
  });
}

export function planInvoices(invoices: Invoice[], asOf: string, currency: string) {
  const today = dateDay(asOf);
  const format = new Intl.NumberFormat("en", { style: "currency", currency });
  return invoices.map((item) => {
    const days = Math.max(0, today - dateDay(item.due_date));
    const stage = days > 30 ? "Personal review" : days > 7 ? "Follow-up" : days > 0 ? "Gentle reminder" : "Not overdue";
    const subject = `Invoice ${item.invoice} — payment follow-up`;
    const message = days > 0 ? `Hello ${item.customer},\n\nI'm following up on invoice ${item.invoice} for ${format.format(item.amount / 100)}, which was due on ${item.due_date}. Could you confirm its payment status? If payment has already been made, please disregard this reminder.\n\nThank you.` : "";
    return { ...item, days, stage, subject, message };
  }).sort((a, b) => b.days - a.days || a.invoice.localeCompare(b.invoice));
}

export function exportCsv(rows: (string | number)[][]): string {
  return rows.map((row) => row.map((cell) => {
    let value = String(cell);
    // Prevent spreadsheet apps from interpreting imported text as a formula.
    if (/^[\s]*[=+@-]/.test(value) || /^[\t\r\n]/.test(value)) value = "'" + value;
    return '"' + value.replace(/"/g, '""') + '"';
  }).join(",")).join("\r\n");
}

export type Lead = { name: string; company: string; email: string; service: "Automation" | "Website" | "Integration"; budget: number; urgent: boolean; message: string };
export function routeLead(lead: Lead, threshold: number) {
  if (!lead.name.trim() || !lead.company.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) throw new Error("Add a name, company, and valid email.");
  if (!Number.isFinite(lead.budget) || lead.budget < 0 || !Number.isFinite(threshold) || threshold < 0) throw new Error("Budget and qualification threshold must be zero or higher.");
  const qualified = lead.budget >= threshold;
  const priority = qualified && lead.urgent ? "High" : qualified ? "Normal" : "Needs scoping";
  const owner = { Automation: "Operations & automation", Website: "Web development", Integration: "Systems integration" }[lead.service];
  if (!owner) throw new Error("Choose a supported service.");
  const nextStep = qualified ? (lead.urgent ? "Review the brief and arrange a discovery call today." : "Review the brief and arrange a discovery call within two working days.") : "Clarify scope and budget before proposing a call.";
  const reason = `Budget ${qualified ? "meets" : "is below"} the qualification threshold.${lead.urgent ? " The enquiry is marked urgent." : " No urgent deadline indicated."}`;
  const reply = `Hi ${lead.name.trim()},\n\nThanks for getting in touch about ${lead.service.toLowerCase()} for ${lead.company.trim()}. Could you share how the process works today, what you would like to improve, and your target timeline?${qualified ? " That will help us prepare for a discovery call." : " We can then work out a scope that fits your budget."}\n\nThank you.`;
  return { priority, owner, nextStep, reason, reply };
}
