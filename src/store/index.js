import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import { isDataType, isEmpty } from '../util/common'

Vue.use(Vuex)

const Cache = require('../util/store').default('sessionStorage')


export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    store => {
      store.subscribe(({ type, payload }) => {
        if (payload.key) {
          if (isDataType(payload.data, 'Array')) {
            if (payload.data.length) {
              Cache.set(payload.key, payload.data)
            }
          } else
          if (isEmpty(payload.data)) {
            Cache.set(payload.key, payload.data)
          }
        }
      })
    }
  ],
  modules
})
