/**
 * @param   hours кол-во рабочих часов в сутках
 * @param   days кол-во рабочих дней
 * @param   hours стоимость одного часа работы
 * @returns Объём услуг Q
 */
function getQ(hours, days, perHourCost) {
  return +hours * +days * +perHourCost
}

let getDataForCalc = () => {
  let arrayOfForms = [...document.querySelectorAll(".inputForm")]
  let arrayOfInputs = [...document.querySelectorAll(".dataInput")]
  arrayOfForms.forEach((e) => {
    e.addEventListener('submit', elem => {
      elem.preventDefault()
      console.log('it worked')
      let allFilled = true
      arrayOfInputs.forEach((element) => {
        if (element.value == '') {
          allFilled = false
        }
      })
      if (!allFilled) {
        alert('Необходимо заполнить все данные')
      }
    })
  })
}

getDataForCalc()