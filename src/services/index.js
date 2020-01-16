import axios from 'axios'

const nodeBaseUrl = '/node'

export default {
    getNodeList(params) {
        return axios.post(`${nodeBaseUrl}/linkingthing/node/v1/nodes`, params)
    }
}