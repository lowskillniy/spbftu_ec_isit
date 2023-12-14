import {clicking} from './calc.js'

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

export let resultAccordeonDiv = `
  <button id="controlGetResultSection" class="accordionDiv">Результаты вычислений</button>
  <div data-id='outputData' class="getDataSection">
    <button class="closeGetDataButton">Закрыть</button>
  </div>
`

/**Функция добавления EventListener на аккордеоны и кнопок к ним
 * 
 * @param {boolean} action переменная, определяющая повторный вызов функции при нажатии кнопки произведения расчётов
 */

export let accordeionsAction = (action) => {
  let arrayOfAccordions = [...document.querySelectorAll(".accordionDiv")]
  let closeGetDataButton = [...document.querySelectorAll('.closeGetDataButton')]
  //предотвращение навешивания на первый аккордеон второго EventListener и второй кнопки
  if (action) {
    arrayOfAccordions.shift(0)
    closeGetDataButton.shift(0)
  }
  arrayOfAccordions.forEach(element => {
    element.addEventListener('click',  () => clicking(element))
  })
  closeGetDataButton.forEach(elem => {
    elem.style.alignSelf = 'center'
    elem.addEventListener('click', e => {
      let panel = e.target.parentElement;
      panel.style.maxHeight = null;
    })
  })
}

// export let removeEvents = () => {
//   console.log('не зевать')
//   let arrayOfAccordions = [...document.querySelectorAll(".accordionDiv")]
//   arrayOfAccordions.forEach(element => {
//     console.log(element)
//     element.removeEventListener('click', () => clicking(element))
//   })
// }

//выполняется при загрузке страницы
accordeionsAction()
