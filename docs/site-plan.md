# Nekurama sites plan

## Audience and hierarchy

Most visitors are expected to go to the BABAI product site. It is the primary public explanation of what BABAI is designed to offer. The Nekurama site is a brief parent-company page that establishes the relationship and points to BABAI.

```text
NEKURAMA (parent company)
└── BABAI (first product)

SDLC (company-wide working guide)
```

The source for all public sites, including SDLC, lives in this repository. Existing production sites stay on their current deployment until a separately approved cutover.

## Initial implementation

- Nekurama and BABAI: Astro-generated static HTML. Use React only for a component that needs client-side interaction.
- SDLC: preserve its current standalone HTML, JavaScript, CSS, and local asset structure.
- Keep each site's build independent so it can be deployed to its own custom-domain Pages site.
- Do not add tracking, forms, signup capture, or third-party embeds without an approved purpose and data-handling path.

## Page content

### Nekurama

- State that Nekurama is the parent company and BABAI is its first product.
- Give visitors a direct path to BABAI.
- Leave mission, portfolio claims, founder biographies, and public contact details out until approved.

### BABAI

- Lead with the approved promise: “Run your business without leaving WhatsApp.”
- Describe BABAI as a business operating platform built around WhatsApp, intended to turn customer conversations into coordinated business work.
- Explain the intended flow: conversation, menu/catalog, pickup order, payment status, restaurant operations, fulfillment, and status communication.
- Explain the channel roles: WhatsApp is the main conversational/action surface; web supports configuration, operations, review, and recovery.
- Label restaurant-first/pickup-first scope as the initial validation scope, not as general availability or evidence of traction.
- Include no pricing, unsupported outcome metrics, testimonials, customer logos, availability claims, or unapproved signup/contact CTA.

## Hosting plan

GitHub Pages remains the selected provider. Each custom domain needs an independent Pages site configuration. The source monorepo should build isolated static outputs for:

1. `nekurama.com`
2. `babai.nekurama.com`
3. `sdlc.nekurama.com`

The Pages destination-repository and workflow design is not finalized. Resolve that in [issue #2](https://github.com/nekurama/sites/issues/2), including build path filters, preview handling, scoped deployment credentials, rollback, and the SDLC cutover sequence. Do not enable deployments or alter DNS as part of this initial implementation.

## Open decisions

- Review the visual direction using the local preview before treating it as the final brand treatment.
- Confirm a future visitor action and destination if the BABAI site needs more than informational navigation.
- Confirm public contact and legal/privacy destinations before adding them.
- Complete brand/trademark and public-asset review before selecting logo candidates.
- Approve the deployment topology and a separate release/cutover before changing any live domain.

## Source of content truth

- `Bulb/docs/company/identity-and-strategy.md`
- `Bulb/docs/company/ip-brand-legal.md`
- `Bulb/docs/web/landing-page.md`
- `Bulb/docs/products/babai/product-definition.md`
- `Bulb/docs/products/babai/thesis-and-positioning.md`
- `Bulb/docs/products/babai/experience-and-channels.md`

