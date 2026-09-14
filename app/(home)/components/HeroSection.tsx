import Link from "next/link";
export default function HeroSection() {
  return <section className="py-16 sm:py-24 lg:py-28 max-w-5xl">
    <p className="text-sm text-green-400 tracking-wide mb-6">Yassir Lamouddan · Engineering, software & automation</p>
    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight">I turn manual workflows<br className="hidden sm:block" /> into <span className="decoration-green-500 underline underline-offset-8">working systems.</span></h1>
    <p className="mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-gray-300">When sales, operations, and software don’t talk to each other, people fill the gaps. I build the connections, workflows, and tools that let the work move forward.</p>
    <div className="flex flex-wrap gap-4 mt-9"><Link href="#projects" className="demo-button inline-flex items-center gap-5">Explore my work <span aria-hidden="true">↗</span></Link><Link href="mailto:Ylamouddan@gmail.com" className="demo-secondary inline-flex items-center">Let’s talk</Link></div>
    <p className="mt-8 text-sm text-gray-500">Business automation <span className="mx-3 text-green-600">/</span> Custom software <span className="mx-3 text-green-600">/</span> Connected systems</p>
  </section>;
}
