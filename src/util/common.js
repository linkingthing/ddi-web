const Cache = require('./store').default('sessionStorage')
// 判断是否指定类型
export const isDataType = (data, type = 'Object') => {
    return Object.prototype.toString.call(data) === `[object ${type}]`
}
// 判断是否空
export const isEmpty = (str) => {
    return !!str && str !== 'undefined' && str !== 'null'
}
// 判断是否是中文
export const isChinese = (temp) => {
    var re = /^[\u4e00-\u9fa5]/;
    if (re.test(temp)) return true;
    return false;
}

//判断是否是url，包括域名和ip
export const isURL = (str_url) => {
    var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
        + '?(([0-9a-z_!~*().&=+$%-]+: )?[0-9a-z_!~*().&=+$%-]+@)?' //ftp的user@
        + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
        + '|' // 允许IP和DOMAIN（域名）
        + '([0-9a-z_!~*()-]+.)*' // 域名- www.
        + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
        + '[a-z]{2,6})' // first level domain- .com or .museum
        + '(:[0-9]{1,4})?' // 端口- :80
        + '((/?)|' // a slash isn't required if there is no file name
        + '(/[0-9a-z_!~*().;?:@&=+$,%#-]+)+/?)$';
    var re = new RegExp(strRegex);
    if (re.test(str_url)) {
        return (true);
    } else {
        return (false);
    }
}

// 是否是ipv4地址
export const isIPv4 = (ip) => {
    var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var flag = ip.match(exp);
    if (flag != undefined && flag != "") {
        return true;
    } else {
        return false;
    }
}

// 是否是ipv6地址
export const isIPv6 = (ipvalue) => {
    var matchStr = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;

    var ret = ipvalue.match(matchStr);
    if (ret) {
        return true;
    } else {
        return false;
    }
}

// 是否是数字
export const isNumber = (val) => {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}
// 获取url参数
export const getQueryString = (name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    try {
        var r = window.location.href.split('?')[1].match(reg);
        if (r != null) {
            var str = r[2];
            return decodeURIComponent(str);
        }
        return null;
    } catch (e) {
        return null
    }
}

/**
 * 时间格式化
 * @param  {[Number]} date 时间戳
 * @param  {[DateString]} fmt  时间格式
 * dateFormat('yyyy-MM-dd hh:mm:ss.S') => 2016-03-12 20:13:32.232
 * @return {[date]} 时间
 */
export const dateFormat = (date, fmt = 'yyyy-MM-dd hh:mm:ss') => {
    if (!date) return '';

    const date1 = new Date(date)
    const o = {
        'M+': date1.getMonth() + 1, // 月
        'd+': date1.getDate(), // 日
        'h+': date1.getHours(), // 小时
        'm+': date1.getMinutes(), // 分
        's+': date1.getSeconds(), // 秒
        'q+': Math.floor((date1.getMonth() + 3) / 3), // 季度S
        'S': date1.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date1.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
        }
    }
    return fmt
}

// 获取当前月份的前几个月份
export const nowMountTo = (num = 1) => {
    var dataArr = [];
    var data = new Date();
    var year = data.getFullYear();
    data.setMonth(data.getMonth() + 1, 1)//获取到当前月份,设置月份

    for (var i = 0; i < num; i++) {
        data.setMonth(data.getMonth() - 1);//每次循环一次 月份值减1
        var m = data.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        dataArr.push(data.getFullYear() + "-" + (m))
    }

    return dataArr;
}
// 获取当前日期的前几天
export const nowDayTo = (num = 1) => {
    var dayArr = [];
    function GetDateStr(num) {
        var dd = new Date();
        dd.setDate(dd.getDate() + num); //获取num天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1; //获取当前月份的日期
        m = m < 10 ? '0' + m : m;
        var d = dd.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + "-" + m + "-" + d;
    }

    for (var i = 0; i < num; i++) {
        var day = GetDateStr(-i);
        dayArr.push(day)
    }

    return dayArr;
}
// 获取当前时间是前一个小时、两个小时...
export const nowTimeTo = (num = 1) => {
    let timeList = [];
    let nowTime = new Date().getTime();
    for (var i = 0; i < num; i++) {
        let fTime = new Date(nowTime - i * 60 * 60 * 1000);
        let hours = fTime.getHours() < 10 ? '0' + fTime.getHours() : fTime.getHours();
        let minutes = fTime.getMinutes() < 10 ? '0' + fTime.getMinutes() : fTime.getMinutes();
        let seconds = fTime.getSeconds() < 10 ? '0' + fTime.getSeconds() : fTime.getSeconds();

        timeList.push(hours + ':' + minutes + ':' + seconds);
    }
    return timeList;
}

/**
 * 剩余时间
 * @param  {[Number]} date 时间戳
 * @return {[Number]} 天数
 */
export const surplusData = (date) => {
    if (!date) return '';

    const surplusSecond = new Date(date) - new Date()
    let dates = parseInt(surplusSecond / 1000 / 60 / 60 / 24, 10);
    return dates
}

// 数组去重 es6
export const unique = (arr) => {
    var x = new Set(arr);
    return [...x];
}

/**
* 合并数据，并过滤重复数据, 向上刷新更多
* @param {Array} newdata 新数据
* @param {array} oldData  旧数据
* @param {String} id 判断是否相同的id
*/
export const topMerge = (newdata, oldData, id) => {
    for (let i = newdata.length - 1; i >= 0; i--) {
        if (!oldData.filter(item => item[id] === newdata[i][id]).length) {
            oldData.unshift(newdata[i])
        }
    }
    return [...oldData]
}

/**
*  合并数据，并过滤重复数据,向下加载更多，
* @param {Array} newdata 新数据
* @param {array} oldData  旧数据
* @param {String} id 判断是否相同的id
*/
export const downMerge = (newdata, oldData, id) => {
    for (let i = 0; i < newdata.length; i++) {
        if (!oldData.filter(item => item[id] === newdata[i][id]).length) {
            oldData.push(newdata[i])
        }
    }
    return [...oldData]
}

export const getCache = (key, params = {}) => {
    if (!isDataType(key, 'String') || !isDataType(params, 'Object')) {
        return {
            cacheKey: null,
            cacheData: null
        }
    }
    const data = Object.assign({}, params)

    // 过滤掉判断和分页的字段
    delete data.isRefresh
    delete data.page
    delete data.pageSize
    delete data.loadmore

    let cacheKey = 'CACHE:' + key
    const keys = Object.keys(data)
    if (keys.length === 1) {
        cacheKey = cacheKey + '_' + data[keys[0]]
    } else if (keys.length > 1) {
        keys.sort().forEach(key => cacheKey = `${cacheKey}_${data[key]}`)
    }

    const cacheData = Cache.get(cacheKey)

    return {
        cacheKey,
        cacheData
    }
}


