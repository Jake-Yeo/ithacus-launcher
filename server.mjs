import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(rootDir, "public");
const apps = JSON.parse(await readFile(path.join(rootDir, "apps.json"), "utf8"));
const appsById = new Map(apps.map((app) => [app.id, app]));
const launcherPort = Number(process.env.PORT || 8787);

let active = null;
let transition = Promise.resolve();

function publicApp(app) {
  return {
    id: app.id,
    name: app.name,
    description: app.description,
    accent: app.accent,
    state: active?.app.id === app.id ? active.state : "stopped",
  };
}

function statusPayload() {
  return {
    activeAppId: active?.app.id ?? null,
    apps: apps.map(publicApp),
  };
}

function runExclusive(operation) {
  const result = transition.then(operation, operation);
  transition = result.catch(() => {});
  return result;
}

async function waitForApp(app, child, timeoutMs = 45000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`${app.name} exited before becoming ready`);
    }
    try {
      const response = await fetch(`http://127.0.0.1:${app.port}/`, {
        signal: AbortSignal.timeout(1500),
      });
      if (response.status < 500) return;
    } catch {
      // The process may still be compiling or applying migrations.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`${app.name} did not become ready within 45 seconds`);
}

async function stopActive() {
  if (!active) return;
  const running = active;
  running.state = "stopping";

  if (running.child.exitCode === null) {
    try {
      process.kill(-running.child.pid, "SIGTERM");
    } catch (error) {
      if (error.code !== "ESRCH") throw error;
    }

    await Promise.race([
      new Promise((resolve) => running.child.once("exit", resolve)),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);

    if (running.child.exitCode === null) {
      try {
        process.kill(-running.child.pid, "SIGKILL");
      } catch (error) {
        // macOS can report EPERM when the process group disappeared between
        // the exit check and this fallback kill.
        if (!new Set(["ESRCH", "EPERM"]).has(error.code)) throw error;
      }
    }
  }

  if (active === running) active = null;
}

async function startApp(app) {
  if (active?.app.id === app.id && active.state === "running") return;
  await stopActive();

  const logs = [];
  const child = spawn(app.command, app.args, {
    cwd: app.cwd,
    env: { ...process.env, ...app.env },
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  active = { app, child, logs, state: "starting" };
  const capture = (chunk) => {
    logs.push(chunk.toString());
    if (logs.length > 80) logs.shift();
  };
  child.stdout.on("data", capture);
  child.stderr.on("data", capture);
  child.once("exit", () => {
    if (active?.child === child) {
      active.state = "failed";
    }
  });

  try {
    await waitForApp(app, child);
    if (active?.child === child) active.state = "running";
  } catch (error) {
    await stopActive();
    throw error;
  }
}

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use("/__ithacus/assets", express.static(publicDir, { maxAge: "1h" }));

app.get("/__ithacus/api/status", (_request, response) => {
  response.json(statusPayload());
});

app.post("/__ithacus/api/apps/:id/start", async (request, response) => {
  const selected = appsById.get(request.params.id);
  if (!selected) return response.status(404).json({ error: "Unknown app" });

  try {
    await runExclusive(() => startApp(selected));
    response.json(statusPayload());
  } catch (error) {
    response.status(500).json({ error: error.message, ...statusPayload() });
  }
});

app.post("/__ithacus/api/stop", async (_request, response) => {
  await runExclusive(stopActive);
  response.json(statusPayload());
});

app.get("/__ithacus/manifest.webmanifest", (_request, response) => {
  response.sendFile(path.join(publicDir, "manifest.webmanifest"));
});

app.get("/__ithacus/sw.js", (_request, response) => {
  response.set("Service-Worker-Allowed", "/__ithacus/");
  response.sendFile(path.join(publicDir, "sw.js"));
});

app.get(["/__ithacus", "/__ithacus/", "/__ithacus/index.html"], (_request, response) => {
  response.sendFile(path.join(publicDir, "index.html"));
});

const proxy = createProxyMiddleware({
  changeOrigin: true,
  ws: true,
  router: () => active ? `http://127.0.0.1:${active.app.port}` : "http://127.0.0.1:9",
  on: {
    error: (_error, _request, response) => {
      if (!response.headersSent) {
        response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
      }
      response.end("The selected app is unavailable.");
    },
  },
});

app.use((request, response, next) => {
  if (!active || active.state !== "running") {
    return response.redirect(302, "/__ithacus/");
  }
  return proxy(request, response, next);
});

const server = createServer(app);
server.on("upgrade", (request, socket, head) => {
  if (!active || active.state !== "running") return socket.destroy();
  proxy.upgrade(request, socket, head);
});

async function shutdown() {
  await runExclusive(stopActive);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 7000).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

server.listen(launcherPort, "127.0.0.1", () => {
  console.log(`Ithacus Launcher listening on http://127.0.0.1:${launcherPort}/__ithacus/`);
});
