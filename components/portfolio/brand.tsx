import Link from "next/link";

export default function Brand() {
  return <Link href="/" className="wordmark" aria-label="Yassir Lamouddan — home">
    <svg className="brand-symbol" viewBox="0 0 40 40" width="34" height="34" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="currentColor"/>
      <path d="M9 11L15 20L21 11M15 20V29M25 11V29H32" stroke="var(--on-accent)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className="brand-name">Yassir Lamouddan<span className="wordmark-dot">.</span></span>
  </Link>;
}
