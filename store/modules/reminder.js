import axios from 'axios'
import { FETCH_REMINDER, SET_REMINDER } from '../types'

export default {
  state: () => {
    return {
      reminder: null
    }
  },
  getters: {
    reminder: state => state.reminder
  },
  actions: {
    async [FETCH_REMINDER]({ commit }) {
      const { data } = await axios.get('/api/reminder')
      commit(SET_REMINDER, data)
    }
  },
  mutations: {
    [SET_REMINDER](state, reminder) {
      state.reminder = reminder
    }
  }
}
