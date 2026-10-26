// All bundled records are fictional. These models make no external requests.
export type StudioPolicy={minimumBudget:number;reviewRequired:boolean;retryLimit:number;failures:number};
export type StudioLead={id:string;name:string;message:string;budget:number};
export const studioLeads:StudioLead[]=[
 {id:"lead-104",name:"Cedar Studio",message:"We need a new online store and a product configurator. Ready to start this month.",budget:12000},
 {id:"lead-105",name:"Northline Events",message:"We want to connect our booking system and automate client updates.",budget:6500},
 {id:"lead-106",name:"Sample enquiry",message:"I am looking for an internship.",budget:0},
];
export const defaultStudioPolicy:StudioPolicy={minimumBudget:5000,reviewRequired:true,retryLimit:2,failures:0};
export type TraceStep={node:string;status:"success"|"waiting"|"failed"|"skipped";detail:string;payload:Record<string,unknown>};
export function runStudioLead(lead:StudioLead,policy:StudioPolicy,approved=false){
 if(!Number.isFinite(lead.budget)||lead.budget<0||!Number.isInteger(policy.retryLimit)||policy.retryLimit<0||policy.retryLimit>5||!Number.isInteger(policy.failures)||policy.failures<0||policy.failures>6||!Number.isFinite(policy.minimumBudget)||policy.minimumBudget<0)throw Error("Invalid workflow input or policy.");
 const steps:TraceStep[]=[];
 const add=(node:string,status:TraceStep['status'],detail:string,payload:Record<string,unknown>={})=>steps.push({node,status,detail,payload});
 add("intake","success","Sample enquiry accepted.",{id:lead.id,budget:lead.budget});
 const relevant=/website|store|automat|booking|configurator|system|portal/i.test(lead.message);
 const intent=/store|configurator/i.test(lead.message)?"Digital commerce":/automat|system|booking/i.test(lead.message)?"Business automation":"Web development";
 add("classify","success","Simulated model connector returned structured intent. No live AI request.",{intent,relevant,mode:"fixture"});
 const qualified=relevant&&lead.budget>=policy.minimumBudget;
 add("route","success",qualified?"Qualified branch selected.":"Review-later branch selected.",{qualified,minimumBudget:policy.minimumBudget});
 if(!qualified){add("archive","success","Added to the local review-later queue.");return {status:"review-later" as const,steps,intent,draft:null,attempts:0};}
 const draft=`Hi ${lead.name}, thanks for your enquiry about ${intent.toLowerCase()}. I’d like to understand your goals, current setup and the first thing you want to improve. Could we arrange a short discovery call?`;
 add("draft","success","Prepared a sample response from the selected branch.",{draft});
 if(policy.reviewRequired&&!approved){add("approval","waiting","Waiting for a person to approve this exact run.");return {status:"needs-approval" as const,steps,intent,draft,attempts:0};}
 add("approval","success",policy.reviewRequired?"Owner approved this run.":"Review bypass is explicitly enabled for this sample.");
 let attempts=0;
 while(attempts<=policy.retryLimit){attempts++;if(attempts<=policy.failures){add("delivery","failed",`Local connector attempt ${attempts} failed.`,{attempt:attempts,maxAttempts:policy.retryLimit+1});}else{add("delivery","success",`Local connector accepted event once on attempt ${attempts}.`,{idempotencyKey:lead.id,attempt:attempts});return {status:"completed" as const,steps,intent,draft,attempts};}}
 return {status:"failed" as const,steps,intent,draft,attempts};
}
export type FormaConfig={width:number;finish:"oak"|"walnut"|"white";monitor:boolean;storage:boolean;plant:boolean;room:"studio"|"compact"};
export const defaultForma:FormaConfig={width:1600,finish:"oak",monitor:true,storage:false,plant:true,room:"studio"};
export const formaFinishes={oak:{name:"Natural oak",top:"#cfa879",edge:"#ab8155",extra:0},walnut:{name:"American walnut",top:"#77533d",edge:"#4d362b",extra:14000},white:{name:"Porcelain",top:"#e5e8e6",edge:"#bec6c3",extra:6000}};
export function priceForma(config:FormaConfig){
 if(![1200,1400,1600,1800,2000].includes(config.width)||!Object.hasOwn(formaFinishes,config.finish)||!["studio","compact"].includes(config.room))throw Error("Invalid workspace configuration.");
 const lines=[{label:`${config.width} mm standing desk`,cents:59000+(config.width-1200)*35},{label:formaFinishes[config.finish].name,cents:formaFinishes[config.finish].extra}];
 if(config.monitor)lines.push({label:"Monitor & arm",cents:29000});if(config.storage)lines.push({label:"Rolling storage",cents:18500});if(config.plant)lines.push({label:"Desk planter",cents:4500});
 const roomWidth=config.room==="compact"?2400:3400,requiredWidth=config.width+900+(config.storage?400:0);
 return {lines,total:lines.reduce((s,l)=>s+l.cents,0),fits:requiredWidth<=roomWidth,requiredWidth,roomWidth};
}
export type SignalRecord={id:string;company:string;sector:string;need:string;budget:number;urgency:number;fit:number;source:string;excerpt:string};
export const signalRecords:SignalRecord[]=[
 {id:"op-01",company:"Harbour Collective",sector:"Retail",need:"Product configurator for a modular furniture collection",budget:24000,urgency:88,fit:94,source:"Sample procurement brief · §2",excerpt:"The shop plans a modular furniture launch and needs customers to configure finishes, dimensions and accessories before requesting a quote."},
 {id:"op-02",company:"Luma Travel",sector:"Travel",need:"Custom itinerary builder with shared client approvals",budget:18000,urgency:75,fit:89,source:"Sample project request · §1",excerpt:"Advisers currently build itineraries in spreadsheets. The team wants a shared visual itinerary and one place for client feedback."},
 {id:"op-03",company:"Cedar Commerce",sector:"Retail",need:"Order support automation with a human approval boundary",budget:14000,urgency:91,fit:92,source:"Sample operations interview · §3",excerpt:"The support queue contains repeated order questions. Drafting can be automated, but refunds and external replies need staff approval."},
 {id:"op-04",company:"Morrow Legal",sector:"Professional services",need:"Private document search with source citations",budget:28000,urgency:53,fit:86,source:"Sample discovery note · §4",excerpt:"Staff need to find approved clauses and their original documents. Any search result must show its exact source and permissions boundary."},
 {id:"op-05",company:"Studio North",sector:"Professional services",need:"Client onboarding portal linked to project operations",budget:9500,urgency:66,fit:82,source:"Sample project request · §2",excerpt:"New projects begin with scattered forms, files and email threads. One shared intake and approval flow would replace repeated follow-ups."},
 {id:"op-06",company:"Wildwood Stays",sector:"Travel",need:"Interactive accommodation finder and booking handover",budget:21000,urgency:61,fit:84,source:"Sample procurement brief · §1",excerpt:"Guests should compare locations, view accommodation details and assemble a shortlist before being handed to the existing booking provider."},
];
export type SignalWeights={fit:number;urgency:number;budget:number};
export const defaultSignalWeights:SignalWeights={fit:55,urgency:30,budget:15};
export function rankSignals(records:readonly SignalRecord[],weights:SignalWeights,sector="All",query="",minimum=0){
 if(Object.values(weights).some(n=>!Number.isFinite(n)||n<0)||!Number.isFinite(minimum)||minimum<0)throw Error("Invalid ranking settings.");
 const sum=weights.fit+weights.urgency+weights.budget;if(sum===0)return [];
 const seen=new Set<string>();
 return records.filter(r=>{const key=r.company.toLowerCase().trim()+"|"+r.need.toLowerCase().trim();if(seen.has(key))return false;seen.add(key);return r.budget>=minimum&&(sector==="All"||r.sector===sector)&&`${r.company} ${r.need}`.toLowerCase().includes(query.toLowerCase());}).map(r=>{const budgetScore=Math.min(100,r.budget/30000*100);const parts={fit:r.fit*weights.fit/sum,urgency:r.urgency*weights.urgency/sum,budget:budgetScore*weights.budget/sum};return {...r,score:Math.round((parts.fit+parts.urgency+parts.budget)*10)/10,parts};}).sort((a,b)=>b.score-a.score||a.company.localeCompare(b.company));
}
export function parseSignalImport(raw:string):SignalRecord[]{
 const data=JSON.parse(raw);if(!Array.isArray(data)||data.length>100||!data.length)throw Error("Import a JSON array containing 1–100 records.");
 return data.map((item,i)=>{if(!item||typeof item!=="object")throw Error(`Record ${i+1} is invalid.`);for(const key of ["company","sector","need","source","excerpt"]){if(typeof item[key]!=="string"||!item[key].trim()||item[key].length>3000)throw Error(`Record ${i+1}: ${key} is missing or too long.`);}for(const key of ["budget","urgency","fit"]){if(typeof item[key]!=="number"||!Number.isFinite(item[key])||item[key]<0||(key!=="budget"&&item[key]>100))throw Error(`Record ${i+1}: ${key} is invalid.`);}return {id:`import-${i+1}`,company:item.company,sector:item.sector,need:item.need,source:item.source,excerpt:item.excerpt,budget:item.budget,urgency:item.urgency,fit:item.fit};});
}
