"use client";
import Signal from './signal';import Catalogue from './catalogue';import Documents from './documents';import Bridge from './bridge';
export type ShowcaseKind='signal'|'catalogue'|'folio'|'bridge';
export default function ShowcaseApp({kind}:{kind:ShowcaseKind}){return <section id="workspace" className="flagship-workspace" aria-label={`${kind} interactive showcase`}>{kind==='signal'?<Signal/>:kind==='catalogue'?<Catalogue/>:kind==='folio'?<Documents/>:<Bridge/>}</section>;}
