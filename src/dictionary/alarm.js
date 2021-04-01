export const alarmConfig = {
  cpuUsedRatio: "CPU使用率",
  dhcpOffline: "DHCP服务离线",
  dnsOffline: "DNS服务离线",
  haTrigger: "Ha主备份切换",
  ipConflict: "IP冲突",
  illegalDhcp: "非法DHCP服务器",
  subnetConflict: "子网冲突",
  lps: "LPS",
  memoryUsedRatio: "内存使用率",
  nodeOffline: "节点离线",
  qps: "QPS",
  storageUsedRatio: "硬盘使用率",
  subnetUsedRatio: "地址池使用率",
  ipBaseLineConflict: "IP基线冲突",
};

export const alarmLevel = {
  critical: "严重告警",
  major: "一般告警",
  minor: "次要告警"
};

export const alarmState = {  
  untreated: "未处理",
  solved: "已处理",
  ignored: "已忽略"
};
