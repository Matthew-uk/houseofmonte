import { FaInstagram, FaRegEnvelope, FaTiktok } from "react-icons/fa6";
import { SOCIAL } from "@/lib/constants";

const LINKS = [
  { href: SOCIAL.instagram, label: "Instagram", text: SOCIAL.instagramHandle, Icon: FaInstagram },
  { href: SOCIAL.tiktok, label: "TikTok", text: SOCIAL.tiktokHandle, Icon: FaTiktok },
  { href: `mailto:${SOCIAL.email}`, label: "Email", text: SOCIAL.email, Icon: FaRegEnvelope },
];

// Monochrome icon + visible handle, so each link still reads without the icon.
export function SocialLinks() {
  return (
    <ul>
      {LINKS.map(({ href, label, text, Icon }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={`${label}: ${text}`}
            {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className="inline-flex min-h-11 items-center gap-3 text-ui transition-opacity duration-150 hover:opacity-70"
          >
            <Icon aria-hidden className="size-4 shrink-0" />
            {text}
          </a>
        </li>
      ))}
    </ul>
  );
}
