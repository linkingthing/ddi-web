
const Cache = require("@/util/store").default("localStorage");

const state = {
  token: '' || Cache.get('token'),
  userInfo: {}
}

const getters = {
  token: (state) => state.token,
}

const mutations = {
  SET_TOKEN(state, token) {
    Cache.set("token", token);
    state.token = token;
  },
  SET_USER_INFO(state, { data }) {
    state.userInfo = data
  }
}

const actions = {

}

export default {
  state,
  getters,
  mutations,
  actions
}
