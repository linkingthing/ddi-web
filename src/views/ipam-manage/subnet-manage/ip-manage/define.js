export const columns = scope => [
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "IP地址",
    key: "ip",
    minWidth: 160,
    align: "center",
    render: (h, { row }) => {
      return h("label", {
        class: "operate-edit",
        on: {
          click: () => {
            scope.handleEdit(row);
          }
        }
      }, row.ip);
    }
  },
  {
    title: "MAC地址",
    key: "macaddress",
    minWidth: 160,
    align: "center"
  },
  {
    title: "MAC厂商",
    key: "macvender",
    minWidth: 150,
    align: "center"
  },
  {
    title: "类型",
    key: "typeText",
    minWidth: 120,
    align: "center"
  },
  {
    title: "操作系统类型",
    key: "opersystem",
    minWidth: 160,
    align: "center"
  },
  {
    title: "NetBIOS名称",
    key: "netbiosname",
    minWidth: 160,
    align: "center"
  },
  {
    title: "主机名",
    key: "hostname",
    minWidth: 150,
    align: "center"
  },
  {
    title: "网口接口号",
    key: "interfaceid",
    minWidth: 140, 
    align: "center"
  },
  {
    title: "扫描接口号",
    key: "scaninterfaceid",
    minWidth: 140,
    align: "center"
  },
  {
    title: "指纹",
    key: "fingerprint",
    minWidth: 100,
    align: "center"
  },
  {
    title: "扫描时间",
    key: "leasestarttime",
    minWidth: 120,
    align: "center"
  },
  {
    title: "活跃时间",
    key: "leaseendtime",
    minWidth: 120,
    align: "center"
  },
  {
    title: "操作",
    align: "center",  
    minWidth: 120,    
    render: (h, { row }) => {
      return h("div", [
        h("label", {
          class: "operate-label operate-edit",
          on: {
            click: () => {
              scope.handleConfigAttibute(row);
            }
          }
        }, "自定义属性")
      ]);
    }
  }
];

/**
 * 协议
 */
export const protocals = () => [
  {
    label: "ICMP",
    value: "ICMP"
  },
  {
    label: "NETBOIS",
    value: "NETBOIS"
  },
  {
    label: "ARP",
    value: "ARP"
  }
];