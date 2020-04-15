export const isIPv4Reg = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;

export const fullIPv6Reg = /^(([\da-fA-F]{1,4}):){7}([\da-fA-F]{1,4}){1}$/;

export const nameReg = /^([a-zA-Z0-9_]{1,63}\.)+[a-zA-Z0-9_]{1,63}$/;

export const prefixReg = /::\/(32|40|48|56|64|96)$/;

export const ipUnitReg = /[0-9a-fA-F]{4}/g;

export const positiveIntegerReg = /^[1-9]?[0-9]+$/;

export const urlReg = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;

export const domainReg = /^(?=^.{2,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})*$/;

export const urlValidate = {
  pattern: urlReg,
  message: "请正确输入url"
};

export const domainValidate = {
  pattern: domainReg,
  message: "请正确输入域名"
};

export const nameValidate = {
  pattern: nameReg,
  message: "名称由不超过64个a-zA-Z0-9_组成"
};

export const isIPv4Validate = {
  pattern: isIPv4Reg,
  message: "请正确输入IPv4地址"
};

export const isIPv6Validate = {
  pattern: fullIPv6Reg,
  message: "请正确输入IPv6地址"
};


function IPv6UnitTest(unitArr, callback) {
  unitArr.every((unit, index) => {

    // 高位0检验
    if (/^0+\d$/.test(unit)) {
      callback("填写错误，IPv6单元禁止高位0");
    }

    if (!(/^[0-9a-fA-F]{1,4}$/.test(unit))) {
      callback(`填写错误，第${index + 1}单元不符合4位16进制要求`);
    }
    return /^[0-9a-fA-F]{1,4}$/.test(unit);
  });
}

/**
 * 获取ip地址的类型
 * 判断地址是否有冒号，如果有冒号，就认为是ipv6，反之则是ipv4
 */
export const getAddressType = val => {
  return val.toString().indexOf(":") > 0 ? "ipv6" : "ipv4";
};

/**
 * 掩码是否合法
 * @param {String, Number} address IP地址或者掩码
 * @param {String, Number} ipType IP地址的类型  ipv4|ipv6
 */
export const gatewayIsValid = (address, ipType) => {
  let val = address;
  let index = val.indexOf("/");

  if (ipType) {
    ipType = ipType.toLocaleString();
  }
  // 如果未指定ip类型，且address没有/符号，则说明，传过来的值不包含掩码，此时无法判断
  else if (index <= 0) {
    return false;
  }
  // 若未指定ip类型，且传过来的值是ip地址包含掩码，则获取其ip类型
  else {
    ipType = getAddressType(val);
  }

  // 如果传过来的值包含掩码，则获取其掩码
  if (index > 0) {
    val = val.slice(index + 1);
  }

  val = parseFloat(val);

  if (!isPosNumber(val)) return false;
    
  if (ipType === "ipv6") {
    return val > 1 && val < 128;
  }
  else {
    return val > 1 && val < 32;
  }
};

// 是否是数字
export const isNumber = val => {
  var regPos = /^\d+(\.\d+)?$/; // 非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
};

/**
 * 是否是正整数
 */
export const isPosNumber = val => {
  return /^[1-9]([0-9]+)?$/g.test(val);
};

// 获取url参数
export const getQueryString = name => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  try {
    var r = window.location.href.split("?")[1].match(reg);
    if (r != null) {
      var str = r[2];
      return decodeURIComponent(str);
    }
    return null;
  } catch (e) {
    return null;
  }
};

/**
 * ipv6规则
 * 1. 组多8组，以冒号分割
 * 2. 每个单元由4位16进制组成
 * 3. 单元中全为0时可以 (::)简写
 * 4. 简写只能出现一次，且在最右边（！！！还是要双重判断）
 * 
 * 
 * 逻辑分析：
 * 1. ipv6要么全写要么简写
 * 2. 简写只能一个 (::)
 * 3. 单元数不能超过8
 * 4. 简写的右边不能有可简写的单元
*/

// a:b:c:d:e:f:a:b
// aaaa:bbbb:cccc:dddd:eeee:ffff:aaaa:bbbb
// aaaa::
// aaaa::bbbb
// aaaa:b:cccc::dddd:eeee
// 1aef:e234:3fdf::1
export const IPv6SimpleValidateFunc = (rule, value, callback) => {
  console.log(value);
  if (fullIPv6Reg.test(value)) {
    callback();
  }

  const simpleSplit = value.split("::");
  if (simpleSplit.length > 2) {
    callback("ipv6中只能有一次简写");
  }

  if (simpleSplit.length !== 2) {
    callback("请正确输入IPv6地址");
  }

  console.log(simpleSplit);

  let totalGroup = [];
  simpleSplit.forEach((current, index) => {
    console.log(1, current);
    totalGroup = totalGroup.concat(current.split(":"));

    if (index === 1 && current.length > 0) {
      // 这里面不能有可简写的存在
      current.split(":").every(item => {
        if (item === "0") {
          callback("简写方式不正确，请优先对右边单元简写");
        } else {
          return true;
        }
      });
    } else {
      // 处理 aaaa:: (::)双冒号结尾的情况
      totalGroup.pop();
    }
  });

  console.log(totalGroup);
  if (totalGroup.length > 7) {
    callback("IPv6简写地址单元数不能超过7");
  }

  IPv6UnitTest(totalGroup, callback);

  callback();
};


export const requiredValidate = { required: true, message: "该项必填" };


export const positiveIntegerValidate = {
  pattern: positiveIntegerReg,
  message: "请输入正整数"
};

export const prefixValidate = {
  pattern: prefixReg,
  message: "格式以十六进制表示,以'::/N'结尾,N可以为32,40,48,56,64,96中的一个"
};


export const prefixValidateFunc = (rule, value, callback) => {
  const endNumReg = /[\d]{2}$/;
  const [number] = value.match(endNumReg);
  const max = Math.floor(number / 16); // 最多组数
  const groupStr = value.substring(0, value.length - 5);
  const unitArr = groupStr.split(":");

  if (unitArr.length > max) {
    callback(`填写错误，ip单元数不能大于${max}`);
  }

  IPv6UnitTest(unitArr, callback);

  callback();
};

export const resourceDomainValidateFunc = (rule, value, callback) => {
  if (value === "*" || value === "@" || domainReg.test(value)) {
    callback();
  }

  callback("请正确输入域名");
};

export const subnetValidateFunc = (rule, value, callback) => {
  console.log(rule);
  if (value) {
    const [ip, prefix] = value.split("/");

    if (Number.isNaN( Number(prefix))) {
      callback("prefix 应该是1-64整数");
      return;
    }
    if (Number(prefix) > 0 && Number(prefix) < 64) {
      callback();
      return;
    } else {
      callback("prefix 应该是1-64整数");

    }
    IPv6SimpleValidateFunc(null, ip, callback);

  }
  callback("请正确输入subnet");
};

/**
 * 格式化日期
 * @param { Date|String } res 时间对象或字符串 
 * @param { String } formatter 格式化方式  yyyy-MM-dd hh:mm:ss
 */
export const formatDate = (res, formatter = "yyyy-MM-dd hh:mm:ss") => {
  if (!res) return "";
  
  let date = new Date(res);

  if (isNaN(date.getTime())) throw new Error("日期格式错误");

  const opt = {
    "y+": date.getFullYear().toString(),        // 年
    "M+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "h+": date.getHours().toString(),           // 时
    "m+": date.getMinutes().toString(),         // 分
    "s+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };

  let ret;

  for (let k in opt) {
    ret = new RegExp(`(${k})`).exec(formatter);

    if (ret) {
      formatter = formatter.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")));
    }
  }

  return formatter;
};