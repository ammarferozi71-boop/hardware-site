# Rigwise development upgrade

Branch: `upgrade/p0-p5-local`. No deployment or publishing has been performed.

Tool route: `/tools/cpu-compatibility`.

The CPU checker requires current manufacturer records. Matching sockets do not prove CPU support: a CPU support listing and minimum BIOS are required. Electrical, cooling and clearance compatibility remain explicit review items.

Framework: Next.js 16.4.3, React 18.2 retained for compatibility. React 18 is deprecated by Next.js 16 but remains supported by this release. Dynamic route parameters and search parameters use the asynchronous contract. ESLint 9 uses eslint.config.mjs. The selector-parser override addresses the remaining dependency advisory while preserving Tailwind 3; the full local build verifies the generated CSS path.

Security: JSON-LD escapes script delimiters. Search aborts obsolete requests and cleans up on close; carousel state subscribes to external API events. Locked dependencies have been refreshed. Run npm audit again at deployment review, since advisories change.

Verification commands: `npm run test:tools`, `npm run lint`, `npm run typecheck`, and `npm run build:verify`. The verification build uses existing local image files and does not run the optional image downloader. Standard build retains the existing image preparation step. Set PIXELFORGE_LOCAL_BUILD=1 to bound local build workers. No production credentials are needed for these tool checks.

Dataset: content/decision-tool-data.json contains no invented product facts. The central migration_runner/tool_export.py maps existing shared tool/fact snapshots into private development datasets and rejects retired, stale, conflicting or foreign-site evidence. The exporter is not an activated sync. Confirm dataset sources, freshness policy, scope and actual manufacturer/provider wording before adding records.

The data-dependent tool pages remain noindex for this preview candidate. Small sourced datasets are included with seven-day expiry; wider catalog coverage and independent production review remain separate. The Preload converter uses the supplied timestamp and has a canonical URL and sitemap entry. Schema checks, fixture tests and empty-state UI do not prove real-world factual accuracy, rankings or production readiness.

Next activation review: confirm the verified data source; run browser interaction tests using the approved dataset; review deployment settings and rollback; obtain explicit approval before pushing where GitHub triggers a Vercel preview. No site changes are live.

The 26 October continuation adds source-backed pilot records and minute-by-minute expiry rechecks. See content/decision-tool-data.json for scope, source URLs, observation times, expiry and evidence notes.
