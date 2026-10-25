"use client";
import FlowStudio from './flow-studio';import Forma from './forma';import Signal from './signal';
export type ShowcaseKind='flow-studio'|'forma'|'signal';
export default function ShowcaseApp({kind}:{kind:ShowcaseKind}){return <section id="workspace" className="flagship-workspace" aria-label={`${kind} interactive showcase`}>{kind==='flow-studio'?<FlowStudio/>:kind==='forma'?<Forma/>:<Signal/>}</section>;}
