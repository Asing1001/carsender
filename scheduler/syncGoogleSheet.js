// see https://www.fastcomet.com/tutorials/nodejs/google-spreadsheet-package for detail
const GoogleSpreadsheet = require('google-spreadsheet')
const CarPrice = require('../api/model/carPrice')
const Misc = require('../api/model/misc')
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
    const cars = [
      getCarPrice(rows[0]),
      getCarPrice(rows[1]),
      getCarPrice(rows[2]),
      getCarPrice(rows[3])
    ]
    const reminder = {
      key: 'reminder',
      value: rows[0]['備註']
    }

    connect().then(async connection => {
      const promises = cars.map(car =>
        CarPrice.findOneAndUpdate(
          { carType: car.carType, airport: car.airport },
          car,
          {
            upsert: true
          }
        ).exec()
      )

      try {
        const oldCarPrices = await Promise.all(promises)
        console.log(oldCarPrices)
        const oldReminder = await Misc.findOneAndUpdate(
          { key: reminder.key },
          reminder,
          {
            upsert: true
          }
        ).exec()
        console.log(oldReminder)
      } catch (err) {
        console.error(err)
      }
      process.exit(0)
    })
  })
})

const getCarPrice = (row, airport) => {
  return {
    displayName: row['畫面顯示'],
    carType: row['車種'].trim(),
    airport: row['機場'],
    daytimePrice: row['日間價格'],
    nighttimePrice: row['夜間價格']
  }
}
