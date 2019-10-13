import axios from 'axios'
import { FETCH_CAR_PRICE, SET_CAR_PRICE } from '../types'

export default {
  state: () => {
    return {
      carPrices: []
    }
  },
  getters: {
    carPrices: state => serviceType => {
      const airport = serviceType.includes('松山') ? '松山' : '桃園'
      return state.carPrices.filter(carPrice => carPrice.airport === airport)
    }
  },
  actions: {
    async [FETCH_CAR_PRICE]({ commit }) {
      const { data } = await axios.get('/api/carPrice')
      commit(SET_CAR_PRICE, data)
    }
  },
  mutations: {
    [SET_CAR_PRICE](state, carPrices) {
      state.carPrices = carPrices
    }
  }
}
