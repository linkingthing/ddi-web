
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
  //获取用户信息
  //  FETCH_USER_INFO: ({ commit }) => new Promise((resolve, reject) => {
  //   fetchUserInfo()
  //         .then(res => {
  //             const data = res.body.data
  //             commit('SET_USER_INFO', { data })
  //             resolve()
  //         })
  //         .catch(err => {
  //             reject(err)
  //         })
  //   })
}

export default {
  state,
  getters,
  mutations,
  actions
}
