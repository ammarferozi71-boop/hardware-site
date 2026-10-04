import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL_RESOLVED } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Editorial standards',
  description: `How ${SITE_NAME} sources hardware specifications and game requirements, and how corrections are handled.`,
  alternates: { canonical: SITE_URL_RESOLVED + '/editorial-standards' },
};

const heading = 'text-2xl font-semibold';
const paragraph = 'mt-3 leading-relaxed text-muted-foreground';

export default function EditorialStandardsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/" className="text-sm text-primary">Home</Link>
      <h1 className="mt-5 text-4xl font-bold tracking-tight">Editorial standards</h1>

      <section className="mt-8">
        <h2 className={heading}>Sources</h2>
        <p className={paragraph}>
          Specifications come from hardware manufacturers. Game requirements come from publishers and
          official store pages. When a figure reaches us through another publication, the guide names
          it.
        </p>
      </section>

      <section className="mt-8">
        <h2 className={heading}>No hands-on claims</h2>
        <p className={paragraph}>
          We do not present benchmark numbers or performance results as our own. Typical speeds and
          recommended wattages are described as typical or recommended, and you should confirm the
          figures for the exact product you are buying.
        </p>
      </section>

      <section className="mt-8">
        <h2 className={heading}>Charts and illustrations</h2>
        <p className={paragraph}>
          Charts that show official figures say so. Diagrams that explain an idea, without measured
          data behind them, are labelled as illustrations.
        </p>
      </section>

      <section className="mt-8">
        <h2 className={heading}>Buying advice</h2>
        <p className={paragraph}>
          Our advice is general. Prices, stock and product revisions change, so check the current
          listing and the manufacturer&apos;s compatibility information before you buy.
        </p>
      </section>

      <section className="mt-8">
        <h2 className={heading}>Updates and corrections</h2>
        <p className={paragraph}>
          When a guide is updated, its updated date changes with it. If you spot an error, tell us with
          a link to the correct source and we will fix it.
        </p>
      </section>
    </article>
  );
}
