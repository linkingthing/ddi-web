import axios from 'axios'
import dns from '../router/dns';

const dnsBaseUrl = '/dns';
const nodeBaseUrl = '/node'

/**
 * 
 * const p = {
    name: 'ranck',
    age: 27
   }
    name=ranck&age=27
*/

function params2Query(params) {
    return Object.entries(params).map((item) => {
        return item.join('=')
    }).join('&')
}



export default {
    // 权威管理
    getViewList() {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/views`)
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
    getResourceRecord(viewId, zoneId) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/zones/${zoneId}/rrs`)
    },

    getAccessList() {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/acls`)
    },

    geRedirectionsByViewId(viewId) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/redirections`)
    },
    deleteRedirection(viewId, redirectionId) {
        return axios.delete(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/redirections/${redirectionId}`)
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
    updateDefaultDNS64(id, params) {
        return axios.put(`${dnsBaseUrl}/linkingthing.com/example/v1/defaultdns64s/${id}`, params)
    },

    getDNS64sByViewId(viewId) {
        return axios.get(`${dnsBaseUrl}/linkingthing.com/example/v1/views/${viewId}/dns64s`)
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
        // todo: 后期建议改成标砖restfull
        return axios.post(`${nodeBaseUrl}/linkingthing/node/v1/nodes?${params2Query(params)}`)
    },
    getDeviceHistoryInfo(params) {
        return axios.post(`${nodeBaseUrl}/linkingthing/node/v1/hists?${params2Query(params)}`)
    }
}