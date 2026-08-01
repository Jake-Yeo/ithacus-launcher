# Ithacus Launcher Development Notes

## Purpose

Isle of Ithaca is Jake's private launcher and process manager for applications stored under `/Users/jakeyeo/IthacusProjects`.

It has two clients backed by the same launcher server:

- An installable PWA for Jake's iPhone, reached through the private Tailscale Serve URL.
- A lightweight Tauri 2 macOS app installed as `/Applications/Isle of Ithaca.app`.

Both surfaces show the same launcher UI. Selecting an app starts that allowlisted local process and displays it inside the launcher window; it must not open the selected app in Chrome or Safari.

## Architecture

- `server.mjs` is the Express launcher and reverse proxy on `127.0.0.1:8787`.
- `apps.json` is the allowlist of managed apps, fixed commands, working directories, ports, and environment variables.
- At most one managed app runs at a time. Starting another app stops the current one first.
- `/__ithacus/` contains launcher routes and assets.
- The selected app is proxied through `/`, leaving its routes such as `/api` intact.
- `src/` contains the React + TypeScript launcher UI.
- `public/` contains static PWA assets such as the manifest, service worker, and icons.
- Vite builds the launcher into `dist/`, which `server.mjs` serves under `/__ithacus/`.
- `src-tauri/` contains the native macOS shell; keep it in this repository rather than creating a separate top-level project.
- `native/` contains the bundled recovery page used when the loopback launcher is unavailable.

## Network and service constraints

- The launcher binds only to loopback on port `8787`.
- Its macOS LaunchAgent is `com.ithacus.launcher`.
- The private PWA URL is `https://ithacus-macbook.tailc9d1c0.ts.net/__ithacus/` through Tailscale Serve.
- Do not expose the launcher publicly, enable Funnel, or change its loopback binding without Jake's explicit approval.
- Do not run a second launcher server while the LaunchAgent-managed instance is active.

## Native macOS shell

- Product name: `Isle of Ithaca`.
- Bundle identifier: `com.ithacus.launcher`.
- The Tauri window loads `http://127.0.0.1:8787/__ithacus/` directly.
- Selected apps remain embedded in the same native window.
- External `http`, `https`, and `mailto` navigation is handed to the default browser.
- Remote launcher content receives no Tauri capabilities or native system permissions.
- The app enforces a single instance and focuses the existing window when reopened.
- If the launcher is unavailable at startup, show the bundled recovery page rather than a blank WebView error.
- Tauri is only a window around the existing launcher. Do not duplicate process management, app databases, or backend logic in Rust.

## Exit control

- When an app runs inside the launcher, `public/app.js` injects an Exit control into a visible mobile bottom navigation bar.
- If the app's bottom navigation exists but is hidden at the desktop breakpoint, use the floating upper-right Exit control instead.
- Exit stops the managed app and returns to the launcher dashboard.
- Direct/local app URLs must not receive the injected Exit control.

## Data ownership

- The launcher does not own application data.
- Each managed app is responsible for durable server-side persistence. Meaningful user-entered data must not use browser-only storage as its source of truth.
- Phone and Mac clients synchronize because they reach the same Mac-hosted backends and databases.
- Never bundle, copy, or commit app databases, credentials, private exports, or `.env` files into the launcher or Tauri app.

## Icon and branding

- Branding is `Isle of Ithaca`.
- `public/icon.svg` is the source artwork: a top-down Greek island cluster with transparent rounded corners.
- Preserve real alpha transparency. Do not use Quick Look (`qlmanage`) to rasterize the SVG because it bakes transparent corners as white.
- Regenerate the PNG sources with `sips`, then regenerate Tauri assets:

```bash
sips -s format png public/icon.svg --out public/icon-512.png
sips -z 192 192 public/icon-512.png --out public/icon-192.png
cp public/icon-512.png native/icon.png
npx tauri icon public/icon-512.png
```

- After changing PWA assets, bump the service-worker cache version and registration query so installed clients refresh.
- iOS may still require removing and re-adding the Home Screen icon because it caches icons aggressively.

## Commands

```bash
npm install
npm run dev
npm run build
npm start
npm run check
npm run desktop:dev
npm run desktop:build
```

The native bundle is produced at:

`src-tauri/target/release/bundle/macos/Isle of Ithaca.app`

Rust is installed under `/Users/jakeyeo/.cargo/bin`. If Cargo is not on the current shell path, prefix commands with:

```bash
PATH=/Users/jakeyeo/.cargo/bin:$PATH
```

For Jake's Mac, the app is locally ad-hoc signed after installation. Public distribution would require proper Apple Developer signing and notarization.

## Frontend conventions

- Follow `STYLE.md` for the palette and interface system.
- Use React + TypeScript and Tailwind CSS.
- Keep all authored layout, spacing, color, typography, state, and responsive styling in component Tailwind utility classes.
- The only source stylesheet is the Tailwind compiler entry containing `@import "tailwindcss";`; do not add handwritten CSS selectors, CSS modules, Sass, styled-components, or `@apply` abstractions.
- Do not add MUI. This launcher uses Tailwind as its only design system.
- Preserve accessible semantics, keyboard focus states, minimum touch targets, reduced-motion behavior, and live-region status announcements.

## Verification

Before handing off changes:

1. Run `npm run check`.
2. For Rust changes, run `cargo fmt --check` and `cargo check` or a full desktop build.
3. Verify the launcher health/status API on loopback.
4. Verify selected apps remain inside the launcher window.
5. Verify Exit is visible at both desktop and mobile widths.
6. Verify direct app URLs do not show Exit.
7. Verify the repository is clean and no private data is staged.

## Safety

- Preserve unrelated user changes in a dirty worktree.
- Inspect existing LaunchAgent, Tailscale, and process state before modifying them.
- Ask before destructive changes; prefer moving old app bundles to Trash.
- Keep managed commands fixed in `apps.json`. Never accept arbitrary shell commands from browser requests.
