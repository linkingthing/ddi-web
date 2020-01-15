
import {
  fetchUserInfo
} from '../api'

const state = {
  userInfo:{}
}

const mutations = {
  SET_USER_INFO(state,{data}){
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
  mutations,
  actions
}
