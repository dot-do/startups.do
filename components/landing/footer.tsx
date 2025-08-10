import React from 'react';
import { FaYoutube, FaDiscord, FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";

interface SocialLink {
  name: string;
  href: string;
  icon: 'youtube' | 'discord' | 'github' | 'xtwitter' | 'linkedin';
}

interface FooterProps {
  companyName?: string;
  copyright?: string;
  socialLinks?: SocialLink[];
}

const iconMap = {
  youtube: FaYoutube,
  discord: FaDiscord,
  github: FaGithub,
  xtwitter: FaXTwitter,
  linkedin: FaLinkedin,
};

const defaultSocialLinks: SocialLink[] = [
  { name: 'YouTube', href: '#', icon: 'youtube' },
  { name: 'Discord', href: '#', icon: 'discord' },
  { name: 'GitHub', href: '#', icon: 'github' },
  { name: 'X (Twitter)', href: '#', icon: 'xtwitter' },
  { name: 'LinkedIn', href: '#', icon: 'linkedin' },
];

const Footer: React.FC<FooterProps> = ({
  companyName = 'do.industries, Inc.',
  copyright,
  socialLinks = defaultSocialLinks,
}) => {
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright || `© ${currentYear} ${companyName} All rights reserved.`;

  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center gap-x-6 md:order-2">
          {socialLinks.map((item) => {
            const IconComponent = iconMap[item.icon];
            return (
              <a 
                key={item.name} 
                href={item.href} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">{item.name}</span>
                <IconComponent className="size-5" aria-hidden="true" />
              </a>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm/6 text-muted-foreground md:order-1 md:mt-0">
          {copyrightText}
        </p>
      </div>
    </footer>
  );
};

export { Footer };
  