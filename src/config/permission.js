export default [
  {
    name: "概览",
    id: "overview", // router.meta.permission
    module: "monitor",
    resouces: ["node"]
  },
  {
    name: "DNS统计",
    id: "dnsStatistics",
    module: "monitor",
    resouces: ["dns"]
  },
  {
    name: "DHCP统计",
    id: "dhcpStatistics",
    module: "monitor",
    resouces: ["dhcp"]
  },
  {
    name: "规划地图",
    id: "planmap",
    module: "monitor",
    resouces: ["planmap"]
  },
  {
    name: "节点监控",
    id: "nodeMonitor",
    module: "monitor",
    resouces: ["node"]
  },
  {
    name: "权威服务",
    id: "authorityServe",
    module: "dns",
    resouces: ["view"]
  },
  {
    name: "权威区",
    id: "zoneConfig",
    module: "dns",
    resouces: ["view"]
  },
  {
    name: "区域查询",
    id: "authorityZone",
    module: "dns",
    resouces: ["authzone"]
  },
  {
    name: "资源记录",
    id: "rrs",
    module: "dns",
    resouces: ["authrr"]
  },
  {
    name: "重定向视图",
    id: "redirectView",
    module: "dns",
    resouces: ["redirection"]
  },
  {
    name: "重定向",
    id: "redirect",
    module: "dns",
    resouces: ["redirection"]
  },
  {
    name: "URL重定向视图",
    id: "urlRedirectView",
    module: "dns",
    resouces: ["urlredirect"]
  },
  {
    name: "URL重定向",
    id: "urlRedirect",
    module: "dns",
    resouces: ["urlredirect"]
  },
  {
    name: "转发服务",
    id: "recursionServe",
    module: "dns",
    resouces: ["forwardzone"]
  },
  {
    name: "转发区",
    id: "forwardConfigMenu",
    module: "dns",
    resouces: ["forwardzone"]
  },
  {
    name: "转发组",
    id: "forwardGroup",
    module: "dns",
    resouces: ["forwardergroup"]
  },
  {
    name: "转发规则",
    id: "forwardRule",
    module: "dns",
    resouces: ["forwardzone"]
  },
  {
    name: "域名组",
    id: "domainGroup",
    module: "dns",
    resouces: ["domaingroup"]
  },
  {
    name: "时间策略",
    id: "timeScheduler",
    module: "dns",
    resouces: ["timescheduler"]
  },
  {
    name: "递归安全",
    id: "recursionSecurity",
    module: "dns",
    resouces: ["recursiveconcurrent"]
  },
  {
    name: "视图管理",
    id: "viewManage",
    module: "dns",
    resouces: ["view"]
  },
  {
    name: "ACL列表",
    id: "aclList",
    module: "dns",
    resouces: ["acl"]
  },
  {
    name: "视图配置",
    id: "viewConfig",
    module: "dns",
    resouces: ["view"]
  },
  {
    name: "解析优先级",
    id: "parsePriority",
    module: "dns",
    resouces: [null]
  },
  {
    name: "全局配置",
    id: "dnsGlobalConfig",
    module: "dns",
    resouces: ["dnsglobalconfig"]
  },
  {
    name: "IPAM管理",
    id: "ipamManage",
    module: "address",
    resouces: ["asset"]
  },
  {
    name: "IP地址规划",
    id: "ipAddressPlan",
    module: "address",
    resouces: ["plan"]
  },
  {
    name: "IP地址监测",
    id: "ipAddressMonitor",
    module: "address",
    resouces: ["scannedsubnet"]
  },
  {
    name: "IP地址监测详情",
    id: "networkinterfaces",
    module: "address",
    resouces: ["networkinterface"]
  },
  {
    name: "终端资产管理",
    id: "terminalManage",
    module: "address",
    resouces: ["asset"]
  },
  {
    name: "设备管理",
    id: "deviceManage",
    module: "address",
    resouces: ["networkequipment"]
  },
  {
    name: "网络拓扑",
    id: "netTopology",
    module: "address",
    resouces: ["networkequipment"]
  },
  {
    name: "DHCP服务",
    id: "dhcpServe",
    module: "address",
    resouces: ["subnet"]
  },
  {
    name: "地址池管理",
    id: "addressPoolManage",
    module: "address",
    resouces: ["subnet"]
  },
  {
    name: "前缀委派",
    id: "addressPoolpdpool",
    module: "address",
    resouces: ["subnet"]
  },
  {
    name: "动态地址池",
    id: "addressPool",
    module: "address",
    resouces: ["subnet"]
  },
  {
    name: "固定地址",
    id: "addressPoolReservation",
    module: "address",
    resouces: ["subnet"]
  },
  {
    name: "静态地址",
    id: "addressPoolStatic",
    module: "address",
    resouces: ["subnet"]
  },
  {
    name: "基础配置",
    id: "dhcpBaseConfig",
    module: "address",
    resouces: ["dhcpconfig"]
  },
  {
    name: "option60",
    id: "option60",
    module: "address",
    resouces: ["clientclass"]
  },
  
  {
    name: "日志信息",
    id: "logInfo",
    module: "system",
    resouces: ["auditlog"]
  },
  {
    name: "操作日志",
    id: "operateLog",
    module: "system",
    resouces: ["auditlog"]
  },
  {
    name: "解析日志",
    id: "parseLog",
    module: "system",
    resouces: ["dnslog"]
  },
  {
    name: "配置返显",
    id: "configFeedback",
    module: "system",
    resouces: ["agentevent"]
  },
  {
    name: "告警管理",
    id: "alarmManage",
    module: "system",
    resouces: ["threshold"]
  },
  {
    name: "告警配置",
    id: "alarmConfig",
    module: "system",
    resouces: ["threshold"]
  },
  {
    name: "告警信息",
    id: "alarmInfo",
    module: "system",
    resouces: ["alarm"]
  },
  {
    name: "告警通知",
    id: "alarmNotice",
    module: "system",
    resouces: ["mailsender"]
  },
  {
    name: "访问控制",
    id: "accessControl",
    module: "auth",
    resouces: ["usergroup"]
  },
  {
    name: "用户组",
    id: "userGroup",
    module: "auth",
    resouces: ["usergroup"]
  },
  {
    name: "用户",
    id: "user",
    module: "auth",
    resouces: ["user"]
  },
  {
    name: "角色",
    id: "role",
    module: "auth",
    resouces: ["role"]
  },
  {
    name: "访问白名单",
    id: "accessWhiteList",
    module: "auth",
    resouces: ["whitelist"]
  },
  {
    name: "用户操作",
    id: "currentUser",
    module: "system",
    resouces: ["users"]
  }
];
