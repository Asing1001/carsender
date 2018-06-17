
const state = () => ({
  sidebar: false,
  authUser: null,
  orders: []
})

const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  },
  SET_USER (state, user) {
    state.authUser = user
  },
  SET_ORDERS (state, orders) {
    state.orders = orders
  }
}

export { mutations, state }
