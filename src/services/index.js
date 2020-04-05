import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { LoadingBar, Message } from 'view-design';

const baseUrl = '/apis/linkingthing.com/example/v1';

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
        return res
    }, err => {
        console.log(err)
        if (err.response.data.code === 401) {
            Message.error(err.response.data.message)
            router.push('/login')
        }
        LoadingBar.error();

    },
)

export default {
    getCaptcha() {
        return axios.get(`${baseUrl}/getcheckimage.jpeg`)
    },
    verifyCaptcha(params) {
        // CheckValueToken CheckValue
        return axios.get(`${baseUrl}/checkvalue`, { params })
    },
    login(params) {
        return axios.post(`${baseUrl}/login`, params)
    },
    updatePassword(params) {
        return axios.post(`${baseUrl}/changepwd`, params)
    },
    // 权威管理

    // 视图
    createView(params) {
        return axios.post(`${baseUrl}/views`, params)
    },
    getViewList() {
        return axios.get(`${baseUrl}/views`)
    },
    deleteViewById(id) {
        return axios.delete(`${baseUrl}/views/${id}`)
    },
    updateView(id, params) {
        return axios.put(`${baseUrl}/views/${id}`, params)
    },

    // 优先级
    getPriority() {
        return axios.get(`${baseUrl}/sortlists/1`)
    },
    createPriority(params) {
        return axios.post(`${baseUrl}/sortlists`, params)
    },
    updatePriority(params) {
        return axios.put(`${baseUrl}/sortlists/1`, params)
    },
    deletePriority() {
        return axios.delete(`${baseUrl}/sortlists/1`)
    },

    getZoneByViewId(id) {
        return axios.get(`${baseUrl}/views/${id}/zones`)
    },
    deleteZone(viewId, zoneId) {
        return axios.delete(`${baseUrl}/views/${viewId}/zones/${zoneId}`)
    },
    createZone(viewId, params) {
        return axios.post(`${baseUrl}/views/${viewId}/zones`, params)
    },

    // 资源记录
    getResourceRecord(viewId, zoneId) {
        return axios.get(`${baseUrl}/views/${viewId}/zones/${zoneId}/rrs`)
    },
    createResourceRecord(viewId, zoneId, params) {
        return axios.post(`${baseUrl}/views/${viewId}/zones/${zoneId}/rrs`, params)
    },
    deleteResourceById(viewId, zoneId, id) {
        return axios.delete(`${baseUrl}/views/${viewId}/zones/${zoneId}/rrs/${id}`)
    },
    getResourceRecordById(viewId, zoneId, id) {
        return axios.get(`${baseUrl}/views/${viewId}/zones/${zoneId}/rrs/${id}`)
    },
    updateResource(viewId, zoneId, id, params) {
        return axios.put(`${baseUrl}/views/${viewId}/zones/${zoneId}/rrs/${id}`, params)
    },

    getAccessById(id) {
        return axios.get(`${baseUrl}/acls/${id}`)
    },
    getAccessList() {
        return axios.get(`${baseUrl}/acls`)
    },
    createAccess(params) {
        return axios.post(`${baseUrl}/acls`, params)
    },
    updateAccess(id, params) {
        return axios.put(`${baseUrl}/acls/${id}`, params)
    },
    deleteAccess(id) {
        return axios.delete(`${baseUrl}/acls/${id}`)
    },

    // 重定向
    geRedirectionsByViewId(viewId) {
        return axios.get(`${baseUrl}/views/${viewId}/redirections`)
    },
    deleteRedirection(viewId, redirectionId) {
        return axios.delete(`${baseUrl}/views/${viewId}/redirections/${redirectionId}`)
    },
    createRedirect(viewId, params) {
        return axios.post(`${baseUrl}/views/${viewId}/redirections`, params)
    },
    updateRedirect(viewId, redirectionId, params) {
        return axios.put(`${baseUrl}/views/${viewId}/redirections/${redirectionId}`, params)
    },


    // 递归管理

    getDefaultDNS64List() {
        return axios.get(`${baseUrl}/defaultdns64s`)
    },
    deleteDefaultDNS64ById(id) {
        return axios.delete(`${baseUrl}/defaultdns64s/${id}`)
    },
    createDefaultDNS64(params) {
        return axios.post(`${baseUrl}/defaultdns64s`, params)
    },
    getDefaultDNS64ById(id) {
        return axios.get(`${baseUrl}/defaultdns64s/${id}`)
    },
    updateDefaultDNS64(id, params) {
        return axios.put(`${baseUrl}/defaultdns64s/${id}`, params)
    },



    getDNS64sByViewId(viewId) {
        return axios.get(`${baseUrl}/views/${viewId}/dns64s`)
    },
    createDNS64(viewId, params) {
        return axios.post(`${baseUrl}/views/${viewId}/dns64s`, params)
    },
    getOneDNS64ById(viewId, dnsId) {
        return axios.get(`${baseUrl}/views/${viewId}/dns64s/${dnsId}`)
    },
    deleteDNS64sByViewIdAndDnsId(viewId, dns64Id) {
        return axios.delete(`${baseUrl}/views/${viewId}/dns64s/${dns64Id}`)
    },
    updateDNS64(viewId, dns64Id, params) {
        return axios.put(`${baseUrl}/views/${viewId}/dns64s/${dns64Id}`, params)
    },


    // 转发
    getDefaultForward() {
        return axios.get(`${baseUrl}/forwards`)
    },

    deleteDefaultForwardById(id) {
        return axios.delete(`${baseUrl}/forwards/${id}`)
    },
    updateDefaultForward(params) {
        return axios.put(`${baseUrl}/forwards/forward`, params)
    },

    getForwardList(viewId, zoneId, params) {
        return axios.post(`${baseUrl}/views/${viewId}/zones/${zoneId}?action=forward`, params)
    },

    deleteForward(viewId, zoneId, params) {
        return axios.post(`${baseUrl}/views/${viewId}/zones/${zoneId}?action=forward`, params)
    },

    updateForward(viewId, zoneId, params) {
        return axios.post(`${baseUrl}/views/${viewId}/zones/${zoneId}?action=forward`, params)
    },


    // 安全管理

    getBlackList() {
        return axios.get(`${baseUrl}/ipblackholes`)
    },
    deleteBlackById(id) {
        return axios.delete(`${baseUrl}/ipblackholes/${id}`)
    },

    getRecursiveConcurrents() {
        return axios.get(`${baseUrl}/recursiveconcurrents`)
    },
    saveRecursiveConcurrents(params) {
        return axios.put(`${baseUrl}/recursiveconcurrents/con`, params)
    },
    createBlackList(aclid) {
        return axios.post(`${baseUrl}/ipblackholes`, aclid)
    },

    getNodeList(params) {
        return axios.get(`${baseUrl}/nodes`, { params })
    },
    getServerList() {
        return axios.get(`${baseUrl}/servers`)
    },
    getDeviceHistoryInfo(params) {
        return axios.get(`${baseUrl}/hists`, { params })
    },
    getDNSTop() {
        return axios.get(`${baseUrl}/dashdns`)
    },
    getDNSAnalysisState(params) {
        return axios.get(`${baseUrl}/retcode`, { params })
    },
    getMemoHitRate(params) {
        return axios.get(`${baseUrl}/memhit`, { params })
    },
    getDHCPAssign() {
        return axios.get(`${baseUrl}/dhcpassign`)
    },

    checkIPv6Prefix(params) {
        return axios.post(`${baseUrl}/checkipv6prefix`, params)
    },
    getSubtree(params) {
        return axios.post(`${baseUrl}/getsubtree`, { params })
    },
    createSubtree(params) {
        return axios.post(`${baseUrl}/createsubtree`, params)
    }
}