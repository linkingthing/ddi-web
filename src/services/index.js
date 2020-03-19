import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { LoadingBar, Message } from 'view-design';

const dnsBaseUrl = '/dns';
const nodeBaseUrl = '/node'

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
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/getcheckimage.jpeg`)
    },
    verifyCaptcha(params) {
        // CheckValueToken CheckValue
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/checkvalue`, { params })
    },
    login(params) {
        return axios.post(`${dnsBaseUrl}/linkingthing.com/example/v1/login`, params)
    },
    updatePassword(params) {
        return axios.post(`${dnsBaseUrl}/linkingthing.com/example/v1/changepwd`, params)
    },
    // 权威管理

    // 视图
    createView(params) {
        return axios.post(`${dnsBaseUrl}/linkingthing.com/example/v1/views`, params)
    },
    getViewList() {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/views`)
    },
    deleteViewById(id) {
        return axios.delete(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${id}`)
    },
    updateView(id, params) {
        return axios.put(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${id}`, params)
    },

    getZoneByViewId(id) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${id}/zones`)
    },
    deleteZone(viewId, zoneId) {
        return axios.delete(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/zones/${zoneId}`)
    },
    createZone(viewId, params) {
        return axios.post(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/zones`, params)
    },

    // 资源记录
    getResourceRecord(viewId, zoneId) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/zones/${zoneId}/rrs`)
    },
    createResourceRecord(viewId, zoneId, params) {
        return axios.post(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/zones/${zoneId}/rrs`, params)
    },
    deleteResourceById(viewId, zoneId, id) {
        return axios.delete(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/zones/${zoneId}/rrs/${id}`)
    },
    getResourceRecordById(viewId, zoneId, id) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/zones/${zoneId}/rrs/${id}`)
    },
    updateResource(viewId, zoneId, id, params) {
        return axios.put(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/zones/${zoneId}/rrs/${id}`, params)
    },

    getAccessById(id) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/acls/${id}`)
    },
    getAccessList() {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/acls`)
    },
    createAccess(params) {
        return axios.post(`${dnsBaseUrl}/linkingthing.com/example/v1/acls`, params)
    },
    updateAccess(id, params) {
        return axios.put(`${dnsBaseUrl}/linkingthing.com/example/v1/acls/${id}`, params)
    },
    deleteAccess(id) {
        return axios.delete(`${dnsBaseUrl}/linkingthing.com/example/v1/acls/${id}`)
    },

    // 重定向
    geRedirectionsByViewId(viewId) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/redirections`)
    },
    deleteRedirection(viewId, redirectionId) {
        return axios.delete(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/redirections/${redirectionId}`)
    },
    createRedirect(viewId, params) {
        return axios.post(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/redirections`, params)
    },
    updateRedirect(viewId, redirectionId, params) {
        return axios.put(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/redirections/${redirectionId}`, params)
    },


    // 递归管理

    getDefaultDNS64List() {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/defaultdns64s`)
    },
    deleteDefaultDNS64ById(id) {
        return axios.delete(`${dnsBaseUrl}/linkingthing.com/example/v1/defaultdns64s/${id}`)
    },
    createDefaultDNS64(params) {
        return axios.post(`${dnsBaseUrl}/linkingthing.com/example/v1/defaultdns64s`, params)
    },
    getDefaultDNS64ById(id) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/defaultdns64s/${id}`)
    },
    updateDefaultDNS64(id, params) {
        return axios.put(`${dnsBaseUrl}/linkingthing.com/example/v1/defaultdns64s/${id}`, params)
    },



    getDNS64sByViewId(viewId) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/dns64s`)
    },
    createDNS64(viewId, params) {
        return axios.post(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/dns64s`, params)
    },
    getOneDNS64ById(viewId, dnsId) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/dns64s/${dnsId}`)
    },
    deleteDNS64sByViewIdAndDnsId(viewId, dns64Id) {
        return axios.delete(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/dns64s/${dns64Id}`)
    },
    updateDNS64(viewId, dns64Id, params) {
        return axios.put(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/dns64s/${dns64Id}`, params)
    },


    // 转发
    getDefaultForward() {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/forwards`)
    },

    deleteDefaultForwardById(id) {
        return axios.delete(`${dnsBaseUrl}/linkingthing.com/example/v1/forwards/${id}`)
    },
    updateDefaultForward(params) {
        return axios.put(`${dnsBaseUrl}/linkingthing.com/example/v1/forwards/forward`, params)
    },

    getForwardList(viewId, zoneId, params) {
        return axios.post(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/zones/${zoneId}?action=forward`, params)
    },

    deleteForward(viewId, zoneId, params) {
        return axios.post(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/zones/${zoneId}?action=forward`, params)
    },

    updateForward(viewId, zoneId, params) {
        return axios.post(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/zones/${zoneId}?action=forward`, params)
    },


    // 安全管理

    getBlackList() {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/ipblackholes`)
    },
    deleteBlackById(id) {
        return axios.delete(`${dnsBaseUrl}/linkingthing.com/example/v1/ipblackholes/${id}`)
    },

    getRecursiveConcurrents() {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/recursiveconcurrents`)
    },
    saveRecursiveConcurrents(params) {
        return axios.put(`${dnsBaseUrl}/linkingthing.com/example/v1/recursiveconcurrents/con`, params)
    },
    createBlackList(aclid) {
        return axios.post(`${dnsBaseUrl}/linkingthing.com/example/v1/ipblackholes`, aclid)
    },



    getNodeList(params) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/nodes`, { params })
    },
    getServerList() {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/servers`)
    },
    getDeviceHistoryInfo(params) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/hists`, { params })
    },
    getDNSTop() {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/dashdns`)
    },
    getDNSAnalysisState(params) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/retcode`, { params })
    },
    getMemoHitRate(params) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/memhit`, { params })
    },

    /**
     * 子网管理 start
     */

    /**
     * 获取子网管理列表
     */
    getChildNetList(){
        return axios.post("/apis/linkingthing/dhcp/v1/subnetv4s");
    }
}