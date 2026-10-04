import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL_RESOLVED } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: `${SITE_NAME} explains PC hardware in plain language, using what games officially ask for.`,
  alternates: { canonical: SITE_URL_RESOLVED + '/about' },
};

const heading = 'text-2xl font-semibold';
const paragraph = 'mt-3 leading-relaxed text-muted-foreground';

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/" className="text-sm text-primary">Home</Link>
      <h1 className="mt-5 text-4xl font-bold tracking-tight">About {SITE_NAME}</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {SITE_NAME} helps PC players work out which part to upgrade and what to check before buying it.
      </p>

      <section className="mt-8">
        <h2 className={heading}>What we cover</h2>
        <p className={paragraph}>
          Graphics cards, processors, memory, storage, power supplies and monitors. Each guide answers
          one question, such as how much memory new games ask for or how many watts a graphics card
          needs.
        </p>
      </section>

      <section className="mt-8">
        <h2 className={heading}>Where the information comes from</h2>
        <p className={paragraph}>
          Guides are built from manufacturer specifications and the official PC requirements that
          publishers list for their games. When a guide quotes specific figures, its sources are linked
          at the end.
        </p>
      </section>

      <section className="mt-8">
        <h2 className={heading}>What we do not do</h2>
        <p className={paragraph}>
          We do not publish benchmark results or review scores, because we have not tested this hardware
          ourselves. Charts on this site show official requirements, typical specifications or simple
          illustrations, and each one says which.
        </p>
      </section>

      <nav className="mt-10 flex flex-wrap gap-5 text-primary">
        <Link href="/editorial-standards">Editorial standards</Link>
        <Link href="/privacy">Privacy policy</Link>
      </nav>
    </article>
  );
}
