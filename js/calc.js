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
 * @returns сумма, которую необходимо взять в кредит
 */
function getCreditSum(equipmet, capital, ownerCapital) {
  return +equipmet + +capital - +ownerCapital
}