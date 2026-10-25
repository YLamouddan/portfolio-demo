// Independent portfolio prototypes. All fixtures are fictional and local.
export const faultSymptoms = [
  { id: "power", label: "Unexpected restart" },
  { id: "feed", label: "Feed interruption" },
  { id: "noise", label: "Mechanical noise" },
  { id: "warm", label: "Temperature drift" },
  { id: "sensor", label: "Inconsistent sensor reading" },
] as const;
export type Symptom = typeof faultSymptoms[number]["id"];
const faults: { title: string; symptoms: Symptom[]; test: string; reason: string }[] = [
  { title: "Supply instability", symptoms: ["power", "warm"], test: "Compare the recorded supply trace with the restart timestamps.", reason: "Restarts and thermal drift can share a supply-related cause." },
  { title: "Transport assembly", symptoms: ["feed", "noise"], test: "Review the sample transport test and its interruption log.", reason: "Feed interruptions accompanied by noise point toward the transport path." },
  { title: "Feedback path", symptoms: ["sensor", "feed"], test: "Compare the sample sensor trace with known reference events.", reason: "Inconsistent feedback can explain an interrupted feed sequence." },
  { title: "Thermal behaviour", symptoms: ["warm", "sensor"], test: "Compare cold and warm sample test runs before changing the diagnosis.", reason: "Temperature drift can affect feedback without a mechanical fault." },
];
export function rankFaults(selected: readonly Symptom[]) {
  const unique = Array.from(new Set(selected));
  if (!unique.length) return [];
  return faults.map(fault => {
    const matched = fault.symptoms.filter(s => unique.includes(s));
    const missing = fault.symptoms.filter(s => !unique.includes(s));
    return { ...fault, matched, missing, score: matched.length / unique.length };
  }).filter(f => f.matched.length > 0).sort((a,b) => b.matched.length - a.matched.length || a.missing.length - b.missing.length);
}

export const energyBaseline = [15,14,14,13,14,17,22,26,28,27,26,25,24,26,28,27,25,23,21,20,19,18,17,16];
export const energyPrices = [12,11,10,10,11,13,18,24,29,25,20,15,12,11,13,19,28,34,30,24,20,17,15,13];
export const flexibleLoads = [
  { name: "Test bench", kw: 18, hours: 3, earliest: 7, latest: 16, original: 8 },
  { name: "Wash cycle", kw: 12, hours: 2, earliest: 8, latest: 17, original: 8 },
  { name: "Fleet charging", kw: 11, hours: 3, earliest: 7, latest: 18, original: 8 },
];
export function energyProfile(starts: readonly number[]) {
  if (starts.length !== flexibleLoads.length || starts.some((s,i) => !Number.isInteger(s) || s < flexibleLoads[i].earliest || s > flexibleLoads[i].latest)) throw new Error("Start time is outside a load's operating window.");
  const profile = energyBaseline.map((base,hour) => base + flexibleLoads.reduce((sum,load,i) => sum + (hour >= starts[i] && hour < starts[i]+load.hours ? load.kw : 0),0));
  return { profile, peak: Math.max(...profile), kwh: profile.reduce((s,n)=>s+n,0), costCents: Math.round(profile.reduce((s,kw,hour)=>s+kw*energyPrices[hour],0)) };
}
export function optimiseEnergy(cap: number) {
  if (!Number.isFinite(cap) || cap < 0) throw new Error("Demand cap must be a non-negative finite number.");
  let best: (ReturnType<typeof energyProfile> & { starts: number[] }) | null = null;
  let candidates = 0;
  for(let a=flexibleLoads[0].earliest;a<=flexibleLoads[0].latest;a++) {
    for(let b=flexibleLoads[1].earliest;b<=flexibleLoads[1].latest;b++) {
      for(let c=flexibleLoads[2].earliest;c<=flexibleLoads[2].latest;c++) {
        const starts=[a,b,c], candidate=energyProfile(starts); candidates++;
        if(candidate.peak<=cap && (!best || candidate.costCents<best.costCents || (candidate.costCents===best.costCents && candidate.peak<best.peak))) best={...candidate,starts};
      }
    }
  }
  return { best, candidates };
}

export type RelayState = { status: "idle"|"needs-review"|"ready"|"failed"|"completed"|"exhausted"; attempts:number; outage:boolean; accepted:boolean; delivered:boolean; log:string[] };
export const initialRelay: RelayState = { status:"idle",attempts:0,outage:true,accepted:false,delivered:false,log:[] };
export type RelayAction = "receive"|"approve"|"deliver"|"restore"|"outage"|"reset";
export function relayTransition(state: RelayState, action: RelayAction): RelayState {
  if(action==="reset") return {...initialRelay,log:[]};
  const append=(message:string,change:Partial<RelayState>={})=>({...state,...change,log:[...state.log,message]});
  if(action==="receive") return state.accepted ? append("Replay ignored · event evt-1042 already accepted.") : append("evt-1042 accepted · policy requires human review.",{accepted:true,status:"needs-review"});
  if(action==="outage") return append("Sample endpoint unavailable.",{outage:true});
  if(action==="restore") return append("Sample endpoint restored. No delivery is retried automatically.",{outage:false});
  if(action==="approve") return state.status==="needs-review" ? append("Human review recorded · delivery unlocked.",{status:"ready"}) : append("Review unchanged · no event is waiting for approval.");
  if(state.delivered) return append("Duplicate delivery blocked · evt-1042 already completed.");
  if(!["ready","failed"].includes(state.status)) return append(state.status==="exhausted" ? "Retry budget exhausted · reset the sample to start a new run." : "Delivery blocked · receive and approve the event first.");
  const attempts=state.attempts+1;
  if(state.outage) return append(`Attempt ${attempts}/3 failed · ${attempts===3 ? "retry budget exhausted" : "retry available"}.`,{attempts,status:attempts===3 ? "exhausted" : "failed"});
  return append(`Attempt ${attempts}/3 delivered · idempotency key evt-1042 recorded.`,{attempts,status:"completed",delivered:true});
}

export const sampleDocuments = [
  { id:"M-01",title:"Transport interruption",section:"Service notes · §2",text:"A feed interruption with mechanical noise should be compared with the transport test log. A repeated sensor warning without mechanical noise should be checked against the feedback trace. Record observations before assigning a cause." },
  { id:"M-02",title:"Restart investigation",section:"Service notes · §4",text:"For an unexpected restart, correlate the supply trace, temperature trend and restart timestamp. A restart alone does not establish a supply fault. Collect a second observation before choosing a repair path." },
  { id:"W-01",title:"Approval boundary",section:"Workflow rules · §1",text:"An incoming event requiring human review must not be delivered before approval. After approval, the event can enter the delivery stage. An event replay does not grant approval." },
  { id:"W-02",title:"Retry and replay",section:"Workflow rules · §3",text:"The sample workflow permits three delivery attempts. An outage consumes one attempt per delivery action. A restored endpoint does not reset the retry budget. Replayed events share an idempotency key and must not create a duplicate delivery." },
  { id:"E-01",title:"Flexible energy loads",section:"Planning assumptions · §2",text:"Flexible loads can move within their stated start windows. Each load keeps its power and run duration. The demand cap applies to every hourly interval, including fixed baseline demand. If no schedule fits, report infeasibility instead of silently changing the cap." },
  { id:"E-02",title:"Price and demand",section:"Planning assumptions · §3",text:"The energy scheduler compares hourly energy prices across every permitted start combination. It chooses the lowest energy cost among schedules that respect the demand cap. This model excludes demand charges, ramp rates and equipment wear." },
];
const stopWords=new Set(["a","an","and","are","as","at","be","before","can","do","does","for","from","how","i","in","is","it","of","on","or","the","to","what","when","with","why"]);
function tokens(text:string) { return Array.from(new Set(text.toLowerCase().match(/[a-z0-9]+/g)?.filter(t=>t.length>2 && !stopWords.has(t)) ?? [])); }
export function retrievePassages(query:string) {
  const words=tokens(query);
  if(!words.length) return [];
  return sampleDocuments.map(doc=> {
    const content=new Set(tokens(doc.title+" "+doc.text));
    const matches=words.filter(w=>content.has(w));
    return {...doc,matches,coverage:matches.length/words.length};
  }).filter(doc=>doc.matches.length>0 && doc.coverage>=.5).sort((a,b)=>b.coverage-a.coverage || b.matches.length-a.matches.length).slice(0,3);
}
