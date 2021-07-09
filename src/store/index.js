import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import address from './store-address'

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      address
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
