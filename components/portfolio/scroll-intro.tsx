"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowUpRight, CircuitBoard, Code2, Workflow, Search } from "lucide-react";

function Part({ progress, from, end, rotate, className, children }: { progress:MotionValue<number>;from:[number,number];end:[number,number];rotate:number;className:string;children:React.ReactNode }) {
  const reduced=useReducedMotion();
  const x=useTransform(progress,[0,.72],[from[0],end[0]]);
  const y=useTransform(progress,[0,.72],[from[1],end[1]]);
  const turn=useTransform(progress,[0,.72],[rotate,0]);
  return <motion.div className={`assembly-part ${className}`} style={{x:reduced?end[0]:x,y:reduced?end[1]:y,rotate:reduced?0:turn}}>{children}</motion.div>;
}
export default function ScrollIntro() {
  const section=useRef<HTMLElement>(null);
  const reduced=useReducedMotion();
  const {scrollYProgress:progress}=useScroll({target:section,offset:["start start","end end"]});
  const openingOpacity=useTransform(progress,[0,.18,.3],[1,1,0]);
  const middleOpacity=useTransform(progress,[.2,.32,.53,.64],[0,1,1,0]);
  const finalOpacity=useTransform(progress,[.56,.73],[0,1]);
  const connectionOpacity=useTransform(progress,[.35,.75],[0,1]);
  const progressScale=useTransform(progress,[0,1],[0,1]);
  return <section ref={section} className="scroll-intro" aria-labelledby="intro-title"><div className="intro-sticky"><div className="intro-grid page-width"><div className="intro-copy">
    <p className="eyebrow">Electrical engineering / Software / Automation</p><div className="intro-chapters">
      <motion.div className="intro-chapter chapter-opening" style={{opacity:reduced?0:openingOpacity}} aria-hidden="true"><p className="display-title">Good systems<br />start with<br /><span>the right parts.</span></p></motion.div>
      <motion.div className="intro-chapter chapter-middle" style={{opacity:reduced?0:middleOpacity}} aria-hidden="true"><p className="display-title">The difference<br />is in the<br /><span>connections.</span></p></motion.div>
      <motion.div className="intro-chapter chapter-final" style={{opacity:reduced?1:finalOpacity}} aria-hidden="true"><p className="display-title">Complex parts.<br />One system.<br /><span>Working together.</span></p></motion.div>
      <h1 id="intro-title" className="sr-only">Yassir Lamouddan — electrical engineering, software and automation. I connect complex parts into working systems.</h1>
    </div><p className="intro-description">I’m Yassir. I bring an engineer’s approach to software and the work it connects.</p><a className="text-link" href="#work">Explore the work <ArrowUpRight size={17} aria-hidden="true" /></a></div>
    <div className="assembly" aria-hidden="true"><div className="assembly-coordinate coordinate-top">FIG. A — A CONNECTED SYSTEM</div><div className="assembly-coordinate coordinate-bottom">COMPONENTS → CONNECTIONS → CAPABILITY</div><div className="assembly-orbit orbit-one" /><div className="assembly-orbit orbit-two" />
      <motion.svg className="assembly-connections" viewBox="0 0 560 460" style={{opacity:reduced?1:connectionOpacity}}><path d="M172 138 H280 V230 H388 M280 230 V322 H172 M388 138 V322" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="280" cy="230" r="8" fill="currentColor" /><circle cx="280" cy="230" r="22" fill="none" stroke="currentColor" strokeWidth="1" /></motion.svg>
      <div className="assembly-centre"><Part progress={progress} from={[-155,-124]} end={[-108,-92]} rotate={-24} className="part-engineering"><CircuitBoard size={37} strokeWidth={1.3} /><span>Engineering</span><i>01</i></Part><Part progress={progress} from={[141,-115]} end={[108,-92]} rotate={24} className="part-software"><Code2 size={40} strokeWidth={1.3} /><span>Software</span><i>02</i></Part><Part progress={progress} from={[-145,119]} end={[-108,92]} rotate={-19} className="part-automation"><Workflow size={37} strokeWidth={1.3} /><span>Automation</span><i>03</i></Part><Part progress={progress} from={[145,137]} end={[108,92]} rotate={28} className="part-evidence"><Search size={37} strokeWidth={1.3} /><span>Understanding</span><i>04</i></Part></div>
      <motion.div className="system-caption" style={{opacity:reduced?1:finalOpacity}}><span className="status-dot" /> Connected by design.</motion.div>
    </div></div><div className="intro-footer page-width"><span className="scroll-instruction"><ArrowDown size={15} aria-hidden="true" /> Scroll to connect the parts</span><a href="#work">Skip to projects <ArrowDown size={14} aria-hidden="true" /></a><div className="intro-progress"><motion.div style={{scaleX:reduced?1:progressScale}} /></div></div></div></section>;
}
