'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { useSearch } from '@/components/search/SearchProvider';
import { SITE_NAME } from '@/lib/site';

const NAV_ITEMS = [
  { label: 'Graphics cards', href: '/gpu' },
  { label: 'Processors', href: '/cpu' },
  { label: 'Memory', href: '/memory' },
  { label: 'Storage', href: '/storage' },
  { label: 'Power supplies', href: '/power' },
  { label: 'Monitors', href: '/monitors' },
];

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <rect x="6" y="6" width="20" height="20" rx="5" fill="hsl(var(--primary))" />
      <rect x="12" y="12" width="8" height="8" rx="2" fill="hsl(var(--accent))" />
      <path d="M11 2v4M16 2v4M21 2v4M11 26v4M16 26v4M21 26v4M2 11h4M2 16h4M2 21h4M26 11h4M26 16h4M26 21h4" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openSearch } = useSearch();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE_NAME} home`}>
          <Logo />
          <span className="text-2xl font-bold tracking-tight">{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={openSearch}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute right-0 top-0 h-full w-72 max-w-full bg-background p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{SITE_NAME}</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
