import { FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa6";
import { BRAND, SOCIAL } from "@/lib/constants";
import { Reveal } from "@/components/ui/Reveal";

const links = [
  { label: "Instagram", href: SOCIAL.instagram, Icon: FaInstagram },
  { label: "TikTok", href: SOCIAL.tiktok, Icon: FaTiktok },
  { label: "Email", href: SOCIAL.email, Icon: FaEnvelope },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <Reveal standalone>
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-5 px-5 py-8 text-tiny uppercase tracking-wider text-text-secondary sm:flex-row sm:justify-between sm:px-10">
          <div className="flex flex-col items-center gap-1.5 sm:items-start">
            <span>© {BRAND} 2026</span>
            <address className="not-italic">
              Port Harcourt · Rivers State · Nigeria
            </address>
          </div>
          <nav className="flex items-center gap-7">
            {links.map(({ label, href, Icon }) => {
              const isMailto = href.startsWith("mailto:");
              return (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(isMailto
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="transition-colors duration-200 hover:text-gold"
                >
                  <Icon size={16} aria-hidden />
                </a>
              );
            })}
          </nav>
          <span>All Rights Reserved</span>
        </div>
      </Reveal>
    </footer>
  );
}
