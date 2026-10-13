# Nekurama public sites

Public source monorepo for the Nekurama, BABAI, and SDLC websites.

## Site map

- `apps/nekurama` — short parent-company overview. BABAI is Nekurama's first product.
- `apps/babai` — primary product site, explaining the product direction and first restaurant-focused validation scope.
- `apps/sdlc/site` — the existing static SDLC guide, copied without rewriting its HTML or relative assets.

Nekurama and BABAI are built as static Astro sites. The SDLC guide remains plain HTML, CSS, and JavaScript. React can be added to individual Astro components if an interaction justifies it; the current pages do not need a client-side application runtime.

## Local development

Install the workspace dependencies with `pnpm install`.

- `pnpm dev:nekurama`
- `pnpm dev:babai`
- `pnpm build`
- `pnpm build:nekurama`
- `pnpm build:babai`
- `pnpm validate:sdlc`

## Combined site build

| Site | Source | Validation and expected output |
| --- | --- | --- |
| Nekurama | `apps/nekurama` | `/` in the combined output. |
| BABAI | `apps/babai` | `/products/babai/` in the combined output; Astro asset URLs use the same base path. |
| BABAI financial planner | `apps/babai/public/finance` | `/products/babai/finance/`; direct URL only, not linked from site navigation. |
| SDLC | `apps/sdlc/site` | `/ideology/sdlc/`; source files are copied byte-for-byte with their relative assets. |

`pnpm build` assembles all three sites and copies the financial planner from BABAI's public files under root `dist`. `pnpm validate:site` checks the expected pages, the planner's `noindex,nofollow` directives and lack of links from other public pages, referenced brand assets and favicons, BABAI's path-based assets and navigation, and byte-for-byte SDLC source preservation. The individual Astro builds remain available as `pnpm build:nekurama` and `pnpm build:babai`; each writes to its app's `dist` directory. `pnpm validate:sdlc` validates the SDLC source independently.

The `build-validation.yml` workflow builds and validates the combined output on pull requests and pushes to `main` without publishing it.

The combined output can be previewed by serving root `dist` as a static directory.

## Hosting status

The target is one GitHub Pages site at `nekurama.com`, with Nekurama at `/`, BABAI at `/products/babai/`, and SDLC at `/ideology/sdlc/`.

The `deploy-pages.yml` workflow builds and validates the site, uploads the `dist` artifact, and deploys it to GitHub Pages after successful builds on pushes to `main` (or manual runs on `main`). DNS configuration and any domain cutover are outside this repository workflow; the domain cutover is tracked in [issue #2](https://github.com/nekurama/sites/issues/2).

## Content boundary

BABAI copy follows the current evidence-qualified product brief in Bulb. It describes approved positioning and intended pilot scope; it does not claim general availability, customer traction, savings, performance, reliability, final pricing, or legal clearance. The financial planner is published at a direct URL for internal analysis and Vinay's decisions, without a site-navigation link. It is publicly accessible to anyone with the URL; `noindex` and an unlinked URL are not access controls. The company page states only the parent/product relationship. The mission, long-term strategy, public contact route, and final visual identity remain open.
