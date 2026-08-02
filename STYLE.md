# Isle of Ithaca Interface Guide

## Direction

The launcher should feel like a quiet, premium Apple-style home screen shaped by the Ionian Sea: airy, tactile, restrained, and immediately readable. Avoid generic admin-dashboard styling, excessive gradients, glass everywhere, or dense explanatory text.

## Stack

- React + TypeScript for UI and behavior.
- Tailwind CSS for all authored visual styling.
- Keep layout, spacing, typography, color, responsive behavior, focus, hover, and active states in component `className` utilities.
- The Tailwind entry stylesheet may contain only the required `@config` and `@import "tailwindcss";` directives. Do not add handwritten selectors, CSS modules, Sass, styled-components, or `@apply` component abstractions.
- Do not add MUI. Tailwind is the sole design system for this product.

## Component architecture

- Keep every component, hook, utility, and named function focused, descriptively named, in its own file, and under 100 lines.
- Build feature interfaces from reusable stateless primitives in `src/components/ui/`.
- Primitive components accept native element attributes and extensible `className` values merged through `cn()`.
- Use CVA or named maps for variants. Keep data fetching, process control, and iframe behavior outside UI primitives.
- Do not add descriptive inline comments. Let names and module boundaries explain intent.

## Palette

Use these exact colors through semantic tokens defined in `tailwind.config.js`. Components must not contain raw palette values.

| Role | Color | Tailwind example |
| --- | --- | --- |
| Canvas | `#F3F7F5` | `bg-canvas` |
| Surface | `#FFFFFF` | `bg-surface` |
| Ink | `#172521` | `text-ink` |
| Muted ink | `#687A74` | `text-muted` |
| Border | `#DDE7E2` | `border-border` |
| Aegean deep | `#06384F` | `bg-sea-deep` |
| Aegean | `#075F78` | `text-sea` |
| Turquoise | `#1597A8` | `bg-turquoise` |
| Sea mist | `#DDF4F2` | `bg-mist` |
| Success | `#1F9D72` | `bg-success` |
| Sand | `#FFF4CE` | `bg-sand` |
| Coral/error | `#C45B59` | `text-danger` |

App icons may use individual gradients, but each gradient must be deliberately assigned and remain subordinate to the shared launcher palette.

## Typography

- Use the native Apple/system sans stack supplied by Tailwind's `font-sans`.
- Page title: bold, tight tracking, responsive `text-3xl` to `text-5xl`.
- Section titles: `text-lg` or `text-xl`, semibold/bold.
- App names: `text-sm`, semibold, one line.
- Eyebrows/status labels: uppercase, bold, `text-[10px]` to `text-xs`, generous tracking.
- Keep body copy concise and use muted ink.

## Shape, spacing, and elevation

- App icons: Apple-like rounded squares using approximately 24–28% corner radius.
- Cards/panels: `rounded-3xl`; compact controls: `rounded-xl` or `rounded-full`.
- Use an 8px-oriented spacing rhythm: common gaps `gap-2`, `gap-4`, `gap-6`, and `gap-8`.
- Prefer subtle borders plus soft layered shadows. Avoid heavy outlines and black drop shadows.
- Keep generous safe-area-aware page padding on iPhone.

## Interaction

- Every interactive element needs visible hover, pressed, disabled, and keyboard focus states.
- Use short 150–200ms transitions for opacity, translate, scale, color, and shadow.
- App icons may lift slightly on hover and compress slightly on press.
- Respect `prefers-reduced-motion` with Tailwind `motion-reduce:` utilities.
- Status and errors must be announced through accessible live regions.
- Maintain at least 44×44px touch targets.

## Responsive behavior

- Mobile: three-column app grid, compact copy, safe-area padding.
- Tablet/desktop: four-column grid with more whitespace and larger icons.
- The selected app always occupies the full window/viewport.
- Inject Exit into a visible mobile bottom navigation; use a floating upper-right control on desktop when the app's mobile navigation is hidden.

## Content rules

- Use the product name `Isle of Ithaca` consistently.
- Keep launcher copy calm and short.
- Do not expose ports, process commands, credentials, or debugging details in the normal UI.
