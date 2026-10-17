'use client';

import { useMemo, useState } from 'react';
import { checkBuild } from '@/lib/tools/compat.mjs';
import type { BaseRow } from '@/lib/tools/types';

export type PartType = 'gpu' | 'cpu' | 'motherboard' | 'ram' | 'psu' | 'case';
export interface PartRow extends BaseRow { part_type: PartType; model: string; specs: Record<string, unknown> }
export interface RuleRow { rule_key: string; description: string; logic: { type: string }; fact_ids: number[] }
type Result = { rule_key: string; verdict: 'ok' | 'note' | 'warn' | 'fail'; message: string; fact_ids: number[] };

const SLOTS: { key: PartType; label: string }[] = [
  { key: 'gpu', label: 'Graphics card' },
  { key: 'motherboard', label: 'Motherboard' },
  { key: 'psu', label: 'Power supply' },
  { key: 'cpu', label: 'CPU' },
  { key: 'ram', label: 'Memory' },
  { key: 'case', label: 'Case' },
];
const STYLE: Record<Result['verdict'], string> = {
  ok: 'border-green-600/40 bg-green-600/5',
  note: 'border-sky-600/40 bg-sky-600/5',
  warn: 'border-amber-600/50 bg-amber-600/5',
  fail: 'border-red-600/50 bg-red-600/5',
};
const LABEL: Record<Result['verdict'], string> = { ok: 'Works', note: 'Works, with a note', warn: 'Check this', fail: 'Problem' };

export function CompatibilityChecker({ parts, rules }: { parts: PartRow[]; rules: RuleRow[] }) {
  const [picked, setPicked] = useState<Partial<Record<PartType, number>>>({});
  const selection = useMemo(() => {
    const s: Partial<Record<PartType, PartRow>> = {};
    for (const slot of SLOTS) {
      const id = picked[slot.key];
      const p = parts.find((x) => x.id === id);
      if (p) s[slot.key] = p;
    }
    return s;
  }, [picked, parts]);
  const report = checkBuild(selection, rules) as { overall: Result['verdict']; results: Result[] };

  return (
    <div className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {SLOTS.map((slot) => {
          const options = parts.filter((p) => p.part_type === slot.key);
          if (!options.length) return null;
          return (
            <label key={slot.key} className="block text-sm font-medium">
              {slot.label}
              <select
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm font-normal"
                value={picked[slot.key] ?? ''}
                onChange={(e) => setPicked((p) => ({ ...p, [slot.key]: e.target.value ? Number(e.target.value) : undefined }))}
              >
                <option value="">Not chosen</option>
                {options.map((o) => <option key={o.id} value={o.id}>{o.model}</option>)}
              </select>
            </label>
          );
        })}
      </div>

      <div className="mt-8" aria-live="polite">
        {report.results.length === 0 ? (
          <p className="text-muted-foreground">Choose at least two parts to see the checks.</p>
        ) : (
          <ul className="space-y-3">
            {report.results.map((r) => (
              <li key={r.rule_key} className={`rounded-md border p-4 ${STYLE[r.verdict]}`}>
                <p className="text-sm font-semibold">{LABEL[r.verdict]}</p>
                <p className="mt-1">{r.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Based on:{' '}
                  {r.fact_ids.map((id) => <a key={id} href={`#source-${id}`} className="mr-1 underline-offset-2 hover:underline">[{id}]</a>)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
