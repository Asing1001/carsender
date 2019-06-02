import axios from 'axios'
import { FETCH_CAR_PRICE, SET_CAR_PRICE } from '../types'

export default {
  state: () => {
    return {
      carPrices: []
    }
  },
  getters: {
    carPrices: state => state.carPrices
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
