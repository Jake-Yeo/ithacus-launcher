# Isle of Ithaca Interface Guide

## Direction

The launcher should feel like a quiet, premium Apple-style home screen shaped by the Ionian Sea: airy, tactile, restrained, and immediately readable. Avoid generic admin-dashboard styling, excessive gradients, glass everywhere, or dense explanatory text.

## Stack

- React + TypeScript for UI and behavior.
- Tailwind CSS for all authored visual styling.
- Keep layout, spacing, typography, color, responsive behavior, focus, hover, and active states in component `className` utilities.
- The Tailwind entry stylesheet may contain the single required `@import "tailwindcss";` directive only. Do not add handwritten selectors, CSS modules, Sass, styled-components, or `@apply` component abstractions.
- Do not add MUI. Tailwind is the sole design system for this product.

## Palette

Use these exact colors through Tailwind arbitrary-value utilities so the palette stays visible beside the markup:

| Role | Color | Tailwind example |
| --- | --- | --- |
| Canvas | `#F3F7F5` | `bg-[#F3F7F5]` |
| Surface | `#FFFFFF` | `bg-white` |
| Ink | `#172521` | `text-[#172521]` |
| Muted ink | `#687A74` | `text-[#687A74]` |
| Border | `#DDE7E2` | `border-[#DDE7E2]` |
| Aegean deep | `#06384F` | `bg-[#06384F]` |
| Aegean | `#075F78` | `text-[#075F78]` |
| Turquoise | `#1597A8` | `bg-[#1597A8]` |
| Sea mist | `#DDF4F2` | `bg-[#DDF4F2]` |
| Olive | `#446B4C` | `text-[#446B4C]` |
| Success | `#1F9D72` | `bg-[#1F9D72]` |
| Sand | `#FFF4CE` | `bg-[#FFF4CE]` |
| Coral/error | `#C45B59` | `text-[#C45B59]` |

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
