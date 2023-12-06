let deferredPrompt;
let buttonInstall;

window.addEventListener('load', async () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", {scope: '/'})
    .then(serviceWorker => {
      console.log('Service Worker registred');
    })
    .catch(error => {
      console.error("Error registering the Service Worker: ", error);
    });
  }
  buttonInstall = document.querySelector("#button-install");
})


window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredPrompt = event;
  buttonInstall.hidden = false;
  buttonInstall.addEventListener("click", installApp);
});

function installApp() {
  deferredPrompt.prompt();
  buttonInstall.disabled = true;

  deferredPrompt.userChoice.then(choiceResult => {
    if (choiceResult.outcome === "accepted") {
      console.log("PWA setup accepted");
      buttonInstall.hidden = true;
    } else {
      console.log("PWA setup rejected");
    }
    buttonInstall.disabled = false;
    deferredPrompt = null;
  });
}

