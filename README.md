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
| SDLC | `apps/sdlc/site` | `/ideology/sdlc/`; source files are copied byte-for-byte with their relative assets. |

`pnpm build` assembles all three sites under root `dist`. `pnpm validate:site` checks the expected pages, BABAI's path-based assets and navigation, and byte-for-byte SDLC source preservation. The individual Astro builds remain available as `pnpm build:nekurama` and `pnpm build:babai`; each writes to its app's `dist` directory. `pnpm validate:sdlc` validates the SDLC source independently.

GitHub Actions builds and validates the combined output on pull requests and pushes to `main`. It does not publish or upload site artifacts.

The combined output can be previewed by serving root `dist` as a static directory.

## Hosting status

The target is one GitHub Pages site at `nekurama.com`, with Nekurama at `/`, BABAI at `/products/babai/`, and SDLC at `/ideology/sdlc/`.

There is deliberately no deployment workflow in this repository. The future Pages release and domain cutover are tracked in [issue #2](https://github.com/nekurama/sites/issues/2). No Pages settings, custom domains, DNS, publication, or live-site migration are included in this source setup.

## Content boundary

BABAI copy follows the current evidence-qualified product brief in Bulb. It describes approved positioning and intended pilot scope; it does not claim general availability, customer traction, savings, performance, reliability, final pricing, or legal clearance. The company page states only the parent/product relationship. The mission, long-term strategy, public contact route, and final visual identity remain open.
