"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowUpRight, Check, CalendarDays, MessageSquare, FileText } from "lucide-react";
function WorkflowCard({progress,from,end,rotate,disabled,className,children}:{progress:MotionValue<number>;from:[number,number];end:[number,number];rotate:number;disabled:boolean;className:string;children:React.ReactNode}) {
  const x=useTransform(progress,[0,.68],[from[0],end[0]]),y=useTransform(progress,[0,.68],[from[1],end[1]]),turn=useTransform(progress,[0,.68],[rotate,0]),scale=useTransform(progress,[0,.68],[.9,1]);
  return <motion.div className={`workflow-card ${className}`} style={{x:disabled?end[0]:x,y:disabled?end[1]:y,rotate:disabled?0:turn,scale:disabled?1:scale}}>{children}</motion.div>;
}
export default function ScrollIntro() {
  const section=useRef<HTMLElement>(null);
  const [enabled,setEnabled]=useState(true),[ready,setReady]=useState(false);
  useEffect(()=>{
    let stored:string|null=null;
    try{stored=localStorage.getItem("portfolio-motion");}catch{}
    const initial=stored==="on"?true:stored==="off"?false:!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(initial);setReady(true);
    try{localStorage.setItem("portfolio-motion",initial?"on":"off");}catch{}
  },[]);
  const disabled=!enabled;
  const {scrollYProgress:rawProgress}=useScroll({target:section,offset:["start start","end end"]});
  // Smooth discontinuous wheel/keyboard input without replacing native page scrolling.
  const progress=useSpring(rawProgress,{stiffness:135,damping:30,mass:.45,restDelta:.0001,restSpeed:.001});
  useEffect(()=>{if(ready)progress.jump(rawProgress.get());},[ready,enabled,progress,rawProgress]);
  const first=useTransform(progress,[0,.17,.3],[1,1,0]),middle=useTransform(progress,[.23,.36,.54,.65],[0,1,1,0]),last=useTransform(progress,[.58,.76],[0,1]);
  const firstY=useTransform(progress,[0,.17,.3],[0,0,-70]),middleY=useTransform(progress,[.23,.36,.54,.65],[70,0,0,-70]),lastY=useTransform(progress,[.58,.76],[70,0]);
  const panelOpacity=useTransform(progress,[.25,.65],[0,1]),panelScale=useTransform(progress,[.25,.7],[.7,1]);
  return <section ref={section} className={`scroll-intro client-intro ${disabled?"motion-disabled":"motion-enabled"}`} aria-labelledby="intro-title" data-motion={disabled?"off":"on"} data-preferences-ready={ready?"true":"false"}>
    <div className="intro-sticky"><div className="intro-grid page-width"><div className="intro-copy"><p className="eyebrow">Websites & automation for your business</p><div className="intro-chapters">
      <motion.div className="intro-chapter chapter-opening" style={{opacity:disabled?0:first,y:disabled?0:firstY}} aria-hidden="true"><p className="display-title">More clients.<br />Less chasing.<br /><span>Make it flow.</span></p></motion.div>
      <motion.div className="intro-chapter chapter-middle" style={{opacity:disabled?0:middle,y:disabled?0:middleY}} aria-hidden="true"><p className="display-title">From a first<br />“hello” to<br /><span>“you’re booked.”</span></p></motion.div>
      <motion.div className="intro-chapter chapter-final" style={{opacity:disabled?1:last,y:disabled?0:lastY}} aria-hidden="true"><p className="display-title">Your business.<br />Working<br /><span>beautifully.</span></p></motion.div>
      <h1 id="intro-title" className="sr-only">Yassir Lamouddan — websites and automation that help your business turn enquiries into booked work.</h1>
    </div><p className="intro-description">I’m Yassir. I build websites and tools that help you win work, look after clients, and spend less time on admin.</p><a className="text-link" href="#work">See what I can build <ArrowUpRight size={17} aria-hidden="true"/></a></div>
    <div className="workflow-scene" aria-hidden="true"><motion.div className="workflow-window" style={{opacity:disabled?1:panelOpacity,scale:disabled?1:panelScale}}><div className="window-chrome"><i/><i/><i/><span>Your business, connected.</span></div><div className="workflow-track"/><div className="workflow-window-caption"><span className="status-dot"/>One enquiry. Every next step in place.</div></motion.div><div className="workflow-card-origin">
      <WorkflowCard progress={progress} from={[-165,-115]} end={[-175,0]} rotate={-20} disabled={disabled} className="card-enquiry"><span className="workflow-card-step">01 / Enquiry</span><MessageSquare size={24} strokeWidth={1.4}/><strong>A new opportunity.</strong><p>“Can you help us<br/>with our website?”</p><span className="workflow-card-state">Enquiry received <Check size={12}/></span></WorkflowCard>
      <WorkflowCard progress={progress} from={[145,-85]} end={[0,0]} rotate={16} disabled={disabled} className="card-quote"><span className="workflow-card-step">02 / Quote</span><FileText size={24} strokeWidth={1.4}/><strong>A clear proposal.</strong><p>Scope, price and<br/>next steps. Together.</p><span className="workflow-card-state">Proposal accepted <Check size={12}/></span></WorkflowCard>
      <WorkflowCard progress={progress} from={[25,130]} end={[175,0]} rotate={-10} disabled={disabled} className="card-booking"><span className="workflow-card-step">03 / Booking</span><CalendarDays size={24} strokeWidth={1.4}/><strong>Time to get started.</strong><p>The right time.<br/>No email tennis.</p><span className="workflow-card-state">You’re booked <Check size={12}/></span></WorkflowCard>
    </div><span className="scene-sample">Illustrative workflow · scroll to connect</span></div></div>
    <div className="intro-footer page-width"><div className="motion-control"><span>Scroll animation</span><button type="button" role="switch" aria-label="Scroll animation" aria-checked={enabled} className="motion-switch" onClick={()=>{const next=!enabled;setEnabled(next);try{localStorage.setItem("portfolio-motion",next?"on":"off");}catch{}}}><span className="motion-switch-track"><span className="motion-switch-thumb"/></span><span className="motion-switch-value">{enabled?"On":"Off"}</span></button></div><span className="scroll-instruction"><ArrowDown size={15} aria-hidden="true"/>{disabled?"Animation is off":"Scroll and watch it come together"}</span><a href="#work">Skip intro <ArrowDown size={14} aria-hidden="true"/></a><div className="intro-progress"><motion.div style={{scaleX:disabled?1:progress}}/></div></div>
    </div>
  </section>;
}
