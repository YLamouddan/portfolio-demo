export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-16 border-t border-white/10 scroll-mt-8">
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <h2 id="about-title" className="text-3xl font-bold">About me</h2>
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-gray-300">
          <p>I’m Yassir Lamouddan, a web developer with a background in electrical engineering. My projects range from React interfaces to the infrastructure that keeps my personal services running.</p>
          <p>Recently, I’ve been working with Docker, self-hosted tools, and API integrations. My setup includes a private knowledge base and task management system, which gives me practical problems to solve around sync, access, and automation.</p>
          <p>I’m interested in opportunities where I can build useful software and keep developing my engineering skills.</p>
          <a href="mailto:Ylamouddan@gmail.com" className="inline-block text-green-400 underline underline-offset-4">Get in touch</a>
        </div>
      </div>
    </section>
  );
}
