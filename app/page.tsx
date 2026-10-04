import Link from 'next/link';
import Image from 'next/image';
import { getLatestArticles, getFeaturedArticles } from '@/lib/queries';
import { getArticleUrl, thumbFor, SITE_URL_RESOLVED, SITE_NAME } from '@/lib/site';
import type { ArticleWithRelations } from '@/lib/types';

export const revalidate = 300;

const PARTS = [
  {
    href: '/gpu',
    name: 'Graphics card',
    question: 'Which card do new games ask for?',
    icon: (
      <>
        <rect x="3" y="9" width="26" height="14" rx="3" />
        <circle cx="12" cy="16" r="3.5" />
        <circle cx="21" cy="16" r="3.5" />
      </>
    ),
  },
  {
    href: '/cpu',
    name: 'Processor',
    question: 'Is my processor holding me back?',
    icon: (
      <>
        <rect x="8" y="8" width="16" height="16" rx="3" />
        <rect x="13" y="13" width="6" height="6" rx="1" />
        <path d="M12 4v4M16 4v4M20 4v4M12 24v4M16 24v4M20 24v4M4 12h4M4 16h4M4 20h4M24 12h4M24 16h4M24 20h4" />
      </>
    ),
  },
  {
    href: '/memory',
    name: 'Memory',
    question: 'Is 16 GB still enough?',
    icon: (
      <>
        <rect x="3" y="10" width="26" height="10" rx="2" />
        <path d="M8 13v4M13 13v4M18 13v4M23 13v4M6 20v3M11 20v3M21 20v3M26 20v3" />
      </>
    ),
  },
  {
    href: '/storage',
    name: 'Storage',
    question: 'Do I need a faster SSD?',
    icon: (
      <>
        <rect x="5" y="5" width="22" height="22" rx="4" />
        <circle cx="16" cy="14" r="5" />
        <path d="M10 23h6" />
      </>
    ),
  },
  {
    href: '/power',
    name: 'Power supply',
    question: 'How many watts do I need?',
    icon: <path d="M18 3 7 18h8l-1 11 11-15h-8z" />,
  },
  {
    href: '/monitors',
    name: 'Monitor',
    question: 'What does 144 Hz change?',
    icon: (
      <>
        <rect x="3" y="5" width="26" height="17" rx="3" />
        <path d="M11 27h10M16 22v5" />
      </>
    ),
  },
];

function GuideCard({ article }: { article: ArticleWithRelations }) {
  return (
    <Link
      href={getArticleUrl(article)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-shadow hover:shadow-lg"
    >
      {article.hero_image && (
        <Image
          src={thumbFor(article.hero_image)}
          alt=""
          width={600}
          height={338}
          className="h-auto w-full border-b border-border"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm font-medium text-primary">{article.category?.name}</p>
        <h3 className="mt-1.5 text-lg font-semibold leading-snug group-hover:text-primary">{article.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [articles, featured] = await Promise.all([getLatestArticles(40), getFeaturedArticles(1)]);
  const lead = featured[0] || articles[0] || null;
  const rest = articles.filter((a) => a.id !== lead?.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL_RESOLVED,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Pick the right PC parts for the games you play
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Plain answers about graphics cards, memory, storage and power, based on what games officially ask for.
          </p>

          <h2 className="mt-10 text-xl font-semibold">What are you upgrading?</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PARTS.map((part) => (
              <li key={part.href}>
                <Link
                  href={part.href}
                  className="flex h-full flex-col rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary"
                >
                  <svg
                    viewBox="0 0 32 32"
                    className="h-10 w-10 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {part.icon}
                  </svg>
                  <span className="mt-3 text-base font-semibold">{part.name}</span>
                  <span className="mt-1 text-sm leading-snug text-muted-foreground">{part.question}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {lead && (
        <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
          <Link
            href={getArticleUrl(lead)}
            className="group grid overflow-hidden rounded-3xl border border-border md:grid-cols-2"
          >
            {lead.hero_image && (
              <Image
                src={lead.hero_image}
                alt={lead.hero_image_alt || ''}
                width={1600}
                height={900}
                priority
                className="h-full w-full object-cover"
              />
            )}
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <p className="inline-flex w-fit rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
                Start here
              </p>
              <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight group-hover:text-primary sm:text-3xl">
                {lead.title}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{lead.excerpt}</p>
              <p className="mt-5 font-semibold text-primary">Read the guide</p>
            </div>
          </Link>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">All guides</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <GuideCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
