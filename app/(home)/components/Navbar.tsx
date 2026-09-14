import React from "react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Navbar({ className }: { className?: string }) {
  const socials = [
    {
      link: "https://linkedin.com/in/YLamouddan",
      label: "Linkedin",
      icon: SiLinkedin,
    },
    {
      link: "https://github.com/YLamouddan",
      label: "Github",
      icon: SiGithub,
    },
    {
      link: "https://twitter.com/YLamouddan",
      label: "Twitter",
      icon: SiX,
    },
  ];

  return (
    <nav className={cn(" py-8 flex flex-wrap gap-6 justify-between items-center", className)}>
      <p className="text-lg sm:text-2xl font-bold underline underline-offset-8 decoration-green-500">
        Yassir Lamouddan
      </p>
      <div className="flex items-center gap-5">
        {socials.map((social, index) => {
          const Icon = social.icon;

          return (
            <Link href={social.link} key={index} aria-label={social.label}>
              <Icon className="w-5 h-5 hover:scale-125 transition-all" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
