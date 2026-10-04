import Link from 'next/link';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

const FOOTER_NAV = [
  {
    title: 'Parts',
    links: [
      { label: 'Graphics cards', href: '/gpu' },
      { label: 'Processors', href: '/cpu' },
      { label: 'Memory', href: '/memory' },
      { label: 'Storage', href: '/storage' },
      { label: 'Power supplies', href: '/power' },
      { label: 'Monitors', href: '/monitors' },
    ],
  },
  {
    title: 'Browse',
    links: [
      { label: 'All topics', href: '/topics' },
      { label: 'Search', href: '/search' },
      { label: 'RSS feed', href: '/rss.xml' },
      { label: 'Sitemap', href: '/sitemap.xml' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: `About ${SITE_NAME}`, href: '/about' },
      { label: 'Editorial standards', href: '/editorial-standards' },
      ...(CONTACT_EMAIL ? [{ label: 'Contact', href: '/contact' }] : []),
      { label: 'Privacy policy', href: '/privacy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="text-xl font-bold tracking-tight">{SITE_NAME}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              PC parts explained in plain language, for the games you play.
            </p>
          </div>
          {FOOTER_NAV.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_NAME}. Product names and trademarks belong to their owners.
        </p>
      </div>
    </footer>
  );
}
