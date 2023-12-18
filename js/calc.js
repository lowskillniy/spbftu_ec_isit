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
 * @param   capital первоначальные оборотные средства (тыс.)
 * @returns Сумма, которую необходимо взять в кредит (тыс.)
 */
function getCreditSum(capital = 100) {
  let ownerCapital = (mainState.investmentSize + capital) * mainState.shareOfOwnFunds / 100
  return mainState.investmentSize + capital - ownerCapital
}

/**
 * @returns Сумма страховых взносов по расчету (тыс.)
 */
function getInsurancePayment() {
  return (mainState.businessmanSalary + mainState.workerSalary) * (mainState.salaryInsuranceContributions / 100)
}

/**
 * @returns Сумма амортизационных затрат (тыс.)
 */
function getAmortPayments() {
  return mainState.investmentSize / (mainState.equipmentServiceLife * 12)
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
function getRd(incomeTaxRate = 20) {
  return mainState.loanPercentage * (1 - incomeTaxRate / 100)
}

/**
 * @returns Rg, %
 */
function getRg() {
  let ownerCapital = mainState.investmentSize * mainState.shareOfOwnFunds / 100
  let equipAndCredPayments = mainState.investmentSize + 100
  let specificCredWeight = getCreditSum() / equipAndCredPayments
  let specificCapitalWeight = ownerCapital / equipAndCredPayments

  return getRd() * specificCredWeight + getRq() * specificCapitalWeight
}

/**
 * @returns GF, кэш-флоу, тыс/квартал
 */
function getGF() {
  return (getQ() - (getSumPaymentWithoutAmort() + getTaxDecreased())) * 3
}


//#endregion

//#endregion

export let resultForms = () => {
  return `
  <form class="inputForm">
    <label for="scopeServices"><b>Объём услуг</b></label>
    <input class="dataInput" type="text" pattern="\d+([,\.]\d{1,})?" value="${getQ()}"disabled/>
  </form>
  <span><b>Единовременные затраты:</b></span>
  <span>Приобретение оборудования – ${mainState.investmentSize}</span>
  <span>Первоначальные оборотные средства  – 100 тыс. рублей</span>
  <span>Собственные средства предпринимателя   – ${mainState.investmentSize * mainState.shareOfOwnFunds}</span>
  <form class="inputForm">
    <label for="creditSum">Необходимо привлечь:</label>
    <input class="dataInput" type="text"  pattern="\d+([,\.]\d{1,})?" value="${getCreditSum()}" disabled/>
  </form>
  <span><b>Амортизационные затраты:</b></span>
  <span>Амортизационный период оборудования – ${mainState.equipmentServiceLife} лет</span>
  <form class="inputForm">
    <label for="depreciationCosts">А<sub>мес</sub>, тыс/мес: </label>
    <input class="dataInput" type="text"  pattern="\d+([,\.]\d{1,})?" value="${getAmortPayments()}" disabled/>
  </form>
  <span><b>Средства на погашение о обслуживание кредита:</b></span>
  <span>Период погашения кредита – ${mainState.loanRepaymentPeriod} мес</span>
  <form class="inputForm">
    <label for="sumPercentPerQuarter">Сумма процента за кредит </label>
    <input class="dataInput" type="text" pattern="\d+([,\.]\d{1,})?" value="${getSumPercentPerQuarter()}"disabled/>
  </form>
  <span><b>Расчет налога при объекте «доход»:</b></span>
  <form class="inputForm">
    <label for="initialTax">Начальная сумма налога, (тыс/квартал)</label>
    <input class="dataInput" type="text"  pattern="\d+([,\.]\d{1,})?" value="${getInitialTax()}"disabled/>
  </form>
  <form class="inputForm">
    <label for="TaxDecreased">Уменьшенная сумма налога (тыс/квартал)</label>
    <input class="dataInput" type="text" name="TaxDecreased" value="${getTaxDecreased()}" disabled/>
  </form>
  <span><b>Расчет налога при объекте «доход минус расход»:</b></span>
  <form class="inputForm">
    <label for="initialTax">Сумма налога, (тыс/мес)</label>
    <input class="dataInput" type="text"  pattern="\d+([,\.]\d{1,})?" value="${getSumTaxIncomeOutlay()}"disabled/>
  </form>
  <span><b>Величина производственного риска проекта: </b></span>
  <form class="inputForm">
    <label for="initialTax">Сумма постоянных затрат (тыс/мес)</label>
    <input class="dataInput" type="text"  pattern="\d+([,\.]\d{1,})?" value="${getProductionRisk()}"disabled/>
  </form>
  <span><b>Величина финансового риска в условиях проекта: </b></span>
  <form class="inputForm">
    <label for="initialTax">Величина чистой прибыли, %</label>
    <input class="dataInput" type="text"  pattern="\d+([,\.]\d{1,})?" value="${getClearProfit()}"disabled/>
  </form>
  <span><b>Расчет эффективности и риска проекта: </b></span>
  <form class="inputForm">
    <label for="initialTax">Rq, %</label>
    <input class="dataInput" type="text"  pattern="\d+([,\.]\d{1,})?" value="${getRq()}"disabled/>
  </form>
  <form class="inputForm">
    <label for="initialTax">Rd, %</label>
    <input class="dataInput" type="text"  pattern="\d+([,\.]\d{1,})?" value="${getRd()}"disabled/>
  </form>
  <form class="inputForm">
    <label for="initialTax">Rg, %</label>
    <input class="dataInput" type="text"  pattern="\d+([,\.]\d{1,})?" value="${getRg()}"disabled/>
  </form>
  <form class="inputForm">
    <label for="initialTax">GF кэш-флоу, тыс/квартал</label>
    <input class="dataInput" type="text"  pattern="\d+([,\.]\d{1,})?" value="${getGF()}"disabled/>
  </form>
`
} 