import Link from "next/link";

export default function DemoShell({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return <main className="demo-page min-h-screen bg-black text-white px-5 py-8">
    <div className="max-w-6xl mx-auto">
      <Link href="/#projects" className="text-green-400 underline underline-offset-4">← Back to Yassir’s projects</Link>
      <p className="mt-10 mb-3 text-sm text-green-400">Working portfolio demo · Sample data available</p>
      <h1 className="text-3xl sm:text-5xl font-bold">{title}</h1>
      <p className="mt-4 max-w-3xl text-gray-300 leading-relaxed">{intro}</p>
      <p className="mt-3 mb-8 text-sm text-gray-400">Inputs are processed in this page and are not saved. This demo does not send messages or connect to external systems.</p>
      {children}
    </div>
  </main>;
}
