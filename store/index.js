import Vuex from 'vuex'
import { state, mutations } from './mutations'
import actions from './actions'

const createStore = () => {
  return new Vuex.Store({
    state,
    mutations,
    actions
  })
}

export default createStore
