import {startCalculations} from './app.js'

/**
 * @param   hours кол-во рабочих часов в сутках
 * @param   days кол-во рабочих дней
 * @param   perHourCost стоимость одного часа работы
 * @returns Объём услуг Q
 */
function getQ(hours, days, perHourCost) {
  return +hours * +days * +perHourCost
}

let mainState = {}

/**
 * Функция, заполняющяя главный объект с данными
 */
export let fillingMainState = () => {
  let arrayOfInputs = [...document.querySelectorAll(".dataInput")]
  arrayOfInputs.forEach(element => {
    mainState[element.id] = +element.value
  });
  console.log(mainState)
}

/**
 * Функция, добавляющая EventListener на формы
 */
let getDataForCalc = () => {
  let arrayOfForms = [...document.querySelectorAll(".inputForm")]
  arrayOfForms.forEach((e) => {
    e.addEventListener('submit', elem => {
      elem.preventDefault()
      startCalculations()
    })
  })
}



getDataForCalc()

//#region Андреевские приколы 
/**
 * @param   equipmet приобретение оборудования (тыс.)
 * @param   capital первоначальные оборотные средства (тыс.)
 * @param   ownerCapital собственные средства предпринимателя (тыс.)
 * @returns Сумма, которую необходимо взять в кредит (тыс.)
 */
function getCreditSum(equipmet, capital, ownerCapital) {
  return +equipmet * 1000 + +capital * 1000 - +ownerCapital * 1000
}

/**
 * @param   ownerSalary заработная плата бизнесмена (тыс.)
 * @param   workerSalary заработная плата работника (тыс.)
 * @param   percent страховые взносы ФЗП (процент 0-100)
 * @returns Сумма страховых взносов по расчету (тыс.)
 */
function getInsurancePayment(ownerSalary, workerSalary, percent) {
  return (+ownerSalary * 1000 + +workerSalary * 1000) * (+percent / 100)
}

/**
 * @param   period амотризационный период оборудования (года)
 * @param   equipmet стоимость приобретенного оборудования (тыс.)
 * @returns Сумма амортизационных затрат (тыс.)
 */
function getAmortPayments(period, equipmet) {
  return equipmet * 1000 / (period * 12)
}

/**
 * @param   rent аренда помещения (тыс.)
 * @param   exploitation экспуатационные затраты (тыс.)
 * @param   others прочие затраты (тыс.)
 * @param   materials стоимость материалов (тыс.)
 * @param   ownerSalary заработная плата бизнесмена (тыс.)
 * @param   workerSalary стоимость приобретенного оборудования (тыс.)
 * @param   percent страховые взносы ФЗП (процент 0-100)
 * @returns Сумма текущих затрат без амортизации (тыс.)
 */
function getSumPaymentWithoutAmort(rent, exploitation, others, materials, ownerSalary, workerSalary, percent) {
  let insurancePayment = getInsurancePayment(ownerSalary, workerSalary, percent);
  return +rent + +exploitation + +others + +materials + +ownerSalary + +workerSalary + +insurancePayment;
}

/**
 * @param   rent аренда помещения (тыс.)
 * @param   exploitation экспуатационные затраты (тыс.)
 * @param   others прочие затраты (тыс.)
 * @param   materials стоимость материалов (тыс.)
 * @param   ownerSalary заработная плата бизнесмена (тыс.)
 * @param   workerSalary стоимость приобретенного оборудования (тыс.)
 * @param   percent страховые взносы ФЗП (процент 0-100)
 * @param   period амотризационный период оборудования (года)
 * @param   equipmet стоимость приобретенного оборудования (тыс.)
 * @param   periodCred срок под который был взят кредит (мес.)
 * @param   percentCred процент под который был взят кредит (0 - 100)
 * @param   capital первоначальные оборотные средства (тыс.)
 * @param   ownerCapital собственные средства предпринимателя (тыс.)
 * @returns Общая сумма затрат (тыс.)
 */
function getSumPaymentWithAmort(rent, exploitation, others, materials, ownerSalary, workerSalary, percent, period, equipmet, periodCred, percentCred, capital, ownerCapital) {
  let sumPayment = getSumPaymentWithoutAmort(rent, exploitation, others, materials, ownerSalary, workerSalary, percent);
  let amortPayment = getAmortPayments(period, equipmet);
  let sumPercent = getSumPercentPerQuarter(periodCred, percentCred, equipmet, capital, ownerCapital)

  return sumPayment + amortPayment + sumPercent
}
//#region Сумма погашения кредита

/**
 * @param   period срок под который был взят кредит (мес.)
 * @returns Сумма возврата кредита (тыс.)
 */
function getQuarters(period) {
  return period / 3;
}

/**
 * @param   period срок под который был взят кредит (мес.)
 * @param   percent процент под который был взят кредит (0 - 100)
 * @param   equipmet стоимость приобретенного оборудования (тыс.)
 * @param   capital первоначальные оборотные средства (тыс.)
 * @param   ownerCapital собственные средства предпринимателя (тыс.)
 * @returns Сумма процента за кредит (тыс.)
 */
function getSumPercentPerQuarter(period, percent, equipmet, capital, ownerCapital) {
  let creditSum = getCreditSum(equipmet, capital, ownerCapital);
  let quarter = getQuarters(period)
  return creditSum * (percent / 100) * (period / 12) / quarter;
}

/**
 * @param   period срок под который был взят кредит (мес.)
 * @param   equipmet приобретение оборудования (тыс.)
 * @param   capital первоначальные оборотные средства (тыс.)
 * @param   ownerCapital собственные средства предпринимателя (тыс.)
 * @returns Сумма возврата кредита (тыс.)
 */
function getSumCreditRefund(period, equipmet, capital, ownerCapital) {
  let quarter = getQuarters(period)
  return getQ(equipmet, capital, ownerCapital) / quarter;
}

//#endregion

//#region Расчет налога при объекте «доход»

/**
 * @param   hours кол-во рабочих часов в сутках
 * @param   days кол-во рабочих дней
 * @param   perHourCost стоимость одного часа работы
 * @param   percent ставка налога (0 - 100, %)
 * @returns Начальная сумма налога (тыс/квартал)
 */
function getInitialTax(hours, days, perHourCost, percent = 6) {
  return getQ(hours, days, perHourCost) * percent / 100 * 3;
}

/**
 * @param   ownerSalary заработная плата бизнесмена (тыс.)
 * @param   workerSalary заработная плата работника (тыс.)
 * @param   percent страховые взносы ФЗП (процент 0-100)
 * @param   hours кол-во рабочих часов в сутках
 * @param   days кол-во рабочих дней
 * @param   perHourCost стоимость одного часа работы
 * @param   percentS ставка налога (0 - 100, %)
 * @returns Уменьшенная сумма налога (тыс/квартал)
 */
function getTaxDecreased(ownerSalary, workerSalary, percent, hours, days, perHourCost, percentS = 6) {
  let insurancePayment = getInsurancePayment(ownerSalary, workerSalary, percent);
  let initialTax = getInitialTax(hours, days, perHourCost, percentS);

  let halfTax = initialTax / 2;
  let result = initialTax - insurancePayment;

  if (result > halfTax) {
    result = halfTax;
  }

  return result;
}

//#endregion

//#region Расчет налога при объекте «доход минус расход»



//#endregion
//#endregion