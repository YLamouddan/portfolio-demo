import { SiPython, SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiDocker, SiCloudflare, SiLinux, SiGit } from "react-icons/si";
import { Bot, Cable, Workflow } from "lucide-react";
const groups = [
  { title: "AI & automation", tools: [{ name: "Python", icon: SiPython }, { name: "Hermes", icon: Bot }, { name: "APIs", icon: Cable }, { name: "MCP", icon: Workflow }] },
  { title: "Web & applications", tools: [{ name: "React", icon: SiReact }, { name: "Next.js", icon: SiNextdotjs }, { name: "TypeScript", icon: SiTypescript }, { name: "Tailwind", icon: SiTailwindcss }] },
  { title: "Cloud & infrastructure", tools: [{ name: "Docker", icon: SiDocker }, { name: "Cloudflare", icon: SiCloudflare }, { name: "Linux", icon: SiLinux }, { name: "Git", icon: SiGit }] },
];
export default function Skills() {
  return <section aria-labelledby="skills-title" className="py-16 border-t border-white/10"><div className="mb-9"><p className="text-sm text-green-400 mb-3">Tools & experience</p><h2 id="skills-title" className="text-3xl font-semibold">The toolkit behind the work.</h2></div>
    <div className="grid lg:grid-cols-3 gap-8">{groups.map((group) => <div key={group.title}><h3 className="text-sm text-gray-400 mb-4">{group.title}</h3><div className="grid grid-cols-2 gap-3">{group.tools.map(({name, icon: Icon}) => <div key={name} className="flex gap-3 items-center rounded-xl border border-white/10 p-4 transition-colors hover:border-green-400/50 hover:bg-green-400/5"><Icon className="h-6 w-6 text-green-400" aria-hidden="true" /><span className="text-sm text-gray-200">{name}</span></div>)}</div></div>)}</div>
  </section>;
}
