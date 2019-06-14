export function getCarPrice({ car, pickUpTime, logger = console }) {
  if (!car || !pickUpTime) {
    throw new Error('missing require parameter')
  }
  const pickUpHour = parseInt(pickUpTime.split(':')[0], 10)
  const orderPrice =
    pickUpHour > 6 && pickUpHour < 23 ? car.daytimePrice : car.nighttimePrice
  logger.info(`pickUpHour:${pickUpHour}, orderPrice:${orderPrice}`)
  return orderPrice
}
