const tooltip = true;

export const deviceTypes = [
  {
    text: "PC端",
    label: "pc"
  },
  {
    text: "手机端",
    label: "mobile"
  },
  {
    text: "打印机",
    label: "printer"
  },
  {
    text: "摄像头",
    label: "camera"
  },
  {
    text: "NVR",
    label: "nvr"
  },
  {
    text: "物联设备",
    label: "iot"
  },
  {
    text: "其他",
    label: "other"
  }
];

export const columns = scope => [  
  {
    title: "MAC",
    key: "mac",
    align: "left",
    width: 180,
    tooltip
  },
  {
    title: "IPv4地址",
    key: "ipv4",
    align: "center",
    width: 180,
    tooltip
  },
  {
    title: "IPv6地址",
    key: "ipv6s",
    align: "center",
    width: 180,
    tooltip
  },
  
  {
    title: "终端名称",
    key: "name",
    align: "center",
    width: 180,
    tooltip
  },
  {
    title: "终端类型",
    key: "deviceTypeText",
    align: "center",
    width: 140,
    tooltip
  },
  {
    title: "交换机名称",
    key: "switchName",
    align: "center",
    width: 160,
    tooltip
  },
  {
    title: "机房",
    key: "computerRoom",
    align: "center",
    width: 140,
    tooltip
  },
  {
    title: "机柜",
    key: "computerRack",
    align: "center",
    width: 140,
    tooltip
  },
  {
    title: "端口",
    key: "switchPort",
    align: "center",
    width: 120,
    tooltip
  },
  {
    title: "所属部门",
    key: "department",
    align: "center",
    width: 150,
    tooltip
  },
  {
    title: "负责人",
    key: "responsiblePerson",
    align: "center",
    width: 150,
    tooltip
  },
  {
    title: "联系电话",
    key: "telephone",
    align: "center",
    width: 150,
    tooltip
  },
  {
    title: "操作",
    width: 140,
    fixed: "right",
    render: (h, { row }) => 
      h("div", [
        h("btn-edit", {
          on: {
            click: () => {
              scope.handleEdit(row);
            }
          }
        }),
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