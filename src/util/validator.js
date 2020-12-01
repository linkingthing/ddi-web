import { isIp } from "./common";
/**
 * 常见业务字段统一校验
 */

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
