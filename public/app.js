const grid = document.querySelector("#app-grid");
const launcher = document.querySelector("#launcher");
const stage = document.querySelector("#app-stage");
const frame = document.querySelector("#app-frame");
const activeTitle = document.querySelector("#active-title");
const statusMessage = document.querySelector("#status-message");
const stopButton = document.querySelector("#stop-button");
const closeButton = document.querySelector("#close-button");
const homeButton = document.querySelector("#home-button");

let state = { apps: [], activeAppId: null };
let busy = false;

async function request(path, options) {
  const response = await fetch(`/__ithacus/api${path}`, options);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Request failed");
  return payload;
}

function selectedApp() {
  return state.apps.find((app) => app.id === state.activeAppId) || null;
}

function render() {
  const active = selectedApp();
  stopButton.hidden = !active;
  grid.innerHTML = state.apps.map((app) => `
    <button class="app-tile" type="button" data-app-id="${app.id}" style="--accent: ${app.accent}" ${busy ? "disabled" : ""}>
      <span class="app-icon" aria-hidden="true">${app.name.slice(0, 1)}</span>
      <span class="app-name">${app.name}</span>
      <span class="app-description">${app.description}</span>
      ${app.state !== "stopped" ? `<span class="app-state">${app.state}</span>` : ""}
    </button>
  `).join("");
}

async function refresh() {
  state = await request("/status");
  render();
}

async function start(appId) {
  if (busy) return;
  const requested = state.apps.find((app) => app.id === appId);
  if (requested?.kind === "link") {
    window.location.assign(requested.url);
    return;
  }
  busy = true;
  statusMessage.textContent = "Starting app…";
  render();
  try {
    state = await request(`/apps/${appId}/start`, { method: "POST" });
    const active = selectedApp();
    activeTitle.textContent = active?.name || "Application";
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
closeButton.addEventListener("click", stop);
homeButton.addEventListener("click", () => {
  stage.hidden = true;
  launcher.hidden = false;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/__ithacus/sw.js", { scope: "/__ithacus/" });
}

refresh().catch((error) => {
  statusMessage.textContent = error.message;
});
