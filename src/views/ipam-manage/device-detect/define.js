export const columns = scope => [  
  {
    title: "设备名称",
    key: "name",
    align: "left"
  },
  {
    title: "管理地址",
    key: "administrationAddress",
    align: "left"
  },
  {
    title: "设备类型",
    key: "equipmentType",
    align: "left"
  },
  {
    title: "序列号",
    key: "serialNumber",
    align: "left"
  },
  {
    title: "厂商",
    key: "manufacturer",
    align: "left"
  },
  {
    title: "固件版本",
    key: "firmwareVersion",
    align: "left"
  },
  {
    title: "上联地址",
    key: "uplinkAddress",
    align: "left"
  },
  {
    title: "下联地址",
    key: "downlinkAddress",
    align: "left"
  },
  {
    title: "机房",
    key: "computerRoom",
    align: "left"
  },
  {
    title: "机柜",
    key: "computerRack",
    align: "left"
  },
  {
    title: "所属部门",
    key: "department",
    align: "left"
  },
  {
    title: "地理位置",
    key: "location",
    align: "left"
  },
  {
    title: "负责人",
    key: "responsiblePerson",
    align: "left"
  },
  {
    title: "联系电话",
    key: "telephone",
    align: "left"
  },
  {
    title: "操作",
    width: 140,
    className: "operate-column",
    render: (h, { row }) => 
      h("div", [
        h("btn-edit", {
          on: {
            click: () => {
              scope.handleEdit(row);
            }
          }
        }),
        h("btn-edit", {
          on: {
            click: () => {
              scope.handleDetect(row);
            }
          }
        }, "网络探测"),
        h("btn-del", {
          on: {
            click: () => {
              scope.handleDelete(row);
            }
          }
        })
      ]),
    align: "center"
  }
];

export const deviceTypes = [
  {
    text: "交换机",
    label: "switch"
  },
  {
    text: "网关",
    label: "gateway"
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