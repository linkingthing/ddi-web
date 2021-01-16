import { axios } from "@/util/axios";

const baseUrl = "/apis/linkingthing.com/dns/v1";

export default {
  getCaptcha() {
    return axios.get(`${baseUrl}/getcheckimage.jpeg`);
  },
  verifyCaptcha(params) {
    // CheckValueToken CheckValue
    return axios.get(`${baseUrl}/checkvalue`, { params });
  },
  login(params) {
    return axios.post(`/login`, params);
  },
  updatePassword(params) {
    return axios.post(`/apis/linkingthing.com/auth/v1/users`, params);
  },
  // 权威管理

  // 视图
  createView(params) {
    return axios.post(`${baseUrl}/views`, params);
  },
  getViewList(params) {
    return axios.get(`${baseUrl}/views`, { params });
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
  getResourceRecord(viewId, zoneId, params) {
    return axios.get(`${baseUrl}/views/${viewId}/authzones/${zoneId}/authrrs`, {
      params
    });
  },
  createResourceRecord(viewId, zoneId, params) {
    return axios.post(`${baseUrl}/views/${viewId}/authzones/${zoneId}/authrrs`, params);
  },
  deleteResourceById(viewId, zoneId, id) {
    return axios.delete(`${baseUrl}/views/${viewId}/authzones/${zoneId}/authrrs/${id}`);
  },
  getResourceRecordById(viewId, zoneId, id) {
    return axios.get(`${baseUrl}/views/${viewId}/authzones/${zoneId}/authrrs/${id}`);
  },
  updateResource(viewId, zoneId, id, params) {
    return axios.put(
      `${baseUrl}/views/${viewId}/authzones/${zoneId}/authrrs/${id}`,
      params
    );
  },

  getAccessById(id) {
    return axios.get(`${baseUrl}/acls/${id}`);
  },
  getAccessList(params) {
    return axios.get(`${baseUrl}/acls`, { params });
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
  geRedirectionsByViewId(viewId, params) {
    return axios.get(`${baseUrl}/views/${viewId}/redirections`, { params });
  },
  deleteRedirection(viewId, redirectionId) {
    return axios.delete(
      `${baseUrl}/views/${viewId}/redirections/${redirectionId}`
    );
  },
  createRedirect(viewId, params) {
    return axios.post(`${baseUrl}/views/${viewId}/redirections`, params);
  },
  updateRedirect(viewId, redirectionId, params) {
    return axios.put(
      `${baseUrl}/views/${viewId}/redirections/${redirectionId}`,
      params
    );
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
    return axios.post(
      `${baseUrl}/views/${viewId}/zones/${zoneId}?action=forward`,
      params
    );
  },

  deleteForward(viewId, zoneId, params) {
    return axios.post(
      `${baseUrl}/views/${viewId}/zones/${zoneId}?action=forward`,
      params
    );
  },

  updateForward(viewId, zoneId, params) {
    return axios.post(
      `${baseUrl}/views/${viewId}/zones/${zoneId}?action=forward`,
      params
    );
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
  getChildNetList(subnet) {
    let url = `${baseUrl}/restsubnetv46s`;

    if (subnet) {
      url += `?subnet=${subnet}`;
    }

    return axios.get(url);
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
    return axios.post(
      `${baseUrl}/restsubnetv4s/${subnetId}?action=mergesplit`,
      params
    );
  },



};
