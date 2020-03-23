export const isIPv4Reg = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/

export const isIPv6Reg = /^(([\da-fA-F]{1,4}):){7}[\da-fA-F]$/
export const fullIPv6Reg = /^(([\da-fA-F]{1,4}):){7}([\da-fA-F]{1,4}){1}$/

export const nameReg = /^[a-zA-Z0-9_]{1,63}$/

export const prefixReg = /::\/(32|40|48|56|64|96)$/

export const ipUnitReg = /[0-9a-fA-F]{4}/g

export const positiveIntegerReg = /^[1-9]?[0-9]+$/

export const nameValidate = {
    pattern: nameReg,
    message: "名称由不超过64个a-zA-Z0-9_组成"
}

export const isIPv4Validate = {
    pattern: isIPv4Reg,
    message: "请正确输入IPv4地址"
}

export const isIPv6Validate = {
    pattern: fullIPv6Reg,
    message: "请正确输入IPv6地址"
}

export const requiredValidate = { required: true, message: "该项必填" }


export const positiveIntegerValidate = {
    pattern: positiveIntegerReg,
    message: "请输入正整数"
}

export const prefixValidate = {
    pattern: prefixReg,
    message: "格式以十六进制表示,以'::/N'结尾,N可以为32,40,48,56,64,96中的一个"
}