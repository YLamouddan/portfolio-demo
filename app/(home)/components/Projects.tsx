import Link from "next/link";

const projects = [
  {
    title: "Self-hosted infrastructure",
    category: "Infrastructure · Personal project",
    description: "A Docker Compose stack for running personal services on a VPS. It brings together a reverse proxy, identity management, and tunnel-based access, with separate networks for private services.",
    detail: "The work includes service configuration, access controls, deployment scripts, and operational documentation.",
    tech: ["Docker Compose", "Traefik", "Cloudflare", "Authentik", "Linux"],
  },
  {
    title: "Knowledge & task management",
    category: "Integrations · Personal project",
    description: "A self-hosted Obsidian workspace with task management and bidirectional note sync between the server and a local device.",
    detail: "TaskNotes exposes task operations through an API and MCP, providing a foundation for automated capture and task workflows.",
    tech: ["Obsidian", "CouchDB", "TaskNotes", "MCP", "Docker"],
  },
  {
    title: "Portfolio website",
    category: "Web development",
    description: "My personal site, built with Next.js and TypeScript to bring my projects, technical interests, and contact details into one place.",
    detail: "A responsive interface built with React components and Tailwind CSS, deployed on Vercel.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    link: "https://github.com/YLamouddan/portfolio-demo",
  },
];

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="py-16 scroll-mt-8">
      <p className="text-sm text-green-400 mb-3">Selected work</p>
      <h2 id="projects-title" className="text-3xl sm:text-4xl font-bold">Projects</h2>
      <p className="mt-4 max-w-2xl text-gray-300">Web development and the systems I configure and maintain for everyday use.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
        {projects.map((project) => (
          <article key={project.title} className="rounded-2xl border border-white/15 bg-zinc-950 p-6 flex flex-col">
            <p className="text-sm text-green-400">{project.category}</p>
            <h3 className="text-2xl font-semibold mt-4">{project.title}</h3>
            <p className="text-gray-300 leading-relaxed mt-4">{project.description}</p>
            <p className="text-gray-400 leading-relaxed mt-4">{project.detail}</p>
            <ul aria-label="Technologies" className="flex flex-wrap gap-2 mt-6 mb-6">
              {project.tech.map((tech) => <li key={tech} className="text-xs rounded-full border border-white/15 px-3 py-1.5 text-gray-300">{tech}</li>)}
            </ul>
            {project.link ? <Link href={project.link} className="mt-auto text-green-400 underline underline-offset-4">View source on GitHub <span aria-hidden="true">↗</span></Link> : <p className="mt-auto text-sm text-gray-400">Private project · Details available on request</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
