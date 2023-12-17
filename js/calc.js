import { startCalculations } from './app.js'

/**
 * @returns Объём услуг Q
 */
export function getQ() {
  let res = mainState.equipmentServiceLife * mainState.workingTime * mainState.numberOfWorkingDays
  return res
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
function getCreditSum(equipmet = 1000, capital = 100, ownerCapital = 825) {
  return equipmet * 1000 + capital * 1000 - ownerCapital * 1000
}

/**
 * @returns Сумма страховых взносов по расчету (тыс.)
 */
function getInsurancePayment() {
  return (mainState.businessmanSalary * 1000 + mainState.workerSalary * 1000) * (mainState.salaryInsuranceContributions / 100)
}

/**
 * @param   equipmet стоимость приобретенного оборудования (тыс.)
 * @returns Сумма амортизационных затрат (тыс.)
 */
function getAmortPayments(equipmet = 1000) {
  return equipmet * 1000 / (mainState.equipmentServiceLife * 12)
}

/**
 * @returns Сумма текущих затрат без амортизации (тыс.)
 */
function getSumPaymentWithoutAmort() {
  let insurancePayment = getInsurancePayment();
  return mainState.rent + mainState.operatingСosts + mainState.otherCosts + mainState.materials + mainState.businessmanSalary + mainState.workerSalary + insurancePayment;
}

/**
 * @returns Общая сумма затрат (тыс.)
 */
function getSumPaymentWithAmort() {
  let sumPayment = getSumPaymentWithoutAmort();
  let amortPayment = getAmortPayments();
  let sumPercent = getSumPercentPerQuarter()

  return sumPayment + amortPayment + sumPercent
}
//#region Схема погашения кредита

/**
 * @returns Количество кварталов
 */
function getQuarters() {
  return mainState.loanRepaymentPeriod / 3;
}

/**
 * @returns Сумма процента за кредит (тыс.)
 */
function getSumPercentPerQuarter() {
  let creditSum = getCreditSum();
  let quarter = getQuarters()
  return creditSum * (mainState.loanPercentage / 100) * (mainState.loanRepaymentPeriod / 12) / quarter;
}

/**
 * @returns Сумма возврата кредита (тыс.)
 */
function getSumCreditRefund() {
  let quarters = getQuarters()
  return getCreditSum() / (quarters - 1);
}

//#endregion

//#region Расчет налога при объекте «доход»

/**
 * @param   percent ставка налога (0 - 100, %)
 * @returns Начальная сумма налога (тыс/квартал)
 */
function getInitialTax(percent = 6) {
  return getQ() * percent / 100 * 3;
}

/**
 * @returns Уменьшенная сумма налога (тыс/квартал)
 */
function getTaxDecreased() {
  let insurancePayment = getInsurancePayment();
  let initialTax = getInitialTax();

  let halfTax = initialTax / 2;
  let result = initialTax - insurancePayment;

  if (result > halfTax) {
    result = halfTax;
  }

  return result;
}

//#endregion

//#region Расчет налога при объекте «доход минус расход»

/**
 * @param   percent ставка налога (0 - 100, %)
 * @returns Сумма налога при объекте «доход минус расход» (руб/мес)
 */
function getSumTaxIncomeOutlay(percent = 15) {
  return (getQ() - getSumPaymentWithAmort()) * (percent / 100)
}

//#endregion

//#region Величина производственного риска проекта


/**
 * @returns Сумма постоянных затрат
 */
function getProductionRisk() {
  return getSumPaymentWithoutAmort() + getAmortPayments()
}

//#endregion

//#region Величина финансового риска в условиях проекта


/**
 * @returns Величина чистой прибыли, %
 */
function getClearProfit() {
  let OP = getQ() - getSumPaymentWithoutAmort() - getAmortPayments();
  let percentCred = mainState.loanPercentage / 100;
  let denominator = OP - (percentCred * 275 / 12);
  return OP / denominator;
}

//#endregion

//#region Расчет эффективности и риска проекта

/**
 * @param rWithoutRisk r без риска, %
 * @param rCB r ЦБ, %
 * @param sumBuisnesRisk сумма рисков бизнеса, %
 * @returns Rq, %
 */
function getRq(rWithoutRisk = 6, rCB = 10, sumBuisnesRisk = 20) {
  let years = mainState.loanRepaymentPeriod / 18;
  return rWithoutRisk + (rCB - rWithoutRisk) * years + sumBuisnesRisk
}

/**
 * @param incomeTaxRate ставка налога на прибыль, %
 * @returns Rd, %
 */
function getRd() {
  return mainState.loanPercentage * (1 - incomeTaxRate / 100)
}

/**
 * @returns Rg, %
 */
function getRg() {
  let equipAndCredPayments = 1000 + 100
  let specificCredWeight = getCreditSum() / equipAndCredPayments
  let specificCapitalWeight = 825 / equipAndCredPayments

  return getRd() * specificCredWeight + getRq() * specificCapitalWeight
}

/**
 * @returns GF, кэш-флоу, тыс/квартал
 */
function getGF() {
  let q = getQ() * 3
  return q - (getSumPaymentWithoutAmort() * 3 + getTaxDecreased())
}

/**
 * @returns ЧДД, кэш-флоу, тыс/квартал
 */
function getGF() {

}

//#endregion

//#endregion

