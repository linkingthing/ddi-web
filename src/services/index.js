import axios from "axios";
import store from "@/store";
import router from "@/router";
import { LoadingBar, Message } from "view-design";

const baseUrl = "/apis/linkingthing.com/example/v1";

axios.interceptors.request.use(
  config => {
    LoadingBar.start();

    const token = store.getters.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {    
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  res => {
    LoadingBar.finish();
    return res;
  }, err => {
    console.error(err);

    if (err.response.data.code === 401) {
      Message.error(err.response.data.message);
      router.push("/login");
    }

    LoadingBar.error();

    return Promise.reject(err.response.data);
  },
);

export default {
  getCaptcha() {
    return axios.get(`${baseUrl}/getcheckimage.jpeg`);
  },
  verifyCaptcha(params) {
    // CheckValueToken CheckValue
    return axios.get(`${baseUrl}/checkvalue`, { params });
  },
  login(params) {
    return axios.post(`${baseUrl}/login`, params);
  },
  updatePassword(params) {
    return axios.post(`${baseUrl}/changepwd`, params);
  },
  // 权威管理

  // 视图
  createView(params) {
    return axios.post(`${baseUrl}/views`, params);
  },
  getViewList() {
    return axios.get(`${baseUrl}/views`);
  },
  deleteViewById(id) {
    return axios.delete(`${baseUrl}/views/${id}`);
  },
  updateView(id, params) {
    return axios.put(`${baseUrl}/views/${id}`, params);
  },

  // 优先级
  getPriority() {
    return axios.get(`${baseUrl}/sortlists/1`);
  },
  createPriority(params) {
    return axios.post(`${baseUrl}/sortlists`, params);
  },
  updatePriority(params) {
    return axios.put(`${baseUrl}/sortlists/1`, params);
  },
  deletePriority() {
    return axios.delete(`${baseUrl}/sortlists/1`);
  },

  getZoneByViewId(id, params) {
    return axios.get(`${baseUrl}/views/${id}/zones`, { params });
  },
  deleteZone(viewId, zoneId) {
    return axios.delete(`${baseUrl}/views/${viewId}/zones/${zoneId}`);
  },
  createZone(viewId, params) {
    return axios.post(`${baseUrl}/views/${viewId}/zones`, params);
  },

  // 资源记录
  getResourceRecord(viewId, zoneId) {
    return axios.get(`${baseUrl}/views/${viewId}/zones/${zoneId}/rrs`);
  },
  createResourceRecord(viewId, zoneId, params) {
    return axios.post(`${baseUrl}/views/${viewId}/zones/${zoneId}/rrs`, params);
  },
  deleteResourceById(viewId, zoneId, id) {
    return axios.delete(`${baseUrl}/views/${viewId}/zones/${zoneId}/rrs/${id}`);
  },
  getResourceRecordById(viewId, zoneId, id) {
    return axios.get(`${baseUrl}/views/${viewId}/zones/${zoneId}/rrs/${id}`);
  },
  updateResource(viewId, zoneId, id, params) {
    return axios.put(`${baseUrl}/views/${viewId}/zones/${zoneId}/rrs/${id}`, params);
  },

  getAccessById(id) {
    return axios.get(`${baseUrl}/acls/${id}`);
  },
  getAccessList() {
    return axios.get(`${baseUrl}/acls`);
  },
  createAccess(params) {
    return axios.post(`${baseUrl}/acls`, params);
  },
  updateAccess(id, params) {
    return axios.put(`${baseUrl}/acls/${id}`, params);
  },
  deleteAccess(id) {
    return axios.delete(`${baseUrl}/acls/${id}`);
  },

  // 重定向
  geRedirectionsByViewId(viewId) {
    return axios.get(`${baseUrl}/views/${viewId}/redirections`);
  },
  deleteRedirection(viewId, redirectionId) {
    return axios.delete(`${baseUrl}/views/${viewId}/redirections/${redirectionId}`);
  },
  createRedirect(viewId, params) {
    return axios.post(`${baseUrl}/views/${viewId}/redirections`, params);
  },
  updateRedirect(viewId, redirectionId, params) {
    return axios.put(`${baseUrl}/views/${viewId}/redirections/${redirectionId}`, params);
  },


  // 递归管理

  getDefaultDNS64List() {
    return axios.get(`${baseUrl}/defaultdns64s`);
  },
  deleteDefaultDNS64ById(id) {
    return axios.delete(`${baseUrl}/defaultdns64s/${id}`);
  },
  createDefaultDNS64(params) {
    return axios.post(`${baseUrl}/defaultdns64s`, params);
  },
  getDefaultDNS64ById(id) {
    return axios.get(`${baseUrl}/defaultdns64s/${id}`);
  },
  updateDefaultDNS64(id, params) {
    return axios.put(`${baseUrl}/defaultdns64s/${id}`, params);
  },



  getDNS64sByViewId(viewId) {
    return axios.get(`${baseUrl}/views/${viewId}/dns64s`);
  },
  createDNS64(viewId, params) {
    return axios.post(`${baseUrl}/views/${viewId}/dns64s`, params);
  },
  getOneDNS64ById(viewId, dnsId) {
    return axios.get(`${baseUrl}/views/${viewId}/dns64s/${dnsId}`);
  },
  deleteDNS64sByViewIdAndDnsId(viewId, dns64Id) {
    return axios.delete(`${baseUrl}/views/${viewId}/dns64s/${dns64Id}`);
  },
  updateDNS64(viewId, dns64Id, params) {
    return axios.put(`${baseUrl}/views/${viewId}/dns64s/${dns64Id}`, params);
  },


  // 转发
  getDefaultForward() {
    return axios.get(`${baseUrl}/forwards`);
  },

  deleteDefaultForwardById(id) {
    return axios.delete(`${baseUrl}/forwards/${id}`);
  },
  updateDefaultForward(params) {
    return axios.put(`${baseUrl}/forwards/forward`, params);
  },

  getForwardList(viewId, zoneId, params) {
    return axios.post(`${baseUrl}/views/${viewId}/zones/${zoneId}?action=forward`, params);
  },

  deleteForward(viewId, zoneId, params) {
    return axios.post(`${baseUrl}/views/${viewId}/zones/${zoneId}?action=forward`, params);
  },

  updateForward(viewId, zoneId, params) {
    return axios.post(`${baseUrl}/views/${viewId}/zones/${zoneId}?action=forward`, params);
  },


  // 安全管理

  getBlackList() {
    return axios.get(`${baseUrl}/ipblackholes`);
  },
  deleteBlackById(id) {
    return axios.delete(`${baseUrl}/ipblackholes/${id}`);
  },

  getRecursiveConcurrents() {
    return axios.get(`${baseUrl}/recursiveconcurrents`);
  },
  saveRecursiveConcurrents(params) {
    return axios.put(`${baseUrl}/recursiveconcurrents/con`, params);
  },
  createBlackList(aclid) {
    return axios.post(`${baseUrl}/ipblackholes`, aclid);
  },

  getNodeList(params) {
    return axios.get(`${baseUrl}/nodes`, { params });
  },
  getServerList() {
    return axios.get(`${baseUrl}/servers`);
  },
  getDeviceHistoryInfo(params) {
    return axios.get(`${baseUrl}/hists`, { params });
  },
  getDNSTop() {
    return axios.get(`${baseUrl}/dashdns`);
  },
  getDNSAnalysisState(params) {
    return axios.get(`${baseUrl}/retcode`, { params });
  },
  getMemoHitRate(params) {
    return axios.get(`${baseUrl}/memhit`, { params });
  },
  getDHCPAssign() {
    return axios.get(`${baseUrl}/dashdhcpassign`);
  },

  checkIPv6Prefix(params) {
    return axios.post(`${baseUrl}/checkipv6prefix`, params);
  },
  getSubtree(params) {
    return axios.get(`${baseUrl}/getsubtree`, { params });
  },
  createSubtree(params) {
    return axios.post(`${baseUrl}/createsubtree`, params);
  },
  updateSubtree(params) {
    return axios.post(`${baseUrl}/updatesubtree`, params);
  },
  deleteSubtree(params) {
    return axios.post(`${baseUrl}/deletesubtree`, params);
  },
  /** 子网管理 start */

  /**
   * 获取子网管理列表
   */
  getChildNetList() {
    return axios.get(`${baseUrl}/restsubnetv46s`);
  },

  /**
   * 新增IPv4子网
   */
  addIPv4ChildNet(params) {
    return axios.post(`${baseUrl}/restsubnetv4s`, params);
  },

  /**
   * 新增IPv6子网
   */
  addIPv6ChildNet(params) {
    return axios.post(`${baseUrl}/restsubnetv6s`, params);
  },

  /**
   * 编辑IPv4子网
   */
  editIPv4ChildNet(params, id) {
    return axios.put(`${baseUrl}/restsubnetv4s/${id}`, params);
  },

  /**
   * 编辑IPv6子网
   */
  editIPv6ChildNet(params, id) {
    return axios.put(`${baseUrl}/restsubnetv6s/${id}`, params);
  },

  /**
   * 删除指定IPv4子网
   */
  deleteIPv4ChildNet(id) {
    return axios.delete(`${baseUrl}/restsubnetv4s/${id}`);
  },

  /**
   * 删除指定IPv6子网
   */
  deleteIPv6ChildNet(id) {
    return axios.delete(`${baseUrl}/restsubnetv6s/${id}`);
  },

  /**
   * 拆分IPv4子网
   */
  splitIPv4ChildNet(params, subnetId) {
    return axios.post(`${baseUrl}/restsubnetv4s/${subnetId}?action=mergesplit`, params);
  },

  /**
   * 拆分IPv6子网
   */
  splitIPv6ChildNet(params, subnetId) {
    return axios.post(`${baseUrl}/restsubnetv6s/${subnetId}?action=mergesplit`, params);
  },

  /**
   * 合并IPv4子网
   */
  mergeIPv4ChildNet(params) {
    return axios.post(`${baseUrl}/restsubnetv4s?action=mergesplit`, params);
  },

  /**
   * 合并IPv6子网
   */
  mergeIPv6ChildNet(params) {
    return axios.post(`${baseUrl}/restsubnetv6s?action=mergesplit`, params);
  },

  /**
   * 获取规划IP地址列表
   */
  getPlanIpList(id) {
    return axios.get(`${baseUrl}/dividedaddresses/?subnetid=${id}`);
  },

  /**
   * IP地址扩展属性设置
   * @param {String|Number} id IP的ID
   * @param {Object} params 
   */
  editSubnetConfig(id, params) {
    return axios.put(`${baseUrl}/ipattrappends/${id}`, params);
  },

  /**
   * IP地址属性设置
   * @param {String|Number} id IP的ID
   * @param {Object} params 
   */
  editIpInfo(id, params) {
    return axios.put(`${baseUrl}/dividedaddresses/${id}`, params);
  },

  /**
   * 地址扫描
   */
  addressScanning(id) {
    return axios.get(`${baseUrl}/scanaddresses/${id}`);
  },

  /**
   * 删除IP地址
   */
  deleteIpAddress(id) {
    return axios.delete(`${baseUrl}/scanaddresses/${id}`);
  },

  /**
   * 转固定或保留
   */
  changeToFixOrKeep(id, parmas) {
    return axios.post(`${baseUrl}/dividedaddresses/${id}?action=change`, parmas);
  },

  /**
   * 获取地址池子网列表
   */
  getAddressPoolSubnetList(subnetId) {
    // return axios.get(`${baseUrl}/restsubnetv4s/${subnetId}/restpools`);
    return this.getChildNetList();
  },

  /**
   * 获取IPv4地址池列表
   */
  getIPv4AddressPoolList(subnetId) {
    return axios.get(`${baseUrl}/restsubnetv4s/${subnetId}/restpools`);
  },

  /**
   * 获取IPv6地址池列表
   */
  getIPv6AddressPoolList(subnetId) {
    return axios.get(`${baseUrl}/restsubnetv6s/${subnetId}/restpoolv6s`);
  },

  /**
   * 修改/新增ipv6地址池
   */
  saveIpv6AddressPool({ subnetId, poolId, params, type = "post" }) {
    let url = `${baseUrl}/restsubnetv4s/${subnetId}/restpools`;

    url = poolId ? `${url}/${poolId}` : url;

    return axios[type](url, params);
  },

  /**
   * 修改/新增ipv4地址池
   */
  saveIpv4AddressPool({ subnetId, poolId, params, type = "post" }) {
    let url = `${baseUrl}/restsubnetv4s/${subnetId}/restpools`;

    url = poolId ? `${url}/${poolId}` : url;

    return axios[type](url, params);
  },

  /**
   * 删除IPv4地址池
   */
  deleteIPv4AddressPool(subnetId, poolId) {
    return axios.delete(`${baseUrl}/restsubnetv4s/${subnetId}/restpools/${poolId}`);
  },

  /**
   * 删除IPv6地址池
   */
  deleteIPv6AddressPool(subnetId, poolId) {
    return axios.delete(`${baseUrl}/restsubnetv6s/${subnetId}/restpoolv6s/${poolId}`);
  },

  /** 子网管理 end */

  /** OPTOIN配置 start */

  /**
   * 获取OPTION配置列表
   */
  getOptionList() {
    return axios.get(`${baseUrl}/restoptionnames`);
  },

  /**
   * 删option
   */
  deleteOption(id) {
    return axios.delete(`${baseUrl}/restoptionnames/${id}`);
  },

  /**
   * 添加option
   */
  addOption(params) {
    return axios.post(`${baseUrl}/restoptionnames`, params);
  },

  /**
   * 编辑option
   */
  editOption(params, id) {
    return axios.put(`${baseUrl}/restoptionnames/${id}`, params);
  }

  /** OPTOIN配置 end */
};