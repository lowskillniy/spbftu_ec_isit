/**
 * @param   hours кол-во рабочих часов в сутках
 * @param   days кол-во рабочих дней
 * @param   perHourCost стоимость одного часа работы
 * @returns Объём услуг Q
 */
function getQ(hours, days, perHourCost) {
  return +hours * +days * +perHourCost
}

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
  insurancePayment = getInsurancePayment(ownerSalary, workerSalary, percent);
  return +rent + +exploitation + +others + +materials + +ownerSalary + +workerSalary + +insurancePayment;
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
 * @param   equipmet приобретение оборудования (тыс.)
 * @param   capital первоначальные оборотные средства (тыс.)
 * @param   ownerCapital собственные средства предпринимателя (тыс.)
 * @returns Сумма процента за кредит (тыс.)
 */
function getSumPercentPerQuarter(period, percent, equipmet, capital, ownerCapital) {
  creditSum = getCreditSum(equipmet, capital, ownerCapital);
  quarter = getQuarters(period)
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
  quarter = getQuarters(period)
  return getQ(equipmet, capital, ownerCapital) / quarter;
}

//#endregion