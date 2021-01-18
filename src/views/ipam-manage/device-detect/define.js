function getMapAddress(obj = {}) {
  return obj && Object.values(obj).map(item => item.ip);
}

export const columns = scope => [
  {
    title: "设备名称",
    key: "name",
    align: "left",
    width: 200,
    fixed: "left"
  },
  {
    title: "管理地址",
    key: "administrationAddress",
    width: 220
  },
  {
    title: "设备类型",
    key: "equipmentTypeText",
    width: 140
  },
  {
    title: "设备MAC",
    key: "administrationMac",
    width: 200
  },
  {
    title: "序列号",
    key: "serialNumber",
    width: 160
  },
  {
    title: "厂商",
    key: "manufacturer",
    width: 120
  },
  {
    title: "固件版本",
    key: "firmwareVersion",
    width: 140
  },
  {
    title: "上联地址",
    // key: "uplinkAddresses",
    width: 180,
    render: (h, { row }) => {
      return h("div", getMapAddress(row.uplinkAddresses));
    }
  },
  {
    title: "下联地址",
    // key: "downlinkAddress",
    width: 180,
    render: (h, { row }) => {
      return h("div", getMapAddress(row.downlinkAddresses));
    }
  },
  {
    title: "机房",
    key: "computerRoom",
    width: 120
  },
  {
    title: "机柜",
    key: "computerRack",
    width: 120
  },
  {
    title: "所属部门",
    key: "department",
    width: 140
  },
  {
    title: "地理位置",
    key: "location",
    width: 180
  },
  {
    title: "负责人",
    key: "responsiblePerson",
    width: 120
  },
  {
    title: "联系电话",
    key: "telephone",
    minWidth: 150
  },
  {
    title: "最近探测时间",
    key: "lastRefreshTime",
    minWidth: 150
  },
  {
    title: "操作",
    width: 240,
    className: "operate-column",
    fixed: "right",
    render: (h, { row }) => {
      if (scope.$hasPermissionCreate("networkequipment")) {
        return h("div", [
          h("btn-edit", {
            on: {
              click: () => {
                scope.handleEdit(row);
              }
            }
          }),
          h(
            "btn-line",
            {
              on: {
                click: () => {
                  scope.handleDetect(row);
                }
              },
              props: {
                title: "网络探测"
              }
            },
            "网络探测"
          ),
          h("btn-del", {
            on: {
              click: () => {
                scope.handleDelete(row);
              }
            }
          })
        ]);
      } else {
        return h("div");
      }
    }
  }
];

export const deviceTypes = [
  {
    text: "核心交换机",
    label: "core_switch"
  },
  {
    text: "汇聚交换机",
    label: "convergence_switch"
  },
  {
    text: "接入交换机",
    label: "access_switch"
  },
  {
    text: "路由器",
    label: "router"
  },
  {
    text: "安全网关",
    label: "security_gateway"
  },
  {
    text: "防火墙",
    label: "firewall"
  },
  {
    text: "无线AP",
    label: "wireless_ap"
  },
  {
    text: "无线AC控制器",
    label: "wireless_ac"
  },
  {
    text: "其他",
    label: "other"
  }
];

export const manufacturers = [
  {
    text: "cisco",
    label: "cisco"
  },
  {
    text: "huawei",
    label: "huawei"
  },
  {
    text: "h3c",
    label: "h3c"
  }
];
