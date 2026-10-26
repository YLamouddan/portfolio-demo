import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateClientQuote,availableSlots,reserveSlot,sampleBookings,sampleDeliverables,reviewDeliverable,draftSupportReply} from '../lib/client-tools.ts';
test('quote prices are exact cents, unique and refuse invalid discounts',()=>{
 const q=calculateClientQuote(['website','website','copy'],10);
 assert.equal(q.subtotal,150000);assert.equal(q.total,135000);assert.equal(q.deposit,40500);
 assert.equal(calculateClientQuote([],0).valid,false);
 for(const discount of [-1,21,NaN,1.5])assert.throws(()=>calculateClientQuote(['website'],discount));
 assert.throws(()=>calculateClientQuote(['unknown'],0));
});
test('booking availability respects overlap boundaries and duration',()=>{
 const slots=availableSlots(sampleBookings,'Tuesday',60);
 assert.ok(slots.includes(540));assert.ok(!slots.includes(570));assert.ok(!slots.includes(600));assert.ok(slots.includes(660));
 assert.ok(!slots.includes(990));assert.deepEqual(availableSlots(sampleBookings,'Friday',30),[]);
});
test('a booked time cannot be reserved twice and names are required',()=>{
 assert.equal(reserveSlot(sampleBookings,'Tuesday',540,30,' ').ok,false);
 const r=reserveSlot(sampleBookings,'Tuesday',540,30,'Alex');assert.equal(r.ok,true);
 assert.equal(reserveSlot(r.bookings,'Tuesday',540,30,'Sam').ok,false);
 assert.equal(reserveSlot(r.bookings,'Tuesday',570,30,'Sam').ok,true);
});
test('approval belongs to the exact deliverable version and revision clears it',()=>{
 let items=reviewDeliverable(sampleDeliverables,'design','approve');assert.equal(items[1].approvedVersion,2);
 items=reviewDeliverable(items,'design','revise');assert.equal(items[1].version,3);assert.equal(items[1].approvedVersion,null);
 assert.equal(items[0].approvedVersion,1);
 items=reviewDeliverable(items,'design','request','Change the heading');assert.equal(items[1].feedback,'Change the heading');
});
test('support matches full words and routes unsupported/mixed questions to a human',()=>{
 assert.equal(draftSupportReply('Can I return an item?').id,'returns');
 assert.equal(draftSupportReply('My item arrived damaged').needsHuman,true);
 assert.equal(draftSupportReply('Where is my order?').id,'delivery');
 for(const query of ['','What is your warranty?','return order','disorder'])assert.equal(draftSupportReply(query).supported,false);
});
