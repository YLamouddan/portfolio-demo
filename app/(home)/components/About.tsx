export default function About() {
  return <section id="about" aria-labelledby="about-title" className="py-20 border-t border-white/10 scroll-mt-8"><div className="grid gap-8 md:grid-cols-[1fr_2fr]">
    <div><p className="text-sm text-green-400 mb-3">A little about me</p><h2 id="about-title" className="text-3xl font-semibold">An engineer’s eye<br />for how work flows.</h2></div>
    <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-gray-300">
      <p>I’m Yassir, an electrical engineer working in software and automation. I’m drawn to the awkward gaps in a business: an enquiry waiting for a quote, an invoice nobody has checked, or information that has to be copied into three different places.</p>
      <p>My work brings those steps together. I map the process, build the software around it, and account for the exceptions, approvals, and handovers that make a system useful in practice.</p>
      <p>I enjoy owning the whole problem, from understanding what a team needs to getting a working system into their hands.</p>
    </div>
  </div></section>;
}
