"use client";
export const euros=(cents:number)=>new Intl.NumberFormat('en',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(cents/100);
export function downloadJson(value:unknown,name:string){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
