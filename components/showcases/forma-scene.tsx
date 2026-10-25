"use client";
import {useEffect,useRef,useState} from "react";
import {RotateCcw,ZoomIn,ZoomOut} from "lucide-react";
import {formaFinishes,type FormaConfig} from "@/lib/showcase-models";
type Point=[number,number,number];type Box={center:Point;size:Point;color:string};
function tint(hex:string,factor:number){const n=parseInt(hex.slice(1),16);return `rgb(${[n>>16,(n>>8)&255,n&255].map(v=>Math.min(255,Math.round(v*factor))).join(',')})`;}
function boxesFor(config:FormaConfig):Box[]{
 const w=config.width/1000,c=formaFinishes[config.finish],boxes:Box[]=[];const add=(center:Point,size:Point,color:string)=>boxes.push({center,size,color});
 add([0,-.045,0],[3.5,.06,2.7],'#d2d6d2');add([0,.755,0],[w,.065,.78],c.top);
 for(const x of [-w/2+.12,w/2-.12]){add([x,.39,0],[.065,.69,.065],'#30363b');add([x,.05,0],[.1,.065,.66],'#30363b');add([x,.45,0],[.1,.1,.07],'#59616a');}
 add([0,.56,-.2],[w-.2,.08,.04],'#343a40');
 if(config.monitor){add([0,.85,-.21],[.3,.025,.18],'#3d434a');add([0,1,-.23],[.045,.3,.045],'#525964');add([0,1.19,-.24],[.62,.38,.045],'#252e3b');add([0,1.19,-.209],[.574,.33,.009],'#8babe2');add([-.12,1.21,-.201],[.25,.2,.004],'#d5e1ee');add([.16,1.23,-.2],[.19,.045,.005],'#6187c8');add([.16,1.14,-.2],[.19,.055,.005],'#bed2ee');}
 add([.05,.805,.12],[.44,.018,.15],'#e0e2e1');add([.36,.805,.12],[.07,.025,.11],'#303940');
 if(config.storage){const x=w/2+.23;add([x,.34,.02],[.36,.63,.66],c.edge);for(let y=.14;y<.62;y+=.2){add([x,y,.357],[.31,.17,.02],c.top);add([x,y+.03,.376],[.08,.012,.02],'#343b42');}}
 if(config.plant){const x=-w/2+.18;add([x,.87,-.18],[.14,.17,.14],'#d1bdab');add([x,1.03,-.18],[.12,.2,.12],'#5e8064');add([x-.07,1,-.16],[.1,.13,.06],'#789774');add([x+.06,1.08,-.18],[.08,.14,.07],'#456d55');}
 add([.1,.47,.88],[.47,.08,.44],'#596778');add([.1,.77,1.08],[.48,.56,.06],'#657489');add([.1,.24,.88],[.055,.42,.055],'#343b44');add([.1,.055,.88],[.55,.06,.08],'#343b44');add([.1,.055,.88],[.08,.06,.55],'#343b44');
 return boxes;
}
export default function FormaScene({config}:{config:FormaConfig}){
 const canvas=useRef<HTMLCanvasElement>(null),drag=useRef<{x:number;y:number;yaw:number;pitch:number}|null>(null),frame=useRef<number>();
 const [camera,setCamera]=useState({yaw:-.65,pitch:.55,zoom:1});
 useEffect(()=>{const element=canvas.current;if(!element)return;const context=element.getContext('2d');if(!context)return;
 const draw=()=>{const rect=element.getBoundingClientRect(),ratio=Math.min(devicePixelRatio,2);element.width=rect.width*ratio;element.height=rect.height*ratio;context.setTransform(ratio,0,0,ratio,0,0);const width=rect.width,height=rect.height;context.clearRect(0,0,width,height);
 const project=(p:Point)=>{const x=Math.cos(camera.yaw)*p[0]+Math.sin(camera.yaw)*p[2],z=-Math.sin(camera.yaw)*p[0]+Math.cos(camera.yaw)*p[2],y=Math.cos(camera.pitch)*p[1]-Math.sin(camera.pitch)*z,depth=Math.sin(camera.pitch)*p[1]+Math.cos(camera.pitch)*z;const scale=Math.min(width/4.9,height/3.4)*camera.zoom*5/(5-depth);return {x:width/2+x*scale,y:height*.72-y*scale,depth};};
 const faces:{points:ReturnType<typeof project>[];depth:number;color:string}[]=[];
 for(const box of boxesFor(config)){const [x,y,z]=box.center,[w,h,d]=box.size;const corners:Point[]=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([a,b,c])=>[x+a*w/2,y+b*h/2,z+c*d/2]);for(const [indices,light] of [[[0,1,2,3],.7],[[4,5,6,7],.94],[[0,4,7,3],.8],[[1,5,6,2],.88],[[3,2,6,7],1.1],[[0,1,5,4],.6]] as [number[],number][]){const points=indices.map(i=>project(corners[i]));faces.push({points,depth:points.reduce((s,p)=>s+p.depth,0)/4,color:tint(box.color,light)});}}
 faces.sort((a,b)=>a.depth-b.depth);context.lineJoin='round';for(const face of faces){context.beginPath();face.points.forEach((p,i)=>i?context.lineTo(p.x,p.y):context.moveTo(p.x,p.y));context.closePath();context.fillStyle=face.color;context.fill();context.strokeStyle=face.color;context.lineWidth=.4;context.stroke();}
 };
 draw();const observer=new ResizeObserver(draw);observer.observe(element);return()=>observer.disconnect();},[config,camera]);
 useEffect(()=>()=>{if(frame.current)cancelAnimationFrame(frame.current);},[]);
 return <div className="forma-scene"><div className="forma-scene-top"><span>FORMA / LIVE 3D VIEW</span><span>{config.width} × 780 mm</span></div><canvas ref={canvas} role="img" aria-label={`Interactive 3D workspace, ${config.width} millimetres wide with ${formaFinishes[config.finish].name}. Drag to rotate, or use arrow keys.`} tabIndex={0} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();setCamera(c=>({...c,yaw:c.yaw+(e.key==='ArrowLeft'?-.12:e.key==='ArrowRight'?.12:0),pitch:Math.max(.2,Math.min(.95,c.pitch+(e.key==='ArrowUp'?.07:e.key==='ArrowDown'?-.07:0)))}));}}} onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY,yaw:camera.yaw,pitch:camera.pitch};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{const start=drag.current;if(!start)return;const next={yaw:start.yaw+(e.clientX-start.x)/160,pitch:Math.max(.2,Math.min(.95,start.pitch+(e.clientY-start.y)/220))};if(frame.current)cancelAnimationFrame(frame.current);frame.current=requestAnimationFrame(()=>setCamera(c=>({...c,...next})));}} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}/><div className="forma-scene-bottom"><span>Drag to rotate · arrow keys also work</span><div><button aria-label="Zoom in" onClick={()=>setCamera(c=>({...c,zoom:Math.min(1.45,c.zoom+.1)}))}><ZoomIn size={17}/></button><button aria-label="Zoom out" onClick={()=>setCamera(c=>({...c,zoom:Math.max(.7,c.zoom-.1)}))}><ZoomOut size={17}/></button><button aria-label="Reset camera" onClick={()=>setCamera({yaw:-.65,pitch:.55,zoom:1})}><RotateCcw size={16}/></button></div></div></div>;
}
