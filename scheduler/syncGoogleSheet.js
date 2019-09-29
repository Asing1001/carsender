// see https://www.fastcomet.com/tutorials/nodejs/google-spreadsheet-package for detail
const GoogleSpreadsheet = require('google-spreadsheet')
const CarPrice = require('../api/model/carPrice')
const { connect } = require('../api/connection')
const creds = require('./cronjob-6fe799c40a6f.json')

// Create a document object using the ID of the spreadsheet - obtained from its URL.
const doc = new GoogleSpreadsheet(
  '1u1BpZYnYodjSelP7v-B4KC7HJZhTD7_LTto5GA5KGi4'
)

// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function(err) {
  if (err) {
    console.error(err)
  }
  // Get all of the rows from the spreadsheet.

  doc.getRows('opp212v', function(err, rows) {
    if (err) {
      console.error(err)
    }

    const normalCarRow = rows[0]
    const normalCar = {
      displayName: normalCarRow['車種'],
      carType: 'normal',
      daytimePrice: normalCarRow['日間價格'],
      nighttimePrice: normalCarRow['夜間價格']
    }

    const boxCarRow = rows[1]
    const boxCar = {
      displayName: boxCarRow['車種'],
      carType: 'box',
      daytimePrice: boxCarRow['日間價格'],
      nighttimePrice: boxCarRow['夜間價格']
    }

    const cars = [normalCar, boxCar]

    connect().then(async connection => {
      const promises = cars.map(car =>
        CarPrice.findOneAndUpdate({ carType: car.carType }, car).exec()
      )
      try {
        const carPrices = await Promise.all(promises)
        console.log(carPrices)
      } catch (err) {
        console.error(err)
      }
      process.exit(0)
    })
  })
})
