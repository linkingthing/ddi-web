import axios from 'axios'

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
    getNodeList(params) {
        // todo: 后期建议改成标砖restfull
        return axios.post(`${nodeBaseUrl}/linkingthing/node/v1/nodes?${params2Query(params)}`)
    },
    getDeviceHistoryInfo(params) {
        return axios.post(`${nodeBaseUrl}/linkingthing/node/v1/hists?${params2Query(params)}`)
    }
}