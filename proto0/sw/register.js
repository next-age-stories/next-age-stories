// WIP
const el = document.querySelector("#root");

let upgradeCount = 0;
let modal = null;
function showUpgradeModal() {
  if (modal == null) {
    modal = document.createElement("div");
    document.body.appendChild(modal);
  }

  upgradeCount += 1;

  if (installed) {
    modal.innerHTML = `
      <div style='position: absolute; outline: 1px solid black; right: 10px; bottom: 10px; width: 350px; height: 50px; background: white; padding: 10px;'>
        <div>New version available! ${upgradeCount}</div>
        <span>It will be applied from the next</span> - <button onclick="location.reload()">Reload</button>
      </div>
    `;
  }
}

async function setupServiceWorker() {
  if (navigator.serviceWorker == null) {
    throw new Error("Your browser can not use serviceWorker");
  }

  let installed = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (installed) {
      const modal = document.createElement("div");
      modal.innerHTML = `
        <div style='position: absolute; outline: 1px solid black; right: 10px; bottom: 10px; width: 350px; height: 50px; background: white; padding: 10px;'>
          <div>New version available!</div>
          <span>It will be applied from the next</span> - <button onclick="location.reload()">Reload</button>
        </div>
      `;
      document.body.appendChild(modal);
    }
  });

  const reg = await navigator.serviceWorker.register("/sw.js");
  // await navigator.serviceWorker.ready
  installed = true;
  if (location.href.indexOf("localhost") > -1) {
    setInterval(() => {
      reg.update();
    }, 3 * 1000);
  } else {
    setInterval(() => {
      reg.update();
    }, 60 * 1000);
  }
}

(async () => {
  try {
    // SW
    el.innerHTML = "Checking service worker ...";
    await setupServiceWorker();

    // Run
    el.innerHTML = "Loading...";
    await import("./app/main.js");
  } catch (e) {
    el.innerHTML = "Something wrong: " + e.message;
  }
})();
