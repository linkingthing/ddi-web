// 中间件

import {
    fetchDeviceList,
    fetchDeviceUpdate
} from '../store/api'

import { unique } from '../util/common'

// 设备列表
export const fetchDeviceListApi = (params) => {
    return new Promise((resolve,reject) => {
        fetchDeviceList(params).then(res => {
            // 自定义字段
            let custom = {}

            let content = res.data.content
            if(content.length > 0){
                let lable = []
                let lable2 = []
                let lable3 = []
                let variable = []
                let variable2 = []
                let variable3 = []

                for(let i = 0; i < content.length; i++){
                    lable.push(content[i].name)
                    
                    if(content[i].type == 1){// ATE
                        lable2.push('ATE')
                    }else if(content[i].type == 2){// EAG
                        lable2.push('EAG')
                    }else if(content[i].type == 3){// NTE
                        lable2.push('NTE')
                    }

                    lable3.push(content[i].cluster.clusterName)
                }
                lable = unique(lable)
                lable2 = unique(lable2)
                lable3 = unique(lable3)

                for(var i in lable){
                    variable.push({
                        label: lable[i],
                        value: lable[i]
                    })
                }
                
                for(var i in lable2){
                    variable2.push({
                        label: lable2[i],
                        value: content[i].type
                    })
                }

                for(var i in lable3){
                    variable3.push({
                        label: lable3[i],
                        value: lable3[i]
                    })
                }

                custom.variable = variable
                custom.variable2 = variable2
                custom.variable3 = variable3
            }


            res.body.custom = custom
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

// 更新设备
export const fetchDeviceUpdateApi = (params) => {
    return new Promise((resolve,reject) => {
        fetchDeviceUpdate(params).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}