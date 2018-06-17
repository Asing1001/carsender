
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
  },
  DELETE_ORDERS (state, order) {
    const index = state.orders.indexOf(order)
    state.orders = [ ...state.orders.slice(0, index), ...state.orders.slice(index + 1) ]
  }
}

export { mutations, state }
