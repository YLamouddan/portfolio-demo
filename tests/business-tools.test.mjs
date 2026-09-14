import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, parseInvoices, dateDay, planInvoices, exportCsv, routeLead } from '../lib/business-tools.ts';

const header = 'customer,email,invoice,amount,due_date';
test('CSV supports quoted commas, escaped quotes, CRLF, BOM, and embedded newlines', () => {
  assert.deepEqual(parseCsv('\uFEFFname,note\r\n"Sample, Ltd","A ""quote""\nand another line"\r\n'), [['name','note'],['Sample, Ltd','A "quote"\nand another line']]);
});
test('CSV rejects broken quoting rather than silently changing data', () => {
  for (const text of ['"unclosed', 'a"b,c', '"a"b,c']) assert.throws(() => parseCsv(text));
});
test('invoice import validates dates, duplicate IDs, amounts, email, and headers', () => {
  const valid = `${header}\nSample,a@example.com,INV-1,10.25,2026-09-01`;
  assert.equal(parseInvoices(valid)[0].amount, 1025);
  for (const invalid of [valid.replace('2026-09-01', '2026-02-30'), valid.replace('10.25', '-1'), valid.replace('10.25', '1.005'), valid.replace('a@example.com', 'invalid'), valid.replace('customer', 'client'), valid + '\nOther,b@example.com,inv-1,20.00,2026-09-01']) assert.throws(() => parseInvoices(invalid));
});
test('calendar arithmetic is independent of DST and rejects rolled-over dates', () => {
  assert.equal(dateDay('2026-03-30') - dateDay('2026-03-28'), 2);
  assert.equal(dateDay('2024-03-01') - dateDay('2024-02-28'), 2);
  assert.throws(() => dateDay('2026-02-29'));
});
test('invoice ageing boundaries, ordering, and draft eligibility are correct', () => {
  const invoices = [0,1,7,8,30,31,-1].map((days) => ({ customer: 'Sample', email: 'sample@example.com', invoice: `I${days}`, amount: 10025, due_date: new Date((dateDay('2026-09-14') - days) * 86400000).toISOString().slice(0,10) }));
  const result = planInvoices(invoices, '2026-09-14', 'EUR');
  assert.deepEqual(result.map((row) => row.days), [31,30,8,7,1,0,0]);
  assert.deepEqual(result.slice(0,5).map((row) => row.stage), ['Personal review','Follow-up','Follow-up','Gentle reminder','Gentle reminder']);
  assert.ok(result.slice(-2).every((row) => row.message === '' && row.stage === 'Not overdue'));
  assert.match(result[0].message, /100\.25/);
});
test('CSV export preserves multiline drafts and neutralises spreadsheet formulas', () => {
  const parsed = parseCsv(exportCsv([['=1+1', ' +SUM(A1)', '@command', '-1', 'normal, text', 'line\n"two"']]));
  assert.deepEqual(parsed[0], ["'=1+1", "' +SUM(A1)", "'@command", "'-1", 'normal, text', 'line\n"two"']);
});
const lead = { name: 'Alex Demo', company: 'Sample', email: 'alex@example.com', service: 'Automation', budget: 1500, urgent: true, message: 'Intake automation' };
test('routing handles threshold equality, low budgets, urgency, and team mapping', () => {
  assert.equal(routeLead(lead, 1500).priority, 'High');
  assert.equal(routeLead({...lead, urgent: false}, 1500).priority, 'Normal');
  assert.equal(routeLead({...lead, budget: 1499}, 1500).priority, 'Needs scoping');
  assert.equal(routeLead({...lead, service: 'Website'}, 1500).owner, 'Web development');
  assert.equal(routeLead({...lead, service: 'Integration'}, 1500).owner, 'Systems integration');
  assert.match(routeLead(lead, 1500).reply, /Sample/);
});
test('routing rejects missing identity, malformed email, invalid service, and invalid budgets', () => {
  for (const patch of [{name:' '}, {company:''}, {email:'bad'}, {budget:-1}, {budget:NaN}, {service:'Other'}]) assert.throws(() => routeLead({...lead,...patch}, 1500));
  assert.throws(() => routeLead(lead, NaN));
});
