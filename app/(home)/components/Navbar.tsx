import React from 'react';
import { SiGithub, SiLinkedin, SiTwitter } from 'react-icons/si';
import { FaFilePdf } from 'react-icons/fa6';
import Link from 'next/link';

export default function Navbar() {
  const socials = [
    {
      link: 'https://www.Linkedin.com/in/iyassir',
      label: 'Linkedin',
      icon: SiLinkedin,
    },
    {
      link: 'https://github.com/YLamouddan',
      label: 'Github',
      icon: SiGithub,
    },
    {
      link: 'https://twitter.com/YLamouddan',
      label: 'Twitter',
      icon: SiTwitter,
    },
    {
      link: 'https://YLamouddan.com',
      label: 'Resume',
      icon: FaFilePdf,
    },
  ];

  return (
    <nav>
      <h1>YLmaouddan ‍♂️⚡️‍</h1>
      <div>
        {socials.map((social, index) => (
          <Link
            href={social.link}
            key={index}
            aria-label={social.label}
          >
            {social.icon} {social.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
