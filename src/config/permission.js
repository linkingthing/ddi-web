const menuList = [
  {
    name: "概览",
    id: "overview",
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
    name: "节点监控",
    id: "nodeMonitor",
    module: "monitor",
    resouces: [null]
  },
  {
    name: "权威服务",
    id: "authorityServe",
    module: "dns",
    resouces: [null]
  },
  {
    name: "区配置",
    id: "zoneConfig",
    module: "dns",
    resouces: [null]
  },
  {
    name: "区域查询",
    id: "authorityZone",
    module: "dns",
    resouces: [null]
  },
  {
    name: "资源记录",
    id: "rrs",
    module: "dns",
    resouces: [null]
  },
  {
    name: "重定向视图",
    id: "redirectView",
    module: "dns",
    resouces: [null]
  },
  {
    name: "重定向",
    id: "redirect",
    module: "dns",
    resouces: [null]
  },
  {
    name: "URL重定向视图",
    id: "urlRedirectView",
    module: "dns",
    resouces: [null]
  },
  {
    name: "URL重定向",
    id: "urlRedirect",
    module: "dns",
    resouces: [null]
  },
  {
    name: "递归服务",
    id: "recursionServe",
    module: "dns",
    resouces: [null]
  },
  {
    name: "转发配置",
    id: "forwardConfig",
    module: "dns",
    resouces: [null]
  },
  {
    name: "转发组",
    id: "forwardGroup",
    module: "dns",
    resouces: [null]
  },
  {
    name: "转发规则",
    id: "forwardRule",
    module: "dns",
    resouces: [null]
  },
  {
    name: "转发策略",
    id: "forwardPolicy",
    module: "dns",
    resouces: [null]
  },
  {
    name: "递归安全",
    id: "recursionSecurity",
    module: "dns",
    resouces: [null]
  },
  {
    name: "视图管理",
    id: "viewManage",
    module: "dns",
    resouces: [null]
  },
  {
    name: "ACL列表",
    id: "aclList",
    module: "dns",
    resouces: [null]
  },
  {
    name: "视图配置",
    id: "viewConfig",
    module: "dns",
    resouces: [null]
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
    resouces: [null]
  },
  {
    name: "IPAM管理",
    id: "ipamManage",
    module: "address",
    resouces: [null]
  },
  {
    name: "IP地址规划",
    id: "ipAddressPlan",
    module: "address",
    resouces: [null]
  },
  {
    name: "IP地址监测",
    id: "ipAddressMonitor",
    module: "address",
    resouces: [null]
  },
  {
    name: "IP地址监测详情",
    id: "networkinterfaces",
    module: "address",
    resouces: [null]
  },
  {
    name: "终端管理",
    id: "terminalManage",
    module: "address",
    resouces: [null]
  },
  {
    name: "设备管理",
    id: "deviceManage",
    module: "address",
    resouces: [null]
  },
  {
    name: "网络拓扑",
    id: "netTopology",
    module: "address",
    resouces: [null]
  },
  {
    name: "DHCP服务",
    id: "dhcpServe",
    module: "address",
    resouces: [null]
  },
  {
    name: "地址池管理",
    id: "addressPoolManage",
    module: "address",
    resouces: [null]
  },
  {
    name: "前缀委派",
    id: "addressPoolpdpool",
    module: "address",
    resouces: [null]
  },
  {
    name: "动态地址池",
    id: "addressPool",
    module: "address",
    resouces: [null]
  },
  {
    name: "固定地址",
    id: "addressPoolReservation",
    module: "address",
    resouces: [null]
  },
  {
    name: "静态地址",
    id: "addressPoolStatic",
    module: "address",
    resouces: [null]
  },
  {
    name: "基础配置",
    id: "dhcpBaseConfig",
    module: "address",
    resouces: [null]
  },
  {
    name: "日志信息",
    id: "logInfo",
    module: "system",
    resouces: [null]
  },
  {
    name: "操作日志",
    id: "operateLog",
    module: "system",
    resouces: [null]
  },
  {
    name: "解析日志",
    id: "parseLog",
    module: "system",
    resouces: [null]
  },
  {
    name: "配置返显",
    id: "configFeedback",
    module: "system",
    resouces: [null]
  },
  {
    name: "告警管理",
    id: "alarmManage",
    module: "system",
    resouces: [null]
  },
  {
    name: "告警配置",
    id: "alarmConfig",
    module: "system",
    resouces: [null]
  },
  {
    name: "告警信息",
    id: "alarmInfo",
    module: "system",
    resouces: [null]
  },
  {
    name: "告警通知",
    id: "alarmNotice",
    module: "system",
    resouces: [null]
  },
  {
    name: "访问控制",
    id: "accessControl",
    module: "auth",
    resouces: [null]
  },
  {
    name: "用户组",
    id: "userGroup",
    module: "auth",
    resouces: [null]
  },
  {
    name: "用户",
    id: "user",
    module: "auth",
    resouces: [null]
  },
  {
    name: "角色",
    id: "role",
    module: "auth",
    resouces: [null]
  },
  {
    name: "访问白名单",
    id: "accessWhiteList",
    module: "auth",
    resouces: [null]
  },
  {
    name: "用户操作",
    id: "currentUser",
    module: "system",
    resouces: [null]
  }
];
