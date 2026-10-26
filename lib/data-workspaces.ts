// Real parsers, normalisation and reconciliation over user-selected/local sample data.
export type Mapping={sku:string;title:string;price:string;stock:string;category:string};
export type Feed={id:string;name:string;csv:string;mapping:Mapping};
export const sampleFeeds:Feed[]=[
 {id:'north',name:'North supplier',mapping:{sku:'SKU',title:'Product name',price:'Unit EUR',stock:'Available',category:'Category'},csv:'SKU,Product name,Unit EUR,Available,Category\nNG-100,Desk lamp,39.90,20,Lighting\nCB-200,USB C cable,12.50,45,Accessories\nST-300,Monitor stand,55.00,8,Office\n,Unlabelled adapter,18.00,6,Accessories'},
 {id:'cedar',name:'Cedar supplier',mapping:{sku:'vendor_code',title:'description',price:'price_eur',stock:'qty',category:'group'},csv:'vendor_code,description,price_eur,qty,group\nNG100,LED desk lamp,41.90,18,Lighting\nCB200,USB C cable,12.50,45,Accessories\nST400,Desk shelf,72.00,12,Office\nCH500,Travel charger,,15,Accessories'}
];
export function csvTable(input:string){
 if(input.length>1_000_000)throw Error('CSV exceeds the 1 MB demonstration limit.');
 const rows:string[][]=[];let row:string[]=[],field='',quoted=false,closed=false;
 const push=()=>{row.push(field);field='';closed=false;};
 const line=()=>{push();if(row.some(s=>s.trim()))rows.push(row);row=[];};
 for(let i=0;i<input.length;i++){const c=input[i];if(quoted){if(c==='"'&&input[i+1]==='"'){field+='"';i++;}else if(c==='"'){quoted=false;closed=true;}else field+=c;}else if(c==='"'){if(field||closed)throw Error('Unexpected quote in CSV.');quoted=true;}else if(c===',')push();else if(c==='\n'||c==='\r'){if(c==='\r'&&input[i+1]==='\n')i++;line();}else{if(closed&&c.trim())throw Error('Unexpected content after a quoted field.');if(!closed)field+=c;}}
 if(quoted)throw Error('CSV contains an unclosed quoted field.');if(field||row.length||closed)line();
 if(!rows.length)throw Error('CSV contains no rows.');const header=rows.shift()!.map((h,i)=>i===0?h.replace(/^\uFEFF/,'').trim():h.trim());
 if(new Set(header).size!==header.length||header.some(h=>!h))throw Error('Column names must be non-empty and unique.');
 if(rows.length>2000)throw Error('Maximum 2,000 rows per source.');if(rows.some(r=>r.length!==header.length))throw Error('Every row must have the same number of fields as the header.');
 return {header,rows};
}
export function csvOutput(rows:(string|number)[][]){return rows.map(row=>row.map(value=>{let s=String(value);if(/^[\s]*[=+@-]/.test(s))s="'"+s;return /[",\n\r]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}).join(',')).join('\r\n');}
export function normaliseSku(value:string){return value.toUpperCase().replace(/[^A-Z0-9]/g,'');}
export function euroCents(raw:string):number|null{const s=raw.trim().replace(/^€\s*/,'');if(!/^\d+(?:\.\d{1,2})?$/.test(s))return null;const [whole,fraction='']=s.split('.');const result=Number(whole)*100+Number(fraction.padEnd(2,'0'));return Number.isSafeInteger(result)&&result<=100_000_000?result:null;}
export type CatalogSource={source:string;row:number;sku:string;title:string;price:number|null;stock:number|null;category:string;raw:Record<string,string>};
export type CatalogProduct={key:string;sku:string;title:string;price:number|null;stock:number|null;category:string;sources:CatalogSource[];issues:string[];fingerprint:string};
export type ProductEdit={sku:string;title:string;price:string;stock:string;category:string};
export function fingerprint(value:unknown){const s=JSON.stringify(value);let hash=2166136261;for(let i=0;i<s.length;i++){hash^=s.charCodeAt(i);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(16);}
export function buildCatalogue(feeds:readonly Feed[],edits:Record<string,ProductEdit>={}){
 const groups=new Map<string,CatalogSource[]>();let rawRows=0;
 for(const feed of feeds){const table=csvTable(feed.csv);for(const col of Object.values(feed.mapping)){if(col&&!table.header.includes(col))throw Error(`${feed.name}: mapped column “${col}” does not exist.`);}table.rows.forEach((row,i)=>{rawRows++;const raw=Object.fromEntries(table.header.map((h,k)=>[h,row[k]])),get=(key:keyof Mapping)=>raw[feed.mapping[key]]?.trim()??'',sku=get('sku'),stockRaw=get('stock');const record:CatalogSource={source:feed.name,row:i+2,sku,title:get('title'),price:euroCents(get('price')),stock:/^\d+$/.test(stockRaw)&&Number(stockRaw)<=1_000_000?Number(stockRaw):null,category:get('category'),raw};const key=normaliseSku(sku)||`unkeyed-${feed.id}-${i+2}`;groups.set(key,[...(groups.get(key)??[]),record]);});}
 const products:CatalogProduct[]=Array.from(groups,([key,sources])=>{const first=sources[0],edit=edits[key],candidate={sku:edit?.sku??normaliseSku(first.sku),title:edit?.title??first.title,price:edit?euroCents(edit.price):first.price,stock:edit?(/^\d+$/.test(edit.stock)&&Number(edit.stock)<=1_000_000?Number(edit.stock):null):first.stock,category:edit?.category??first.category};const issues:string[]=[];if(!normaliseSku(candidate.sku))issues.push('Missing SKU');if(!candidate.title.trim())issues.push('Missing product name');if(candidate.price===null)issues.push('Price is missing or invalid');if(candidate.stock===null)issues.push('Stock is missing or invalid');if(!edit&&sources.length>1){if(new Set(sources.map(s=>s.price)).size>1)issues.push('Supplier prices disagree');if(new Set(sources.map(s=>s.stock)).size>1)issues.push('Supplier stock values disagree');if(new Set(sources.map(s=>s.title.toLowerCase())).size>1)issues.push('Product names differ');}const fp=fingerprint({candidate,sources});return {key,...candidate,sources,issues,fingerprint:fp};});
 const counts=new Map<string,number>();products.forEach(p=>{const key=normaliseSku(p.sku);if(key)counts.set(key,(counts.get(key)??0)+1);});products.forEach(p=>{if((counts.get(normaliseSku(p.sku))??0)>1)p.issues.push('Resolved SKU duplicates another product');});
 return {products,rawRows,duplicates:rawRows-products.length,held:products.filter(p=>p.issues.length).length};
}
export function catalogueExport(products:readonly CatalogProduct[],approvals:Record<string,string>){return csvOutput([['sku','title','price_eur','stock','category'],...products.filter(p=>!p.issues.length&&approvals[p.key]===p.fingerprint).map(p=>[p.sku,p.title,(p.price!/100).toFixed(2),p.stock!,p.category])]);}
export type SourceItem={sku:string;title:string;price:number;stock:number;minimumPrice:number;weight:number|null};
export type StoreItem={sku:string;title:string;price:number;stock:number;weight:number|null;version:number};
export const sampleInventory:SourceItem[]=[{sku:'NG100',title:'Desk lamp',price:3990,stock:20,minimumPrice:3500,weight:.8},{sku:'CB200',title:'USB C cable',price:1250,stock:45,minimumPrice:1000,weight:.12},{sku:'ST300',title:'Monitor stand',price:5500,stock:8,minimumPrice:4900,weight:null},{sku:'ST400',title:'Desk shelf',price:7200,stock:12,minimumPrice:6500,weight:2.4}];
export const sampleStore:StoreItem[]=[{sku:'NG100',title:'Desk lamp',price:4290,stock:16,weight:.8,version:1},{sku:'CB200',title:'USB C cable',price:1250,stock:45,weight:.12,version:1},{sku:'ST300',title:'Monitor stand',price:5900,stock:6,weight:1.2,version:3},{sku:'ST400',title:'Desk shelf',price:7200,stock:10,weight:2.4,version:2}];
export type SyncRow={sku:string;source:SourceItem;target:StoreItem|null;status:'ready'|'held'|'unchanged';changes:string[];issues:string[];fingerprint:string;targetVersion:number};
export function reconcileStore(source:readonly SourceItem[],store:readonly StoreItem[]):SyncRow[]{
 const keys=new Set<string>();if(store.some(s=>{if(keys.has(s.sku))return true;keys.add(s.sku);return false;}))throw Error('Duplicate destination SKU.');const seen=new Set<string>();
 return source.map(item=>{if(seen.has(item.sku))throw Error('Duplicate source SKU.');seen.add(item.sku);const target=store.find(s=>s.sku===item.sku)??null,issues:string[]=[],changes:string[]=[];
 if(!item.sku.trim()||!item.title.trim())issues.push('Missing identity');if(!Number.isSafeInteger(item.price)||item.price<0)issues.push('Invalid price');if(!Number.isInteger(item.stock)||item.stock<0)issues.push('Invalid stock');if(!Number.isSafeInteger(item.minimumPrice)||item.minimumPrice<0)issues.push('Invalid price floor');if(item.price<item.minimumPrice)issues.push('Below the supplier price floor');if(item.weight===null||!Number.isFinite(item.weight)||item.weight<=0)issues.push('Shipping weight is missing');
 if(!target)changes.push('Create product');else{if(item.title!==target.title)changes.push('Product name');if(item.price!==target.price)changes.push('Price');if(item.stock!==target.stock)changes.push('Stock');if(item.weight!==target.weight)changes.push('Shipping weight');}
 const status=issues.length?'held':changes.length?'ready':'unchanged';return {sku:item.sku,source:{...item},target:target?{...target}:null,status,changes,issues,fingerprint:fingerprint({item,target}),targetVersion:target?.version??0};
 });
}
export function applySyncPlan(plan:readonly SyncRow[],approved:Record<string,string>,current:readonly StoreItem[],failSku=''){
 const store=current.map(p=>({...p})),events:{sku:string;status:'applied'|'skipped'|'held'|'stale'|'failed';detail:string}[]=[];
 for(const row of plan){if(row.status==='held'){events.push({sku:row.sku,status:'held',detail:row.issues.join('; ')});continue;}if(row.status==='unchanged'){events.push({sku:row.sku,status:'skipped',detail:'Already in sync.'});continue;}if(approved[row.sku]!==row.fingerprint){events.push({sku:row.sku,status:'skipped',detail:'Current plan has not been approved.'});continue;}const index=store.findIndex(p=>p.sku===row.sku),now=index>=0?store[index]:null;if((now?.version??0)!==row.targetVersion){events.push({sku:row.sku,status:'stale',detail:'Store version changed. Reconcile again before applying.'});continue;}if(failSku===row.sku){events.push({sku:row.sku,status:'failed',detail:'Sample destination rejected this record; other records continue.'});continue;}const s=row.source,next:StoreItem={sku:s.sku,title:s.title,price:s.price,stock:s.stock,weight:s.weight,version:row.targetVersion+1};if(index>=0)store[index]=next;else store.push(next);events.push({sku:row.sku,status:'applied',detail:`Sample store updated once; version ${next.version}.`});}
 return {store,events};
}
