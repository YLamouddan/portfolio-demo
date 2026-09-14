import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projectNotes } from "@/lib/project-notes";

type Slug = keyof typeof projectNotes;
function getProject(slug: string) { return Object.prototype.hasOwnProperty.call(projectNotes, slug) ? projectNotes[slug as Slug] : undefined; }
export function generateStaticParams() { return Object.keys(projectNotes).map((slug) => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProject(params.slug);
  if (!project) return { title: "Project not found" };
  const title = `${project.title} | Yassir Lamouddan`, description = project.summary;
  return { title, description, openGraph: { title, description, url: `https://ylamouddan.com/projects/${params.slug}`, images: [] }, twitter: { card: "summary", title, description, images: [] } };
}
export default function Page({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();
  return <main className="bg-black text-white min-h-screen px-5 py-10"><div className="max-w-4xl mx-auto"><Link href="/#projects" className="text-sm text-green-400">← Back to projects</Link><p className="mt-16 text-sm text-green-400">Private project · Overview</p><h1 className="text-4xl sm:text-6xl font-semibold tracking-tight mt-4">{project.title}</h1><p className="text-xl text-gray-300 mt-6">{project.summary}</p><p className="text-gray-400 leading-relaxed mt-8 max-w-3xl">{project.intro}</p>
    <ol aria-label="System workflow" className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-10">{project.steps.map((step, i) => <li key={step} className="ops-panel p-5"><span className="text-xs text-green-400">0{i+1}</span><p className="mt-4 text-sm">{step}</p></li>)}</ol>
    <div className="space-y-8 py-8 border-t border-white/10">{project.features.map((feature) => <section key={feature.title} className="grid sm:grid-cols-[1fr_2fr] gap-4"><h2 className="font-semibold">{feature.title}</h2><p className="text-gray-400 leading-relaxed">{feature.text}</p></section>)}</div><p className="text-sm text-gray-500 border-t border-white/10 pt-6">{project.scope}</p><Link href="mailto:Ylamouddan@gmail.com" className="demo-button inline-block mt-10">Discuss a similar project</Link></div></main>;
}
