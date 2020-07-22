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
