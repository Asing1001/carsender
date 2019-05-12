// see https://www.fastcomet.com/tutorials/nodejs/google-spreadsheet-package for detail
const GoogleSpreadsheet = require('google-spreadsheet')
const CarPrice = require('../api/schema/carPrice')
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
      carType: 'normal',
      daytimePrice: normalCarRow['日間價格'],
      nighttimePrice: normalCarRow['夜間價格']
    }

    const boxCarRow = rows[1]
    const boxCar = {
      carType: 'box',
      daytimePrice: boxCarRow['日間價格'],
      nighttimePrice: boxCarRow['夜間價格']
    }

    const cars = [normalCar, boxCar]

    connect().then(connection => {
      cars.forEach(car => {
        CarPrice.findOneAndUpdate(
          { carType: car.carType },
          car,
          (err, doc, res) => {
            if (err) {
              console.error(err)
            } else {
              console.log(doc, res)
            }
          }
        )
      })
    })
  })
})
