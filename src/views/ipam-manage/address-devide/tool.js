import ipaddr from "ipaddr.js";

import { Address6 } from "ip-address";

const ipv6ToBigInt = (ip) => {
  const ipArr = ipaddr.parse(ip).parts;
  let len = ipArr.length;
  let bigNum = BigInt(0);
  for (let i = 0; i < len; i++) {
    bigNum += BigInt(ipArr[i] * Math.pow(2, 2 * (len - i - 1) * 8))
  }
  return bigNum;
}

// const bigNum = ipv6ToBigInt(ip)

// n 偏移位数，默认为一
const excutePrefixIncrement = (ipv6BigInt, prefix, bitWidth, n = 1) => {
  return ipv6BigInt + BigInt(n * Math.pow(2, 128 - (prefix + bitWidth)));
};

// const newIpBigInt = excutePrefixIncrement(bigNum, prefix, subtreebitnum, 5)

const bigIntToIPv6 = bigInt => {
  const fullIPv6 = Address6.fromBigInteger(bigInt);
  return fullIPv6.correctForm();
};

// bigIntToIPv6(newIpBigInt)


// const ip = "2001::1"
// const prefix = 35
// const subtreebitnum = 3
// 位宽 subtreebitnum  

// 计算下一个节点的IPv6起始
export const excuteNextIPv6 = (ip, prefix, subtreebitnum, n = 1) => {
  const bigNum = ipv6ToBigInt(ip);
  const newIpBigInt = excutePrefixIncrement(bigNum, Number(prefix), Number(subtreebitnum), n);
  console.log('newIpBigInt', newIpBigInt)
  return bigIntToIPv6(newIpBigInt);
};


export const binary = (nodecode, bitWidth) => (Array(bitWidth).join("0") + nodecode.toString(2)).slice(
  -bitWidth
);

// 2400:A480:aaaa:400:a1:b2:c3:d4
// console.log('2400:A480:aaaa:400:a1:b2:c3:d4')
// console.log(excuteNextIPv6('2400:A480:aaaa:400:a1:b2:c3:d4', 32, 2))

