import Vue from 'vue'
import VueResource from 'vue-resource'
import { API } from '../config'
// import { Loading } from 'element-ui'
// import { getQueryString } from '../util/common'

Vue.use(VueResource)
Vue.http.options.emulateJSON = true

Vue.http.options.headers = {
  "Content-Type": "application/json;charset=utf-8"
}

Vue.http.interceptors.push((request, next) => {
  // const { AUDITOR_ID, access_token } = localStorage
  //const newsToken = process.env.NODE_ENV === 'development' ? token : access_token
  // if (request.params) {
  //   for (let key in request.params) {
  //     request.params[key] || (delete request.params[key])
  //   }
  //   request.params.access_token = access_token
  //   request.params.roleMemberId = getQueryString('userId') || AUDITOR_ID
  // } else {
  //   request.params = {
  //     access_token: access_token,
  //   }
  // }
  next(response => {
    //返回没有权限提示

  	// if (response.body.status == 'fail') {
		// Loading.service({ fullscreen: true, text: response.body.message, customClass: 'no_power'})
    // }
    //let status = false // 限制跨域调接口只执行一次
    //if (response.status === 401) {
      // if (!status) {
      //   const execObj = document.createElement('iframe')
      //   execObj.src = ENV_VAR.omsReLogin
      //   execObj.style.display = 'none'
      //   document.body.appendChild(execObj)
      //   status = true
      // }
    //}
  })
})



// 集群管理
export const fetchDeviceList = params => Vue.http.get(API.deviceList, params )
export const fetchDeviceUpdate = params => Vue.http.post(API.deviceUpdate, params)



