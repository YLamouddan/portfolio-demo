export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-16 border-t border-white/10 scroll-mt-8">
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <h2 id="about-title" className="text-3xl font-bold">About me</h2>
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-gray-300">
          <p>I’m Yassir Lamouddan. I build automations and web tools around business needs: organising incoming enquiries, preparing follow-ups, and connecting systems so information doesn’t have to be entered twice.</p>
          <p>I start with the process. Where does work get stuck? What gets copied between spreadsheets? Which routine decisions follow a clear set of rules? Then I build a tool or workflow that fits the way people actually work.</p>
          <p>My background is in electrical engineering, with hands-on projects in web development, API integrations, and self-hosted infrastructure. You can try two business workflow demos here, alongside the personal systems I configure and maintain.</p>
          <p>I’m looking for opportunities to turn everyday operational problems into practical software and automation.</p>
          <a href="mailto:Ylamouddan@gmail.com" className="inline-block text-green-400 underline underline-offset-4">Get in touch</a>
        </div>
      </div>
    </section>
  );
}
