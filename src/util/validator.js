import { isIp, ipv4IsValid, ipv6IsValid } from "./common";

/**
 * 常见业务字段统一校验
 */

export const emptyStringValidator = (rule, value, callback) => {
  if (value.trim() === "") {
    callback(rule.message);
  } else {
    callback();
  }
};

export const ttlValidator = function (rule, value, callback) {
  if (Number(value) > 86400) {
    callback("ttl最大值不能超过86400");
  } else {
    callback();
  }
};

export const ipListValidator = function (rule, value, callback) {
  if (value === null) {
    callback();
  }
  const ipList = value
    .split("\n")
    .filter(item => !!item)
    .map(item => item.trim());
  const isValid = ipList.every(item => isIp(item));
  if (isValid) {
    callback();
  } else {
    callback("请输入正确ip");
  }
};

function checkPort(port, callback, line) {
  if (!Number(port)) {
    callback(`端口有误,line: ${line}`);
  }

  if (+port < 1 || +port > 65535) {
    callback(`端口取值范围,(0,65535],line: ${line}`);
  }
}

export const serverValidator = (rule, value, callback) => {
  const ipList = value.split(/\n/);
  const isPass = ipList.every((item, index) => {
    let ip = item;
    let port = 53;

    // IPv6
    const isSimilarIPv6 = item.split(":").length > 2;
    if (isSimilarIPv6) {
      // 有端口
      if (item.includes("[")) {
        const reg = /^\[(\S*)\]:(\d+)$/;
        try {
          [, ip, port] = item.match(reg);
          checkPort(port, callback, index + 1);
        } catch (e) {
          callback(`请核对第${index + 1}行，IPv6及端口是否正确`);
        }
      }
    }
    // IPv4
    else {
      if (item.includes(":")) {
        try {
          [ip, port] = item.trim().split(":");
          checkPort(port, callback, index + 1);
        } catch (e) {
          callback(`请核对第${index + 1}行，IPv4及端口是否正确`);
        }
      }
    }

    return (ipv4IsValid(ip) || ipv6IsValid(ip)) && !item.includes("/");
  });

  if (isPass) {
    callback();
  } else {
    callback(new Error("请正确填写服务器地址"));
  }
};
