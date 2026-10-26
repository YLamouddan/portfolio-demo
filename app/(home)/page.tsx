import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SiPython, SiReact, SiTypescript, SiDocker, SiLinux, SiGit } from "react-icons/si";
import AppearanceControls from "@/components/portfolio/appearance-controls";
import ScrollIntro from "@/components/portfolio/scroll-intro";
import ProjectArt from "@/components/portfolio/project-art";
import { portfolioProjects } from "@/lib/portfolio-projects";

export default function Page() {
  return <div className="portfolio">
    <a className="skip-navigation" href="#main-content">Skip to content</a>
    <header className="portfolio-header"><nav className="page-width" aria-label="Main navigation"><Link href="/" className="wordmark">Yassir Lamouddan<span className="wordmark-dot">.</span></Link><div className="nav-links"><a href="#work">Work</a><AppearanceControls/><a href="#about">About</a><a href="#contact" className="nav-contact">Let’s talk <ArrowUpRight size={15} aria-hidden="true" /></a></div></nav></header>
    <main id="main-content">
      <ScrollIntro />
      <section id="work" className="work-section page-width" aria-labelledby="work-heading">
        <div className="section-heading"><div><p className="eyebrow">What I can build for you</p><h2 id="work-heading">Business problems.<br />Working solutions.</h2></div><p>Four independent projects you can use: compare research, clean a supplier catalogue, extract a document and reconcile two business systems. Explore the input, the result, and what happens when something needs review.</p></div>
        <div className="work-list">{portfolioProjects.map(project=><article key={project.slug} className="work-row"><Link href={`/work/${project.slug}`} className="work-art-link" aria-label={`Explore ${project.title}`}><ProjectArt kind={project.slug} /><span className="art-open"><ArrowUpRight size={22} aria-hidden="true" /></span></Link><div className="work-copy"><div className="work-category">{project.category}<span>Interactive showcase</span></div><h3>{project.title}</h3><p className="work-headline">{project.headline}</p><p className="work-summary">{project.summary}</p><ul className="project-tags" aria-label={`${project.title} techniques`}>{project.tools.map(tool=><li key={tool}>{tool}</li>)}</ul><Link className="text-link" href={`/work/${project.slug}`}>Explore the product <ArrowRight size={17} aria-hidden="true" /></Link></div></article>)}</div>
      </section>
      <section id="about" className="about-section" aria-labelledby="about-heading"><div className="page-width about-grid"><div><p className="eyebrow">A little context</p><h2 id="about-heading">Practical thinking.<br />Useful software.</h2></div><div className="about-copy"><p>I work on the parts of a business that keep slowing people down.</p><p>That might be supplier data that needs cleaning every week, details copied out of documents, or the same update entered into several tools. I start by understanding the work and why it gets stuck, then build around the way the team needs it to run.</p><p>My background in electrical engineering and process improvement shapes how I build software: trace the cause, make the result easy to check, and account for the exceptions people will still need to handle.</p><div className="tool-strip" aria-label="Tools I work with">{[{name:"Python",Icon:SiPython},{name:"React",Icon:SiReact},{name:"TypeScript",Icon:SiTypescript},{name:"Docker",Icon:SiDocker},{name:"Linux",Icon:SiLinux},{name:"Git",Icon:SiGit}].map(({name,Icon})=><span key={name}><Icon aria-hidden="true" />{name}</span>)}</div></div></div></section>
      <section id="contact" className="contact-section page-width" aria-labelledby="contact-heading"><p className="eyebrow">Jobs, projects & good problems</p><div className="contact-grid"><h2 id="contact-heading">What could we<br /><span>make work?</span></h2><div><p>Tell me what takes too much time, what your clients find confusing, or what you want your website to do better. We can start there.</p><a className="primary-link" href="mailto:Ylamouddan@gmail.com">Discuss an opportunity <ArrowUpRight size={20} aria-hidden="true" /></a><a className="contact-email" href="mailto:Ylamouddan@gmail.com">Ylamouddan@gmail.com</a></div></div></section>
    </main>
    <footer className="portfolio-footer page-width"><span>Yassir Lamouddan · Websites & automation.</span><div><a href="https://linkedin.com/in/YLamouddan">LinkedIn <ArrowUpRight size={13} aria-hidden="true" /></a><a href="https://github.com/YLamouddan">GitHub <ArrowUpRight size={13} aria-hidden="true" /></a><a href="#main-content">Back to top ↑</a></div></footer>
  </div>;
}
