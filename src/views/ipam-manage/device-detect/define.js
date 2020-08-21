export const columns = scope => [
  {
    title: "设备名称",
    key: "name",
    align: "left",
    width: 200
  },
  {
    title: "管理地址",
    key: "administrationAddress",
    align: "center",
    width: 220
  },
  {
    title: "设备类型",
    key: "equipmentTypeText",
    align: "center",
    width: 140
  },
  {
    title: "序列号",
    key: "serialNumber",
    align: "center",
    width: 160
  },
  {
    title: "厂商",
    key: "manufacturer",
    align: "center",
    width: 120
  },
  {
    title: "固件版本",
    key: "firmwareVersion",
    align: "center",
    width: 140
  },
  // {
  //   title: "上联地址",
  //   key: "uplinkAddress",
  //   align: "center",
  //   width: 180,

  // },
  // {
  //   title: "下联地址",
  //   key: "downlinkAddress",
  //   align: "center",
  //   width: 180
  // },
  {
    title: "机房",
    key: "computerRoom",
    align: "center",
    width: 120
  },
  {
    title: "机柜",
    key: "computerRack",
    align: "center",
    width: 120
  },
  {
    title: "所属部门",
    key: "department",
    align: "center",
    width: 140
  },
  {
    title: "地理位置",
    key: "location",
    align: "center",
    width: 180
  },
  {
    title: "负责人",
    key: "responsiblePerson",
    align: "center",
    width: 120
  },
  {
    title: "联系电话",
    key: "telephone",
    align: "center",
    width: 140
  },
  {
    title: "操作",
    width: 180,
    className: "operate-column",
    fixed: "right",
    render: (h, { row }) => {
      if (scope.$store.getters.hasPermissionToCreate) {
        return h("div", [
          h("btn-edit", {
            on: {
              click: () => {
                scope.handleEdit(row);
              }
            }
          }),
          h(
            "btn-detect",
            {
              on: {
                click: () => {
                  scope.handleDetect(row);
                }
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
    },
    align: "center"
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
    label: "wirelessAp"
  },
  {
    text: "无线AC控制器",
    label: "wirelessAc"
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
