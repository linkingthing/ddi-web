let ENV = 'develop'


export const HOSTS = {
  develop: {
    api: '/reyzar' // 测试环境
  },
  product: {
    api: ''
  }
}

export const ROOT = HOSTS[ENV]



let newVar = {
  // 设备管理列表
  deviceList: ROOT.api + '/front/device/list.jhtml',
  // 设备修改
  deviceUpdate: ROOT.api + '/front/device/update.jhtml',




};
export const API = newVar
