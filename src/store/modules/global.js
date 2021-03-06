import { post } from "@/util/axios";
import store from "@/util/store";
import { cloneDeep, throttle } from "lodash";
const Cache = store("localStorage");
import resources, { operateMap } from "@/dictionary/resources";

const state = {
  token: "" || Cache.get("token"),
  userType: "",
  userInfo: null,

  alarmCount: 0,
  agentEventList: [],
  agentAssociatedCount: 0,

  routes: [],
  routesCounter: 1,
};

const getters = {
  token: state => state.token,
  userType: state => state.userType,
  userInfo: state => state.userInfo,
  alarmCount: state => state.alarmCount,
  agentEventCount: state => state.agentEventList.length,
  agentEventAll: throttle(state => {
    if (state.agentAssociatedCount) {
      return state.agentEventList.map(item => {
        const message = `${operateMap[item.method]} ${
          resources[item.resource]
        } ${item.succeed ? "成功" : "失败"} `;
        return {
          ...item,
          message
        };
      });
    } else {
      return [];
    }
  }, 400),
  routes: state => state.routes,
  rangeList: state => {
    return getRouteRange(state.routes);
  }
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
  },
  setAlarmCount(state, count) {
    state.alarmCount = count;
  },
  addAgentEventList(state, agentEvent) {
    state.agentEventList.unshift(agentEvent);
    state.agentAssociatedCount++;
  },

  setRoutes(state, routes) {
    state.routes = cloneDeep(routes);
  }
};

const actions = {
  getUserInfo({ commit }) {
    const { token } = state;
    const params = {
      token
    };
    return new Promise((resolve, reject) => {
      post({
        url: "/apis/linkingthing.com/auth/v1/users/user?action=currentUser",
        params
      })
        .then(userInfo => {
          commit("SET_USERINFO", userInfo);
          resolve(userInfo);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

export function getRouteRange(routes, result = []) {
  if (Array.isArray(routes)) {
    routes.forEach(item => {
      const range = item.meta.range;
      if (range) {
        if (!result.includes(range)) {
          result.push(range);
        }
      }
      getRouteRange(item.children, result);
    });
  }
  return result;
}

export default {
  state,
  getters,
  mutations,
  actions
};
