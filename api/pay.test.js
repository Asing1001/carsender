import { Types } from 'mongoose'
import { reserve } from './pay'

const ObjectId = Types.ObjectId
const order = {
  _id: ObjectId('5d029b720de2851b8886fe15'),
  targetCity: '新北市',
  targetArea: '汐止區',
  serviceType: '送機 (雙北 => 桃園機場)',
  planeNo: 'xxz-12',
  pickUpDate: '2019-06-12',
  pickUpTime: '12:59',
  targetAddress: '研究院路1段101巷16弄2號10樓',
  name: '陳星汝',
  phone: '986909321',
  email: 'loveyou40620@yahoo.com.tw',
  totalPeople: 1,
  remark: '',
  luggage: '2',
  carType: 'normal',
  amount: '1000',
  transactionId: 'reserve-2019061487645529300',
  __v: 0
}
describe('pay', () => {
  describe('reserve and then confirm', () => {
    test('should print expected log', async () => {
      const response = await reserve({
        order,
        confirmUrl: 'http://localhost:3000/api/confirm'
      })
      console.log(response)
    })
  })
})
