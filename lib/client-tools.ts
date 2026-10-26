// Independent demonstration tools: fictional records, browser-session state.
export const quoteOptions=[
  {id:"website",label:"Business website",description:"A focused 5-page website",cents:120000},
  {id:"copy",label:"Website copy",description:"Clear wording for your main pages",cents:30000},
  {id:"booking",label:"Appointment booking",description:"A booking flow for your services",cents:45000},
  {id:"portal",label:"Client portal",description:"One place for updates and approvals",cents:65000},
] as const;
export type QuoteOption=typeof quoteOptions[number]["id"];
export function calculateClientQuote(selected:readonly QuoteOption[],discount:number) {
  if(!Number.isInteger(discount)||discount<0||discount>20)throw new Error("Discount must be a whole percentage between 0 and 20.");
  const unique=Array.from(new Set(selected));
  if(unique.some(id=>!quoteOptions.some(item=>item.id===id)))throw new Error("Unknown service.");
  const subtotal=quoteOptions.filter(item=>unique.includes(item.id)).reduce((sum,item)=>sum+item.cents,0);
  const saving=Math.round(subtotal*discount/100);
  return {subtotal,saving,total:subtotal-saving,deposit:Math.round((subtotal-saving)*.3),valid:subtotal>0};
}
export type Booking={id:string;day:string;start:number;duration:number;name:string};
export const sampleBookings:Booking[]=[{id:"sample-1",day:"Tuesday",start:600,duration:60,name:"Sample client"},{id:"sample-2",day:"Tuesday",start:900,duration:30,name:"Sample client"},{id:"sample-3",day:"Thursday",start:780,duration:60,name:"Sample client"}];
export const appointmentServices=[{id:"intro",label:"Discovery call",duration:30},{id:"planning",label:"Project planning",duration:60}];
export function availableSlots(bookings:readonly Booking[],day:string,duration:number) {
  if(!["Tuesday","Thursday"].includes(day)||![30,60].includes(duration))return [];
  const slots:number[]=[];
  for(let start=540;start+duration<=1020;start+=30) {
    if(!bookings.some(b=>b.day===day&&start<b.start+b.duration&&start+duration>b.start))slots.push(start);
  }
  return slots;
}
export function reserveSlot(bookings:readonly Booking[],day:string,start:number,duration:number,name:string) {
  const clean=name.trim();
  if(!clean)return {ok:false as const,error:"Enter a name for this sample booking.",bookings};
  if(!availableSlots(bookings,day,duration).includes(start))return {ok:false as const,error:"That time is unavailable. Choose another free time.",bookings};
  const booking:Booking={id:`booking-${bookings.length+1}`,day,start,duration,name:clean};
  return {ok:true as const,booking,bookings:[...bookings,booking]};
}
export type Deliverable={id:string;title:string;version:number;approvedVersion:number|null;feedback:string};
export const sampleDeliverables:Deliverable[]=[{id:"structure",title:"Website structure",version:1,approvedVersion:1,feedback:""},{id:"design",title:"Homepage design",version:2,approvedVersion:null,feedback:""},{id:"copy",title:"Page copy",version:1,approvedVersion:null,feedback:""}];
export function reviewDeliverable(items:readonly Deliverable[],id:string,action:"approve"|"request"|"revise",feedback="") {
  return items.map(item=>{
    if(item.id!==id)return item;
    if(action==="approve")return {...item,approvedVersion:item.version,feedback:""};
    if(action==="revise")return {...item,version:item.version+1,approvedVersion:null,feedback:""};
    return {...item,approvedVersion:null,feedback:feedback.trim()};
  });
}
export const shopPolicies=[
  {id:"delivery",title:"Delivery times",question:"Where is my order?",terms:["delivery","deliver","order","shipping","arrive"],answer:"Sample shop policy: standard delivery takes 3–5 working days after dispatch. If tracking has not changed for 3 working days, a team member should check with the carrier.",source:"Delivery policy · §1",needsHuman:false},
  {id:"returns",title:"Returns",question:"Can I return an item?",terms:["return","returns","refund","unwanted"],answer:"Sample shop policy: unused items can be returned within 30 days of delivery in their original packaging. A team member must review refund requests; this demo cannot issue a refund.",source:"Returns policy · §2",needsHuman:true},
  {id:"damage",title:"Damaged items",question:"My item arrived damaged",terms:["damage","damaged","broken","faulty"],answer:"Sample shop policy: ask the customer for the order reference and a photo of the damage. A team member reviews the evidence and arranges the next step. Do not promise a replacement before review.",source:"Damaged items policy · §3",needsHuman:true},
];
export function draftSupportReply(query:string) {
  const words=new Set(query.toLowerCase().match(/[a-z]+/g)??[]);
  const ranked=shopPolicies.map(p=>({...p,matches:p.terms.filter(term=>words.has(term)).length})).filter(p=>p.matches>0).sort((a,b)=>b.matches-a.matches);
  if(!ranked.length)return {supported:false as const,answer:"No matching policy found. Pass this question to a team member instead of guessing.",needsHuman:true};
  if(ranked.length>1)return {supported:false as const,answer:"This question covers more than one policy. A team member should review the full request.",needsHuman:true};
  return {supported:true as const,...ranked[0]};
}
