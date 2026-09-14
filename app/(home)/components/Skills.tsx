const groups = [
  { title: "Web development", tools: "React, Next.js, TypeScript, JavaScript, Tailwind CSS, HTML, CSS" },
  { title: "Infrastructure & integrations", tools: "Docker Compose, Linux, Cloudflare, Traefik, Authentik, CouchDB, APIs, MCP" },
  { title: "Engineering & tooling", tools: "Python, Git, GitHub, Arduino, MATLAB, AutoCAD" },
];

export default function Skills() {
  return (
    <section aria-labelledby="skills-title" className="py-16 border-t border-white/10">
      <h2 id="skills-title" className="text-3xl font-bold">Tools I work with</h2>
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {groups.map((group) => <div key={group.title}><h3 className="text-lg font-semibold text-green-400">{group.title}</h3><p className="mt-3 text-gray-300 leading-relaxed">{group.tools}</p></div>)}
      </div>
    </section>
  );
}
