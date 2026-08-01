const grid = document.querySelector("#app-grid");
const launcher = document.querySelector("#launcher");
const stage = document.querySelector("#app-stage");
const frame = document.querySelector("#app-frame");
const statusMessage = document.querySelector("#status-message");
const stopButton = document.querySelector("#stop-button");

let state = { apps: [], activeAppId: null };
let busy = false;

function setZoomLock(document, locked) {
  if (!document) return;
  document.documentElement.classList.toggle("ithacus-zoom-locked", locked);
  document.documentElement.dataset.ithacusZoomLocked = String(locked);
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement("meta");
    viewport.name = "viewport";
    document.head?.append(viewport);
  }
  viewport.content = locked
    ? "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
    : "width=device-width, initial-scale=1, viewport-fit=cover";
  if (document.documentElement.dataset.ithacusZoomHandlers === "true") return;
  document.documentElement.dataset.ithacusZoomHandlers = "true";
  const prevent = event => {
    if (document.documentElement.dataset.ithacusZoomLocked === "true") event.preventDefault();
  };
  document.addEventListener("gesturestart", prevent, { passive: false });
  document.addEventListener("gesturechange", prevent, { passive: false });
  document.addEventListener("gestureend", prevent, { passive: false });
  document.addEventListener("dblclick", prevent, { passive: false });
  document.addEventListener("touchmove", event => {
    if (document.documentElement.dataset.ithacusZoomLocked === "true" && typeof event.scale === "number" && event.scale !== 1) event.preventDefault();
  }, { passive: false });
}

setZoomLock(document, false);

async function request(path, options) {
  const response = await fetch(`/__ithacus/api${path}`, options);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Request failed");
  return payload;
}

function selectedApp() {
  return state.apps.find((app) => app.id === state.activeAppId) || null;
}

function appIcon(appId) {
  const icons = {
    portfolio: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="17" r="7"/><path d="M11 39c1.8-8.2 6.1-12.3 13-12.3S35.2 30.8 37 39"/><path d="M10 9h28v30H10z" opacity=".28"/></svg>`,
    experience: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 15h28v24H10z"/><path d="M18 15v-4h12v4M10 23h28M20 23v4h8v-4"/></svg>`,
    callumployed: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 8h20v32H14z"/><path d="M19 15h10M19 21h10M19 27h7M19 34h10"/><path d="m29 29 3 3 6-7"/></svg>`,
    nourish: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 40V20"/><path d="M24 25C13 25 9 18 10 9c9-1 15 3 16 12M24 30c11 0 15-7 14-16-8-1-14 3-14 12"/><path d="M15 40h18"/></svg>`,
  };
  return icons[appId] || `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="9" width="30" height="30" rx="8"/><circle cx="24" cy="24" r="5"/></svg>`;
}

function render() {
  const active = selectedApp();
  setZoomLock(document, active?.id === "nourish");
  stopButton.hidden = !active;
  grid.innerHTML = state.apps.map((app) => {
    const tag = app.kind === "link" ? "a" : "button";
    const attributes = app.kind === "link"
      ? `href="${app.url}"`
      : `type="button" data-app-id="${app.id}" ${busy ? "disabled" : ""}`;
    return `
    <${tag} class="app-tile" ${attributes} style="--accent: ${app.accent}">
      <span class="app-icon" aria-hidden="true">${appIcon(app.id)}</span>
      <span class="app-name">${app.name}</span>
      <span class="app-description">${app.description}</span>
      ${app.state !== "stopped" ? `<span class="app-state">${app.state}</span>` : ""}
    </${tag}>
  `;
  }).join("");
}

async function refresh() {
  state = await request("/status");
  render();
}

async function start(appId) {
  if (busy) return;
  busy = true;
  statusMessage.textContent = "Starting app…";
  render();
  try {
    state = await request(`/apps/${appId}/start`, { method: "POST" });
    const active = selectedApp();
    frame.src = `/?app=${encodeURIComponent(appId)}&t=${Date.now()}`;
    launcher.hidden = true;
    stage.hidden = false;
    statusMessage.textContent = "";
  } catch (error) {
    statusMessage.textContent = error.message;
  } finally {
    busy = false;
    render();
  }
}

async function stop() {
  if (busy) return;
  busy = true;
  frame.src = "about:blank";
  stage.hidden = true;
  launcher.hidden = false;
  statusMessage.textContent = "Stopping app…";
  try {
    state = await request("/stop", { method: "POST" });
    statusMessage.textContent = "";
  } catch (error) {
    statusMessage.textContent = error.message;
  } finally {
    busy = false;
    render();
  }
}

grid.addEventListener("click", (event) => {
  const tile = event.target.closest("[data-app-id]");
  if (tile) start(tile.dataset.appId);
});

stopButton.addEventListener("click", stop);

function installExitControl() {
  const document = frame.contentDocument;
  if (!document?.body) return;
  setZoomLock(document, state.activeAppId === "nourish");
  const bottomNav = document.querySelector("nav.bottom-nav, nav[data-bottom-nav], nav[aria-label*='bottom' i]");
  const existingButton = document.querySelector("button[data-ithacus-exit]");
  if (existingButton) {
    if (bottomNav && !bottomNav.contains(existingButton)) {
      existingButton.classList.remove("ithacus-exit-control--floating");
      existingButton.classList.add("ithacus-exit-control--tab");
      bottomNav.style.setProperty("--ithacus-tab-count", String(bottomNav.children.length + 1));
      bottomNav.classList.add("ithacus-exit-host");
      bottomNav.append(existingButton);
    }
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.ithacusExit = "true";
  button.className = "ithacus-exit-control";
  button.setAttribute("aria-label", "Exit to Ithacus launcher");
  button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 17l5-5-5-5M15 12H3M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    </svg>
    <span>Exit</span>
  `;
  button.addEventListener("click", () => window.postMessage({ type: "ithacus:exit" }, location.origin));

  if (!document.querySelector("style[data-ithacus-exit]")) {
    const style = document.createElement("style");
    style.dataset.ithacusExit = "true";
    style.textContent = `
    .ithacus-exit-control {
      border: 0; background: transparent; color: #a34f54; font: inherit;
      cursor: pointer; -webkit-tap-highlight-color: transparent;
    }
    .ithacus-exit-control svg {
      width: 21px; height: 21px; fill: none; stroke: currentColor;
      stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
    }
    .ithacus-exit-control--tab {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 4px; min-width: 0;
    }
    .ithacus-exit-control--tab span { font-size: 10px; font-weight: 750; }
    .ithacus-exit-host { grid-template-columns: repeat(var(--ithacus-tab-count), minmax(0, 1fr)) !important; }
    .ithacus-exit-control--floating {
      position: fixed; z-index: 2147483646; right: 16px;
      bottom: calc(16px + env(safe-area-inset-bottom)); display: flex;
      align-items: center; gap: 7px; min-height: 44px; padding: 10px 14px;
      border: 1px solid #e2c9cb; border-radius: 999px; background: #fff;
      box-shadow: 0 8px 28px rgba(35, 25, 28, .18); font-size: 12px; font-weight: 800;
    }
    `;
    document.head.append(style);
  }

  if (bottomNav) {
    button.classList.add("ithacus-exit-control--tab");
    bottomNav.style.setProperty("--ithacus-tab-count", String(bottomNav.children.length + 1));
    bottomNav.classList.add("ithacus-exit-host");
    bottomNav.append(button);
  } else {
    button.classList.add("ithacus-exit-control--floating");
    document.body.append(button);
  }

  if (!document.body.dataset.ithacusExitObserver) {
    document.body.dataset.ithacusExitObserver = "true";
    const observer = new frame.contentWindow.MutationObserver(() => installExitControl());
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

frame.addEventListener("load", installExitControl);
window.addEventListener("message", event => {
  if (event.origin === location.origin && event.data?.type === "ithacus:exit") stop();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/__ithacus/sw.js?v=9", { scope: "/__ithacus/", updateViaCache: "none" });
}

refresh().catch((error) => {
  statusMessage.textContent = error.message;
});
