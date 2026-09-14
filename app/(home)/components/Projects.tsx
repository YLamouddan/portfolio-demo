import Link from "next/link";

const projects = [
  {
    title: "Invoice follow-up planner",
    category: "Business automation · Working demo",
    description: "An unpaid-invoice spreadsheet can turn into a manual chase list. This tool validates CSV data, calculates overdue days, and puts the oldest invoices first.",
    detail: "Try it with fictional invoices, review follow-up drafts, and export a prioritised plan. No emails are sent.",
    tech: ["TypeScript", "React", "CSV processing", "Workflow rules"],
    link: "/projects/invoice-follow-up",
    linkLabel: "Try the invoice planner",
  },
  {
    title: "Lead intake & routing",
    category: "Business automation · Working demo",
    description: "Incoming enquiries need a clear owner and next action. This tool routes them by service, budget, and urgency, with a visible explanation for each decision.",
    detail: "Adjust the qualification rules, generate a reply draft, and export the enquiry for CRM import. Includes a fictional sample enquiry.",
    tech: ["TypeScript", "React", "Form validation", "CSV export"],
    link: "/projects/lead-routing",
    linkLabel: "Try the lead router",
  },
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
    title: "Private AI assistant environment",
    category: "AI tooling · Personal integration",
    description: "A privately hosted Hermes assistant with a model gateway and separate container networks for provider access and internal communication.",
    detail: "My work focuses on deploying and integrating the existing tools, configuring private access, and maintaining the environment.",
    tech: ["Hermes", "OmniRoute", "Docker", "Tailscale", "Linux"],
  },
];

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="py-16 scroll-mt-8">
      <p className="text-sm text-green-400 mb-3">Selected work</p>
      <h2 id="projects-title" className="text-3xl sm:text-4xl font-bold">Projects</h2>
      <p className="mt-4 max-w-2xl text-gray-300">Try the business workflow demos, then explore the personal infrastructure and integrations behind my work. The demos use fictional sample data and are independent portfolio projects.</p>
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
            {project.link ? <Link href={project.link} className="mt-auto text-green-400 underline underline-offset-4">{project.linkLabel} <span aria-hidden="true">→</span></Link> : <p className="mt-auto text-sm text-gray-400">Private project · Details available on request</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
