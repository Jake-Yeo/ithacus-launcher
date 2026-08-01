# Ithacus Launcher

Private PWA launcher for apps stored in `~/IthacusProjects`.

## How it works

- The launcher stays on `127.0.0.1:8787` and is exposed only through Tailscale Serve.
- The installable PWA always opens `/__ithacus/` on the same tailnet hostname.
- Starting an allowlisted app stops the currently managed app, waits for the new app to become healthy, then proxies it through the hostname root.
- Launcher routes are namespaced under `/__ithacus/`, leaving app routes such as `/api` available to the selected app.

## Commands

```bash
npm install
npm start
```

Edit `apps.json` to add another trusted project. Commands are fixed in that file; the browser cannot submit arbitrary shell commands.
