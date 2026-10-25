import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { portfolioProjects } from "@/lib/portfolio-projects";
import LabDemo from "@/components/portfolio/lab-demos";
import ProjectArt from "@/components/portfolio/project-art";
export function generateStaticParams() { return portfolioProjects.map(project=>({slug:project.slug})); }
export function generateMetadata({params}:{params:{slug:string}}):Metadata {
  const project=portfolioProjects.find(p=>p.slug===params.slug);
  if(!project)return {title:"Project not found"};
  return {title:`${project.title} — ${project.category} | Yassir Lamouddan`,description:project.summary,openGraph:{title:`${project.title} | Yassir Lamouddan`,description:project.summary,url:`https://ylamouddan.com/work/${project.slug}`,images:[]}};
}
export default function Page({params}:{params:{slug:string}}) {
  const project=portfolioProjects.find(p=>p.slug===params.slug);
  if(!project)notFound();
  const next=portfolioProjects[(portfolioProjects.indexOf(project)+1)%portfolioProjects.length];
  return <div className="portfolio lab-page"><a className="skip-navigation" href="#project-main">Skip to project</a><header className="portfolio-header"><nav className="page-width" aria-label="Project navigation"><Link className="wordmark" href="/">Yassir Lamouddan<span className="wordmark-dot">.</span></Link><Link className="text-link" href="/#work"><ArrowLeft size={15} aria-hidden="true"/>All projects</Link></nav></header><main id="project-main" className="page-width"><div className="case-heading"><p className="eyebrow">{project.category} / Independent prototype</p><h1>{project.title}<span>.</span></h1><p className="case-headline">{project.headline}</p><p className="case-summary">{project.summary}</p><a className="text-link" href="#interactive-demo">Try the prototype ↓</a></div><div className="case-overview"><ProjectArt kind={project.slug}/><div><section><h2>The problem</h2><p>{project.problem}</p></section><section><h2>The engineering decision</h2><p>{project.decision}</p></section><ul className="project-tags" aria-label="Techniques">{project.tools.map(tool=><li key={tool}>{tool}</li>)}</ul></div></div><p className="try-this"><strong>Try this:</strong> {project.tryThis}</p><LabDemo kind={project.slug}/><noscript><p className="empty-result">This prototype needs JavaScript for its interactive controls. The problem, engineering decisions and scope are available above and below.</p></noscript><section className="case-scope"><h2>Scope, clearly stated.</h2><p>{project.limit}</p></section><div className="case-next"><Link href={`/work/${next.slug}`}>Next project <strong>{next.title} <ArrowUpRight size={24} aria-hidden="true"/></strong></Link><a className="text-link" href="mailto:Ylamouddan@gmail.com">Discuss a job or project <ArrowUpRight size={17} aria-hidden="true"/></a></div></main><footer className="portfolio-footer page-width"><Link href="/">Yassir Lamouddan</Link><a href="https://github.com/YLamouddan">GitHub ↗</a></footer></div>;
}
