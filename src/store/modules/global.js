import { post } from "@/util/axios";
import store from "@/util/store";
const Cache = store("localStorage");

const state = {
  token: "" || Cache.get("token"),
  userType: "",
  userInfo: null
};

const getters = {
  token: state => state.token,
  userType: state => state.userType,
  userInfo: state => state.userInfo,
  hasPermissionToCreate: state => state.userInfo && state.userInfo.userType === "superUser"
};

const mutations = {
  SET_TOKEN(state, token) {
    Cache.set("token", token);
    state.token = token;
  },
  SET_USERTYPE(state, userType) {
    state.userType = userType;
  },
  SET_USERINFO(state, userInfo) {
    state.userInfo = userInfo;
  }
};

const actions = {
  getUserInfo({ commit }) {
    const { token, userInfo } = state;
    const params = {
      token
    };
    return new Promise((resolve, reject) => {
      if (userInfo) {
        resolve(userInfo);
      } else {
        post({
          url:
            "/apis/linkingthing.com/auth/v1/ddiusers/ddiuser?action=currentUser",
          params
        })
          .then(userInfo => {
            commit("SET_USERINFO", userInfo);
            resolve(userInfo);
          })
          .catch(err => {

            // todo: 需要删掉
            commit("SET_USERINFO", {userType: "superUser"});
            resolve({userType: "superUser"});


            reject(err);
          });
      }
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
