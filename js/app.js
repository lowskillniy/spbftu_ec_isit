import {fillingMainState} from './calc.js'

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

/**Функция добавления EventListener и кнопок на аккордеоны
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
    elem.addEventListener('click', () => clicking(elem.parentElement.previousElementSibling))
    })
}


/**
 *Функция, навешивающая EventListener на кнопку "Расчитать значения" 
 */

export  let addCalcButtonEvent = () => {
    let calcButton = document.getElementById('calcButton')
    calcButton.addEventListener('click', startCalculations)
}

/**
 *Функция изменения вида страницы при начале вычислений
*/
export let startCalculations = () => {
  if (checkingFilledData()) {
    //контроль внешнего вида страницы
    if (document.getElementById('controlGetResultSection')) {
      document.getElementById('controlGetResultSection').remove()
    }
    let controlGetDataSection = document.getElementById('controlGetDataSection')
    controlGetDataSection.classList.remove('active')
    let panel = controlGetDataSection.nextElementSibling;
    panel.style.maxHeight = null;
    document.getElementById('mainSection').insertAdjacentHTML("beforeend", resultAccordeonDiv)
    //переменная, ограничивающая присвоение EventListener
    let action = true
    accordeionsAction(action)
    fillingMainState()
    clicking(document.getElementById('controlGetResultSection'))
  }
}

/**
 * Функция, проверяющая заполненность полей для ввода исходных данных
 */
export let checkingFilledData = () => {
  let allFilled = true
  let arrayOfInputs = [...document.querySelectorAll(".dataInput")]
  arrayOfInputs.forEach((element) => {
    if (element.value == '') {
      allFilled = false
    }
  })
  if (!allFilled) {
    alert('Необходимо заполнить все данные')
  }
  return allFilled
}

/**Функция, отвечающая за анимацию нажатия на аккордеон
 * @param {object} element - HTML объект (аккордеон)
 * @param {string} typeOfObject - 'closeButton', если действие вызвано кнопкой закрытия
 */
export let clicking = (element) => {
  element.classList.toggle("active");
    let panel = element.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
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
addCalcButtonEvent()
accordeionsAction()
