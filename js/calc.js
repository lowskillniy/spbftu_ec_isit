/**
 * @param   hours кол-во рабочих часов в сутках
 * @param   days кол-во рабочих дней
 * @param   hours стоимость одного часа работы
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