export type OrderLine = { sku: string; quantity: number; unitPrice: number };
export type PurchaseOrder = { id: string; supplier: string; lines: OrderLine[] };
export type Receipt = { po: string; sku: string; quantity: number };
export type Bill = { id: string; number: string; supplier: string; po: string; lines: OrderLine[] };

export const purchaseOrders: PurchaseOrder[] = [
  { id: "PO-410", supplier: "Northline Supply", lines: [{ sku: "SENSOR-A", quantity: 20, unitPrice: 12000 }] },
  { id: "PO-411", supplier: "Meridian Parts", lines: [{ sku: "VALVE-B", quantity: 10, unitPrice: 8500 }] },
  { id: "PO-412", supplier: "Vertex Systems", lines: [{ sku: "PANEL-C", quantity: 4, unitPrice: 25000 }] },
  { id: "PO-413", supplier: "Northline Supply", lines: [{ sku: "DRIVE-D", quantity: 2, unitPrice: 50000 }] },
];
export const sampleReceipts: Receipt[] = purchaseOrders.map((order) => ({ po: order.id, sku: order.lines[0].sku, quantity: order.id === "PO-411" ? 6 : order.lines[0].quantity }));
export const sampleBills: Bill[] = [
  { id: "BILL-01", number: "NS-101", supplier: "Northline Supply", po: "PO-410", lines: [{ sku: "SENSOR-A", quantity: 20, unitPrice: 12000 }] },
  { id: "BILL-02", number: "MP-202", supplier: "Meridian Parts", po: "PO-411", lines: [{ sku: "VALVE-B", quantity: 10, unitPrice: 8500 }] },
  { id: "BILL-03", number: "VS-303", supplier: "Vertex Systems", po: "PO-412", lines: [{ sku: "PANEL-C", quantity: 4, unitPrice: 26000 }] },
  { id: "BILL-04", number: "NS-404", supplier: "Northline Supply", po: "PO-413", lines: [{ sku: "DRIVE-D", quantity: 2, unitPrice: 50000 }] },
  { id: "BILL-05", number: "NS-404", supplier: "Northline Supply", po: "PO-413", lines: [{ sku: "DRIVE-D", quantity: 2, unitPrice: 50000 }] },
];

const key = (value: string) => value.trim().toLowerCase();
const quantityValid = (value: number) => Number.isSafeInteger(value) && value > 0 && value <= 1000000;
const priceValid = (value: number) => Number.isSafeInteger(value) && value > 0 && value <= 100000000;

export function reconcile(orders: PurchaseOrder[], receipts: Receipt[], bills: Bill[], tolerance: number) {
  if (!Number.isFinite(tolerance) || tolerance < 0 || tolerance > 10) throw new Error("Price tolerance must be between 0% and 10%.");
  const ids = new Set<string>();
  for (const order of orders) {
    if (!order.id.trim() || !order.supplier.trim() || ids.has(key(order.id))) throw new Error("Purchase orders require unique IDs and a supplier.");
    ids.add(key(order.id));
    const skus = new Set<string>();
    for (const line of order.lines) {
      if (!line.sku.trim() || skus.has(key(line.sku)) || !quantityValid(line.quantity) || !priceValid(line.unitPrice)) throw new Error("Invalid or duplicate purchase-order line.");
      skus.add(key(line.sku));
    }
  }
  for (const receipt of receipts) {
    const order = orders.find((item) => key(item.id) === key(receipt.po));
    if (!order?.lines.some((line) => key(line.sku) === key(receipt.sku)) || !quantityValid(receipt.quantity)) throw new Error("Receipt must reference an ordered item and positive quantity.");
  }
  const billIds = new Set<string>();
  for (const bill of bills) {
    if (!bill.id.trim() || billIds.has(key(bill.id)) || !bill.number.trim() || !bill.supplier.trim() || !bill.lines.length) throw new Error("Invoices require unique record IDs, an invoice number, supplier, and lines.");
    billIds.add(key(bill.id));
    if (bill.lines.some((line) => !line.sku.trim() || !quantityValid(line.quantity) || !priceValid(line.unitPrice))) throw new Error("Invalid invoice quantity or price.");
  }
  return bills.map((bill) => {
    const issues: string[] = [];
    const duplicate = bills.filter((other) => key(other.supplier) === key(bill.supplier) && key(other.number) === key(bill.number)).length > 1;
    if (duplicate) issues.push("Duplicate supplier invoice number. Review both copies.");
    const order = orders.find((item) => key(item.id) === key(bill.po));
    if (!order) issues.push("Purchase order not found.");
    else if (key(order.supplier) !== key(bill.supplier)) issues.push("Supplier does not match the purchase order.");
    const lines = bill.lines.map((line) => {
      const match = order?.lines.find((item) => key(item.sku) === key(line.sku));
      const received = receipts.filter((item) => key(item.po) === key(bill.po) && key(item.sku) === key(line.sku)).reduce((sum, item) => sum + item.quantity, 0);
      // Conservatively hold all competing invoices when the batch overbills an item.
      const batchQuantity = bills.filter((item) => key(item.po) === key(bill.po)).flatMap((item) => item.lines).filter((item) => key(item.sku) === key(line.sku)).reduce((sum, item) => sum + item.quantity, 0);
      const variance = match ? (line.unitPrice - match.unitPrice) / match.unitPrice * 100 : 0;
      if (!match) issues.push(`${line.sku}: item is not on the purchase order.`);
      else {
        if (batchQuantity > match.quantity) issues.push(`${line.sku}: batch bills ${batchQuantity}; only ${match.quantity} ordered.`);
        if (batchQuantity > received) issues.push(`${line.sku}: batch bills ${batchQuantity}; only ${received} received.`);
        if (Math.abs(variance) > tolerance + 1e-8) issues.push(`${line.sku}: unit price differs by ${variance.toFixed(1)}% (limit ${tolerance}%).`);
      }
      return { ...line, ordered: match?.quantity ?? 0, received, batchQuantity, expectedPrice: match?.unitPrice ?? 0, variance };
    });
    return { ...bill, lines, issues: Array.from(new Set(issues)), total: bill.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0), ready: issues.length === 0 };
  });
}

export type QuoteLine = { name: string; quantity: number; unitPrice: number; unitCost: number };
export type Stage = "New" | "Qualified" | "Proposal" | "Won";
export type Deal = { id: string; company: string; email: string; owner: string; stage: Stage; lines: QuoteLine[]; discount: number; approved: boolean };
export const quoteCatalog: QuoteLine[] = [
  { name: "Process discovery", quantity: 1, unitPrice: 150000, unitCost: 90000 },
  { name: "System integration", quantity: 1, unitPrice: 420000, unitCost: 240000 },
  { name: "Approval workflow", quantity: 2, unitPrice: 180000, unitCost: 100000 },
  { name: "Reporting workspace", quantity: 1, unitPrice: 240000, unitCost: 140000 },
];
export const sampleDeals: Deal[] = [
  { id: "OP-101", company: "Atlas Services", email: "atlas@example.com", owner: "Solutions", stage: "New", lines: quoteCatalog, discount: 0, approved: false },
  { id: "OP-102", company: "Harbour Logistics", email: "harbour@example.com", owner: "Integrations", stage: "Qualified", lines: quoteCatalog.slice(0, 3), discount: 15, approved: false },
  { id: "OP-103", company: "Juniper Group", email: "juniper@example.com", owner: "Solutions", stage: "Proposal", lines: quoteCatalog.slice(0, 2), discount: 5, approved: false },
  { id: "OP-104", company: "Foundry Studio", email: "foundry@example.com", owner: "Delivery", stage: "Won", lines: quoteCatalog, discount: 0, approved: false },
];
export const stageProbability: Record<Stage, number> = { New: 0.15, Qualified: 0.4, Proposal: 0.7, Won: 1 };
export function calculateQuote(lines: QuoteLine[], discount: number) {
  if (!lines.length || !Number.isFinite(discount) || discount < 0 || discount > 25) throw new Error("Use a discount between 0% and 25% and at least one quote line.");
  if (lines.some((line) => !line.name.trim() || !Number.isSafeInteger(line.quantity) || line.quantity < 0 || line.quantity > 100 || !priceValid(line.unitPrice) || !Number.isSafeInteger(line.unitCost) || line.unitCost < 0 || line.unitCost > 100000000)) throw new Error("Invalid quote line.");
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const cost = lines.reduce((sum, line) => sum + line.unitCost * line.quantity, 0);
  const discountAmount = Math.round(subtotal * discount / 100);
  const total = subtotal - discountAmount;
  const margin = total ? (total - cost) / total * 100 : 0;
  return { subtotal, discountAmount, total, cost, margin, needsApproval: discount > 10 || margin < 25 };
}
export function advanceDeal(deal: Deal): Deal {
  const quote = calculateQuote(deal.lines, deal.discount);
  if (deal.stage === "Won") throw new Error("This opportunity is already won.");
  if (deal.stage !== "New" && (quote.total <= 0 || (quote.needsApproval && !deal.approved))) throw new Error("Review and approve the quote before advancing this opportunity.");
  const next: Record<Exclude<Stage, "Won">, Stage> = { New: "Qualified", Qualified: "Proposal", Proposal: "Won" };
  return { ...deal, stage: next[deal.stage] };
}
export function forecast(deals: Deal[]) {
  const rows = deals.map((deal) => ({ ...deal, amount: calculateQuote(deal.lines, deal.discount).total }));
  return {
    open: rows.filter((row) => row.stage !== "Won").reduce((sum, row) => sum + row.amount, 0),
    weighted: rows.filter((row) => row.stage !== "Won").reduce((sum, row) => sum + Math.round(row.amount * stageProbability[row.stage]), 0),
    won: rows.filter((row) => row.stage === "Won").reduce((sum, row) => sum + row.amount, 0),
  };
}
