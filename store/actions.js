import axios from 'axios'

const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit ({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit('SET_USER', req.session.authUser)
    }
  },
  async login ({ commit }, { username, password }) {
    try {
      const { data } = await axios.post('/api/login', { username, password })
      commit('SET_USER', data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('無效的帳號密碼')
      }
      throw error
    }
  },

  async logout ({ commit }) {
    await axios.post('/api/logout')
    commit('SET_USER', null)
  },

  async createOrder ({ commit }, data) {
    await axios.post('/api/orders', data)
  },

  async getOrders ({ commit }) {
    const { data: {orders} } = await axios.get('/api/orders')
    commit('SET_ORDERS', orders)
  }

}

export default actions
