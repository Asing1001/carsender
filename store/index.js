import Vuex from 'vuex'
import { state, mutations } from './mutations'
import actions from './actions'
import carPrice from './modules/carPrice'

const createStore = () => {
  return new Vuex.Store({
    state,
    mutations,
    actions,
    modules: {
      carPrice
    }
  })
}

export default createStore
