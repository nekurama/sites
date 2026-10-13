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

## Build validation

| Site | Source | Validation and expected output |
| --- | --- | --- |
| Nekurama | `apps/nekurama` | `pnpm build:nekurama` creates the static site in `apps/nekurama/dist`. |
| BABAI | `apps/babai` | `pnpm build:babai` creates the static site in `apps/babai/dist`. |
| SDLC | `apps/sdlc/site` | `pnpm validate:sdlc` checks `apps/sdlc/site/index.html` and its referenced local image. The preserved HTML, CSS, and JavaScript source is served directly; there is no separate build output. |

GitHub Actions runs the two Astro builds independently and validates the SDLC static source on pull requests and pushes to `main`. It does not publish or upload site artifacts.

The SDLC page can be previewed by serving `apps/sdlc/site` as a static directory.

## Hosting status

GitHub Pages is the selected host. The three custom domains need isolated Pages site configurations. The exact monorepo-to-Pages deployment flow is tracked in [issue #2](https://github.com/nekurama/sites/issues/2).

There is deliberately no deployment workflow in this repository yet. The existing SDLC deployment remains in its current repository. No custom domain or DNS changes are included in this source setup.

## Content boundary

BABAI copy follows the current evidence-qualified product brief in Bulb. It describes approved positioning and intended pilot scope; it does not claim general availability, customer traction, savings, performance, reliability, final pricing, or legal clearance. The company page states only the parent/product relationship. The mission, long-term strategy, public contact route, and final visual identity remain open.
