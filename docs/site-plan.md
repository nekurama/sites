# Nekurama sites plan

## Audience and hierarchy

Most visitors are expected to go to a product page. Nekurama's company page introduces the company's motivation and long-term vision, then points visitors to its product index. Product details belong on their respective pages.

```text
NEKURAMA (company)
└── Products
    └── BABAI (first product)

SDLC (company-wide working guide)
```

The source for all public sites, including SDLC, lives in this repository. Existing production sites stay on their current deployment until a separately approved cutover.

## Initial implementation

- Nekurama and BABAI: Astro-generated static HTML. Use React only for a component that needs client-side interaction.
- SDLC: preserve its current standalone HTML, JavaScript, CSS, and local asset structure.
- Assemble one static output with Nekurama at `/`, BABAI at `/products/babai/`, and SDLC at `/ideology/sdlc/`.
- Build BABAI with `/products/babai/` as its base path so generated assets resolve and its navigation links back to Nekurama at `/`.
- Do not add tracking, forms, signup capture, or third-party embeds without an approved purpose and data-handling path.

## Page content

### Nekurama

- Use the approved Warm Editorial visual direction.
- Keep the company page product-neutral. Its CTA is “Explore our products” and links to `/products/`.
- Express passion meeting innovation through structured engineering, India's engineering pride, and the long-term aspiration to make ventures across fields building blocks toward a smart environment in harmony with nature.
- Treat the cross-sector vision as an aspiration, not a claim that Nekurama currently operates across those fields.
- The `/products/` index introduces the portfolio and links to individual product pages.
- Keep the personal name-origin story out of the company pitch and metadata. Make it discoverable only through a tucked-away, keyboard-accessible Easter egg on the line-art mark.

### BABAI

- Lead with the approved promise: “Run your business without leaving WhatsApp.”
- Describe BABAI as a business operating platform built around WhatsApp, intended to turn customer conversations into coordinated business work.
- Explain the intended flow: conversation, menu/catalog, pickup order, payment status, restaurant operations, fulfillment, and status communication.
- Explain the channel roles: WhatsApp is the main conversational/action surface; web supports configuration, operations, review, and recovery.
- Label restaurant-first/pickup-first scope as the initial validation scope, not as general availability or evidence of traction.
- Include no pricing, unsupported outcome metrics, testimonials, customer logos, availability claims, or unapproved signup/contact CTA.

## Hosting plan

The target is one GitHub Pages site at `nekurama.com`, serving the combined output at:

1. `nekurama.com/`
2. `nekurama.com/products/babai/`
3. `nekurama.com/ideology/sdlc/`

`pnpm build` produces the combined static site under root `dist`; `pnpm validate:site` checks its expected pages, BABAI paths/assets, and unchanged SDLC copy. Pull requests build and validate the output without publishing. The `Deploy GitHub Pages` workflow deploys successful builds from `main`; manual runs on other branches validate and package but do not deploy.

### Approved release and DNS cutover

- Repository: public `nekurama/sites`; GitHub Pages publishes the root `dist` artifact from the Actions workflow.
- Primary hostname: `nekurama.com`, configured as the GitHub Pages custom domain. `www.nekurama.com` points to the organization's GitHub Pages host so GitHub can redirect it to the apex.
- Apex DNS records: four GitHub Pages A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`.
- `www` DNS record: CNAME to `nekurama.github.io`.
- Preserve Google Workspace MX, SPF and verification TXT records. Leave existing BABAI and SDLC subdomain records and deployments unchanged.
- Rollback: restore the apex and `www` web records from the pre-cutover DNS snapshot. Keep mail and verification records intact. The Pages deployment can be disabled by reverting the publishing workflow and changing the Pages source to disabled in repository settings.
- DNS propagation can take up to 24 hours; confirm authoritative and public resolution before enabling HTTPS enforcement.

## Open decisions

- Confirm a future visitor action and destination if the BABAI site needs more than informational navigation.
- Confirm public contact and legal/privacy destinations before adding them.
- Complete brand/trademark and public-asset review before selecting logo candidates.
- Approve a separate release/cutover before publishing or changing any live domain.

## Source of content truth

- `Bulb/docs/company/identity-and-strategy.md`
- `Bulb/docs/company/ip-brand-legal.md`
- `Bulb/docs/web/landing-page.md`
- `Bulb/docs/products/babai/product-definition.md`
- `Bulb/docs/products/babai/thesis-and-positioning.md`
- `Bulb/docs/products/babai/experience-and-channels.md`
