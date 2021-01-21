import { Address6, Address4 } from "ip-address";

export const isIPv4Reg = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;

export const fullIPv6Reg = /^(([\da-fA-F]{1,4}):){7}([\da-fA-F]{1,4}){1}$/;

export const nameReg = /^([a-zA-Z0-9_]{1,63}\.)+[a-zA-Z0-9_]{1,63}$/;

export const prefixReg = /::\/(32|40|48|56|64|96)$/;

export const ipUnitReg = /[0-9a-fA-F]{4}/g;

export const positiveIntegerReg = /^[1-9]?[0-9]+$/;

export const urlReg = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;

export const domainReg = /^(?=^.{1,255}$)([_a-zA-Z0-9][_\-a-zA-Z0-9]{0,62}|[*])(\.[_a-zA-Z0-9][_\-a-zA-Z0-9]{0,62})*(\.?)$/;

export const macReg = /^(([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2})$/;

// 大于0整数的正则
export const integerReg = /^[1-9]\d*$/;

/**
 * 移动电话正则
 */
export const mobilePhoneReg = /^(\+86)?1[1-9]{1}[0-9]{9}$/g;

export const urlValidate = {
  pattern: urlReg,
  message: "请正确输入url"
};

export const domainValidate = {
  pattern: domainReg,
  message: "请正确输入域名"
};

export const nameValidate = {
  pattern: domainReg,
  message: "请正确填写的域名"
};

export const commonNameValidate = {
  pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,19}$/,
  message: "名称由不超过20个a-zA-Z0-9_组成"
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

    if (!/^[0-9a-fA-F]{1,4}$/.test(unit)) {
      callback(`填写错误，第${index + 1}单元不符合4位16进制要求`);
    }
    return /^[0-9a-fA-F]{1,4}$/.test(unit);
  });
}

/**
 * 校验Mac是否合法
 * @param {String} mac MAC地址
 */
export const macAddressIsValid = mac => macReg.test(mac.trim());

/**
 * 将IPv6地址填充为完整的IPv6
 * @param {String} address
 */
export const fillIPv6 = address => {
  // 如果没有简写，则直接返回
  if (address.indexOf("::") < 0) return address;

  let arr = address.split("::");

  let begin = arr[0],
    end = arr[1];
  let beginLen = 0,
    endLen = 0;

  if (!begin) {
    beginLen = 0;
  } else {
    beginLen = begin.split(":").length;
  }

  if (!end) {
    endLen = 0;
  } else {
    endLen = end.split(":").length;
  }

  const totalLen = 8;
  const fillLen = totalLen - beginLen - endLen;

  let ret = new Array(fillLen).fill("0");

  if (begin) {
    ret.unshift(begin);
  }

  if (end) {
    ret.push(end);
  }

  return ret.join(":");
};

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
 * @param {Array} range 掩码的范围，可不传
 */
export const maskIsValid = (address, ipType, range) => {
  if (!address) return false;

  let val = address.toString();
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

  if (!range) {
    range = ipType === "ipv6" ? [2, 64] : [2, 24];
  }

  return val >= range[0] && val <= range[1];
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
  val = isNaN(val) ? val : val.toString();

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

export const IPv6SimpleValidateFunc = (rule, value, callback) => {
  if (!value.trim()) {
    callback();
  }
  if (ipv6IsValid(value.trim())) {
    callback();
  }
  callback(new Error("请正确输入ipv6地址"));
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

/**
 * 验证域名是否合法
 * @param {String} value 域名
 */
export const domainIsValid = value => {
  return value === "*" || value === "@" || domainReg.test(value);
};

export const resourceDomainValidateFunc = (rule, { item, all }, callback) => {
  if (item === "*" || item === "@" || domainReg.test(all)) {
    callback();
  }

  callback("请正确输入域名");
};

export const subnetValidateFunc = (rule, value, callback) => {
  if (value) {
    const [ip, prefix] = value.split("/");

    const address = new Address6(ip);

    if (address.isValid()) {
      if (Number.isNaN(Number(prefix))) {
        callback("prefix 应该是1-64整数");
        return;
      }
      if (Number(prefix) > 0 && Number(prefix) <= 64) {
        callback();
        return;
      } else {
        callback("prefix 应该是1-64整数");
      }
      callback();
    } else {
      callback("请正确输入subnet");
    }
  }
  callback("请正确输入subnet");
};

/**
 * 判断是否是合法的ipv6，不校验掩码
 */
export const ipv6IsValid = address => {
  try {
   return new Address6(address).isCorrect()
  }catch(e){
    return false
  }
};

export const ipv4IsValid = address => {
  try {
    return new Address4(address).isCorrect()
   }catch(e){
     return false
   }
};

export const isIp = address => {
  return ipv6IsValid(address) || ipv4IsValid(address);
};

export const isIpv4Segment = segment => {
  try {
    const ipv4 = new Address4(segment);
    const { subnetMask } = ipv4;
    const ipBinary = ipv4.binaryZeroPad();
    const endString = ipBinary.slice(subnetMask, ipBinary.length);
    return !endString.includes("1");
  } catch (e) {
    return false;
  }
};

export const isIpv6Segment = segment => {
  const ipv6 = new Address6(segment);
  const { subnetMask } = ipv6;
  const ipBinary = ipv6.binaryZeroPad();
  const endString = ipBinary.slice(subnetMask, ipBinary.length);
  return !endString.includes("1");
};

/**
 * 验证端口是否合法
 * @param {Number | String} port
 */
export const portIsValidate = port => {
  port = port.toString();

  return integerReg.test(port) && port <= 65535;
};

/**
 * action 下载文件
 */
export const downloadFile = path => {
  const pathname = path.substr("/opt/website".length + 1);
  const downloadPath = `/public/${pathname}`;
  let a = document.createElement("a");
  a.download = pathname;
  a.href = downloadPath;
  a.click();
};

// arr1 是否包含 arr2
export function includes(arr1, arr2) {
  return arr2.every(item => {
    return arr1.includes(item);
  });
}
