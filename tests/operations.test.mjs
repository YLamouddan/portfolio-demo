import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcile, purchaseOrders, sampleBills, sampleReceipts, calculateQuote, quoteCatalog, sampleDeals, advanceDeal, forecast } from '../lib/operations.ts';

test('sample matching passes one invoice and holds missing goods, prices, and duplicate copies', () => {
  const rows = reconcile(purchaseOrders, sampleReceipts, sampleBills, 2);
  assert.deepEqual(rows.map(row => row.ready), [true,false,false,false,false]);
  assert.match(rows[1].issues.join(' '), /only 6 received/);
  assert.match(rows[2].issues.join(' '), /4.0%/);
  assert.match(rows[3].issues.join(' '), /Duplicate/);
  assert.match(rows[4].issues.join(' '), /Duplicate/);
});
test('delivery evidence and tolerance changes resolve only their corresponding exceptions', () => {
  const receipts = sampleReceipts.map(row => row.po === 'PO-411' ? {...row,quantity:10} : row);
  const rows = reconcile(purchaseOrders, receipts, sampleBills, 4);
  assert.deepEqual(rows.map(row => row.ready), [true,true,true,false,false]);
});
test('removing a duplicate makes its remaining valid invoice ready', () => {
  const rows = reconcile(purchaseOrders, sampleReceipts, sampleBills.filter(row => row.id !== 'BILL-05'), 2);
  assert.equal(rows.find(row => row.id === 'BILL-04').ready, true);
});
test('distinct invoice numbers cannot bypass cumulative ordered or received quantities', () => {
  const first = {...sampleBills[0], lines:[{...sampleBills[0].lines[0],quantity:12}]};
  const second = {...first,id:'BILL-NEW',number:'NS-NEW'};
  const rows = reconcile(purchaseOrders, sampleReceipts, [first,second], 2);
  assert.ok(rows.every(row => !row.ready));
  assert.match(rows[0].issues.join(' '), /batch bills 24/);
});
test('duplicate detection normalises supplier names and invoice numbers', () => {
  const duplicate = {...sampleBills[0], id:'BILL-NEW', supplier:' northline supply ', number:' ns-101 '};
  assert.ok(reconcile(purchaseOrders, sampleReceipts, [sampleBills[0],duplicate], 2).every(row => row.issues.some(issue => issue.includes('Duplicate'))));
});
test('unknown orders, suppliers and items cannot pass matching', () => {
  for (const patch of [{po:'MISSING'}, {supplier:'Wrong supplier'}, {lines:[{sku:'UNKNOWN',quantity:1,unitPrice:100}]}]) {
    assert.equal(reconcile(purchaseOrders, sampleReceipts, [{...sampleBills[0],...patch}],2)[0].ready,false);
  }
});
test('malformed quantities, duplicate record IDs, and invalid tolerance are rejected', () => {
  assert.throws(() => reconcile(purchaseOrders,sampleReceipts,[sampleBills[0],sampleBills[0]],2));
  assert.throws(() => reconcile(purchaseOrders,sampleReceipts,[{...sampleBills[0],lines:[{sku:'SENSOR-A',quantity:-1,unitPrice:100}]}],2));
  for (const limit of [-1,11,NaN]) assert.throws(() => reconcile(purchaseOrders,sampleReceipts,sampleBills,limit));
});
test('quote discounts use integer cents and trigger review beyond the policy threshold', () => {
  const quote=calculateQuote(quoteCatalog,15);
  assert.equal(quote.subtotal,1170000);
  assert.equal(quote.discountAmount,175500);
  assert.equal(quote.total,994500);
  assert.equal(quote.cost,670000);
  assert.equal(quote.needsApproval,true);
  assert.equal(calculateQuote(quoteCatalog,10).needsApproval,false);
  assert.equal(calculateQuote([{name:'Low margin',quantity:1,unitPrice:10000,unitCost:9000}],0).needsApproval,true);
});
test('quote approval gates advancement and zero-value quotes cannot be proposed', () => {
  assert.throws(() => advanceDeal(sampleDeals[1]), /approve/);
  const proposal=advanceDeal({...sampleDeals[1],approved:true});
  assert.equal(proposal.stage,'Proposal');
  const won=advanceDeal(proposal);
  assert.equal(won.stage,'Won');
  assert.throws(() => advanceDeal(won),/already won/);
  assert.throws(() => advanceDeal({...sampleDeals[1],approved:true,lines:quoteCatalog.map(line => ({...line,quantity:0}))}));
});
test('forecast separates booked business from weighted open pipeline', () => {
  assert.deepEqual(forecast(sampleDeals), {open:2502000, weighted:870750, won:1170000});
});
test('invalid discount and scope values are rejected', () => {
  for (const discount of [-1,26,NaN]) assert.throws(() => calculateQuote(quoteCatalog,discount));
  assert.throws(() => calculateQuote([],0));
  assert.throws(() => calculateQuote([{name:'Invalid',quantity:1.5,unitPrice:10000,unitCost:10}],0));
});
