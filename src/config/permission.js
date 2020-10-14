const menuList = [
  {
    name: "概览",
    id: "overview",
    module: "monitor",
    resource: "node",
    operations: [],
    menuType: ""
  },
  {
    name: "DNS统计",
    id: "dnsStatistics",
    module: "monitor",
    resource: "node",
    operations: [],
    menuType: ""
  },
  {
    name: "DHCP统计",
    id: "dhcpStatistics",
    module: "monitor",
    resource: "node",
    operations: [],
    menuType: ""
  },
  {
    name: "节点监控",
    id: "nodeMonitor",
    module: "monitor",
    resource: "node",
    operations: [],
    menuType: ""
  },
  {
    name: "权威服务",
    id: "authorityServe",
    module: "dns",
    resource: "zone",
    operations: [],
    menuType: ""
  },
  {
    name: "区配置",
    id: "zoneConfig",
    module: "dns",
    resource: "zone",
    operations: [],
    menuType: ""
  },
  {
    name: "区域查询",
    id: "authorityZone",
    module: "dns",
    resource: "zone",
    operations: [],
    menuType: ""
  },
  {
    name: "资源记录",
    id: "rrs",
    module: "dns",
    resource: "rr",
    operations: [],
    menuType: ""
  },
  {
    name: "重定向视图",
    id: "redirectView",
    module: "dns",
    resource: "redirection",
    operations: [],
    menuType: ""
  },
  {
    name: "重定向",
    id: "redirect",
    module: "dns",
    resource: "redirection",
    operations: [],
    menuType: ""
  },
  {
    name: "URL重定向视图",
    id: "urlRedirectView",
    module: "dns",
    resource: "urlredirect",
    operations: [],
    menuType: ""
  },
  {
    name: "URL重定向",
    id: "urlRedirect",
    module: "dns",
    resource: "urlredirect",
    operations: [],
    menuType: ""
  },
  {
    name: "递归服务",
    id: "recursionServe",
    module: "dns",
    resource: "recursiveconcurrent",
    operations: [],
    menuType: ""
  },
  {
    name: "转发配置",
    id: "forwardConfig",
    module: "dns",
    resource: "forward",
    operations: [],
    menuType: ""
  },
  {
    name: "转发组",
    id: "forwardGroup",
    module: "dns",
    resource: "forward",
    operations: [],
    menuType: ""
  },
  {
    name: "转发规则",
    id: "forwardRule",
    module: "dns",
    resource: "forwardzone",
    operations: [],
    menuType: ""
  },
  {
    name: "转发策略",
    id: "forwardPolicy",
    module: "dns",
    resource: "forwardzone",
    operations: [],
    menuType: ""
  },
  {
    name: "递归安全",
    id: "recursionSecurity",
    module: "dns",
    resource: "recursiveconcurrent",
    operations: [],
    menuType: ""
  },
  {
    name: "视图管理",
    id: "viewManage",
    module: "dns",
    resource: "view",
    operations: [],
    menuType: ""
  },
  {
    name: "ACL列表",
    id: "aclList",
    module: "dns",
    resource: "acl",
    operations: [],
    menuType: ""
  },
  {
    name: "视图配置",
    id: "viewConfig",
    module: "dns",
    resource: "view",
    operations: [],
    menuType: ""
  },
  {
    name: "全局配置",
    id: "dnsGlobalConfig",
    module: "dns",
    resource: "dnsglobalconfig",
    operations: [],
    menuType: "api"
  },
  {
    name: "IPAM管理",
    id: "ipamManage",
    module: "address",
    resource: "ipam",
    operations: [],
    menuType: ""
  },
  {
    name: "IP地址规划",
    id: "ipAddressPlan",
    module: "address",
    resource: "plan",
    operations: [],
    menuType: ""
  },
  {
    name: "IP地址监测",
    id: "ipAddressMonitor",
    module: "address",
    resource: "plan",
    operations: [],
    menuType: ""
  },
  {
    name: "IP地址监测详情",
    id: "networkinterfaces",
    module: "address",
    resource: "plan",
    operations: [],
    menuType: ""
  },
  {
    name: "终端管理",
    id: "terminalManage",
    module: "address",
    resource: "asset",
    operations: [],
    menuType: ""
  },
  {
    name: "设备管理",
    id: "deviceManage",
    module: "address",
    resource: "networkequipment",
    operations: [],
    menuType: ""
  },
  {
    name: "网络拓扑",
    id: "netTopology",
    module: "address",
    resource: "networkequipment",
    operations: [],
    menuType: ""
  },
  {
    name: "DHCP服务",
    id: "dhcpServe",
    module: "address",
    resource: "dhcp",
    operations: [],
    menuType: ""
  },
  {
    name: "地址池管理",
    id: "addressPoolManage",
    module: "address",
    resource: "subnet",
    operations: [],
    menuType: ""
  },
  {
    name: "前缀委派",
    id: "addressPoolpdpool",
    module: "address",
    resource: "subnet",
    operations: [],
    menuType: ""
  },
  {
    name: "动态地址池",
    id: "addressPool",
    module: "address",
    resource: "subnet",
    operations: [],
    menuType: ""
  },
  {
    name: "固定地址",
    id: "addressPoolReservation",
    module: "address",
    resource: "subnet",
    operations: [],
    menuType: ""
  },
  {
    name: "静态地址",
    id: "addressPoolStatic",
    module: "address",
    resource: "subnet",
    operations: [],
    menuType: ""
  },
  {
    name: "基础配置",
    id: "dhcpBaseConfig",
    module: "address",
    resource: "dhcpconfig",
    operations: [],
    menuType: ""
  },
  {
    name: "日志信息",
    id: "logInfo",
    module: "system",
    resource: "log",
    operations: [],
    menuType: ""
  },
  {
    name: "操作日志",
    id: "operateLog",
    module: "system",
    resource: "auditlog",
    operations: [],
    menuType: ""
  },
  {
    name: "解析日志",
    id: "parseLog",
    module: "system",
    resource: "dnslog",
    operations: [],
    menuType: ""
  },
  {
    name: "配置返显",
    id: "configFeedback",
    module: "system",
    resource: "agentevent",
    operations: [],
    menuType: ""
  },
  {
    name: "告警管理",
    id: "alarmManage",
    module: "system",
    resource: "alarm",
    operations: [],
    menuType: ""
  },
  {
    name: "告警配置",
    id: "alarmConfig",
    module: "system",
    resource: "threshold",
    operations: [],
    menuType: ""
  },
  {
    name: "告警信息",
    id: "alarmInfo",
    module: "system",
    resource: "alarm",
    operations: [],
    menuType: ""
  },
  {
    name: "告警通知",
    id: "alarmNotice",
    module: "system",
    resource: "alarm",
    operations: [],
    menuType: ""
  },
  {
    name: "访问控制",
    id: "accessControl",
    module: "auth",
    resource: "access",
    operations: [],
    menuType: ""
  },
  {
    name: "用户组",
    id: "userGroup",
    module: "auth",
    resource: "access",
    operations: [],
    menuType: ""
  },
  {
    name: "用户",
    id: "user",
    module: "auth",
    resource: "access",
    operations: [],
    menuType: ""
  },
  {
    name: "角色",
    id: "role",
    module: "auth",
    resource: "access",
    operations: [],
    menuType: ""
  },
  {
    name: "访问白名单",
    id: "accessWhiteList",
    module: "auth",
    resource: "access",
    operations: [],
    menuType: ""
  },
  {
    name: "用户操作",
    id: "currentUser",
    module: "system",
    resource: "ddiuser",
    operations: [],
    menuType: ""
  }
];
