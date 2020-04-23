import services from "@/services";

const Cache = require("@/util/store").default("localStorage");

const state = {
  token: "" || Cache.get("token"),
  userInfo: {},
  viewList: []
};

const getters = {
  token: state => state.token,
  getViewList: state => state.viewList
};

const mutations = {
  SET_TOKEN(state, token) {
    Cache.set("token", token);
    state.token = token;
  },
  SET_USER_INFO(state, { data }) {
    state.userInfo = data;
  },
  SET_VIEW_LIST(state, { data }) {
    state.viewList = data;
  }
};

const actions = {
  async getViewList({ commit }) {
    try {
      const { status, data } = await services.getViewList();

      if (+status === 200) {
        const res = data.data.map(item => ({ 
          ...item,
          label: item.name, 
          value: item.id
        }));

        commit("SET_VIEW_LIST",{ 
          viewList: res
        });

        return res;
      }
      else {
        Promise.reject({ message: "" });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
