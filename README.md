# Isle of Ithaca

A local-first PWA and macOS desktop launcher for a personal app suite. Isle of Ithaca starts trusted, allowlisted applications on a Mac, waits for the selected app to become healthy, and embeds it behind one launcher interface.

## Managed projects

| Project | Purpose | Repository |
| --- | --- | --- |
| Portfolio | Personal site and career profile | [Jake-Yeo/jake-yeo-site](https://github.com/Jake-Yeo/jake-yeo-site) |
| Career Experience | Interview-story and work-history archive | [Jake-Yeo/career-experience](https://github.com/Jake-Yeo/career-experience) |
| Callumployed | Local-first job-search tracker and automation tool | [Jake-Yeo/callumployed](https://github.com/Jake-Yeo/callumployed) |
| Nourish | Photo-first nutrition diary and meal-estimation PWA | [Jake-Yeo/nourish](https://github.com/Jake-Yeo/nourish) |

## Architecture

- **React, TypeScript, Vite, and Tailwind CSS** power the launcher UI.
- An **Express** server manages app lifecycle and reverse-proxies the selected local app.
- A **Tauri 2** shell provides a lightweight macOS desktop surface that uses the same launcher server as the PWA.
- Only fixed commands from `apps.json` can start apps; browser requests cannot execute arbitrary commands.
- The launcher runs on loopback and is designed for private-device use.

## Run locally

```bash
npm install
npm start
```

For development:

```bash
npm run dev
```

## Native macOS app

```bash
npm run desktop:dev
npm run desktop:build
```

The native app is a Tauri shell around the local launcher server. It does not duplicate managed-app data or process logic.

## Checks

```bash
npm run check
```
