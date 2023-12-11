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
 * @param   equipmet приобретение оборудования
 * @param   capital первоначальные оборотные средства
 * @param   ownerCapital собственные средства предпринимателя
 * @returns Сумма, которую необходимо взять в кредит
 */
function getCreditSum(equipmet, capital, ownerCapital) {
  return +equipmet + +capital - +ownerCapital
}

/**
 * @param   ownerSalary заработная плата бизнесмена (тыс.)
 * @param   workerSalary заработная плата работника (тыс.)
 * @param   percent страховые взносы ФЗП (процент 0-100)
 * @returns Сумма страховых взносов по расчету
 */
function getInsurancePayment(ownerSalary, workerSalary, percent) {
  return (+ownerSalary * 1000 + +workerSalary * 1000) * (+percent / 100)
}