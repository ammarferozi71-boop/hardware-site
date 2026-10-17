import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import data from '@/content/tools/compatibility.json';
import { isPublishable } from '@/lib/tools/validate.mjs';
import type { Dataset } from '@/lib/tools/types';
import { CompatibilityChecker, type PartRow, type RuleRow } from '@/components/tools/CompatibilityChecker';
import { ToolSources } from '@/components/tools/ToolSources';
import { SITE_NAME, SITE_URL_RESOLVED } from '@/lib/site';

export const revalidate = 3600;

const ds = data as unknown as Dataset<PartRow> & { rules: RuleRow[] };
const URL_PATH = '/tools/compatibility-checker';
const publishable = () => isPublishable(ds) && Array.isArray(ds.rules) && ds.rules.length > 0;

export function generateMetadata(): Metadata {
  if (!publishable()) return { title: 'Not found', robots: { index: false, follow: false } };
  return {
    title: 'PC Part Compatibility Checker: GPU, Board, PSU and RAM',
    description: 'Check whether a graphics card, motherboard, power supply, CPU, memory and case work together, using makers’ own spec pages for every result.',
    alternates: { canonical: SITE_URL_RESOLVED + URL_PATH },
  };
}

export default function CompatibilityCheckerPage() {
  if (!publishable()) notFound();
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'WebApplication', name: `${SITE_NAME} compatibility checker`,
    url: SITE_URL_RESOLVED + URL_PATH, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/" className="text-sm text-primary">Home</Link>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight">PC part compatibility checker</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Pick the parts you have or plan to buy. Each result is based on the makers&apos; own spec pages and links to them.
        It checks fit and power, not game performance.
      </p>
      <CompatibilityChecker parts={ds.rows} rules={ds.rules} />
      <ToolSources facts={ds.facts} generatedAt={ds.generated_at} />
    </article>
  );
}
