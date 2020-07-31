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
    tooltip
  },
  {
    title: "IP地址",
    key: "name",
    align: "center",
    tooltip
  },
  {
    title: "终端名称",
    key: "name",
    align: "center",
    tooltip
  },
  {
    title: "终端类型",
    key: "deviceTypeText",
    align: "center",
    tooltip
  },
  {
    title: "交换机名称",
    key: "switchName",
    align: "center",
    tooltip
  },
  {
    title: "机房",
    key: "computerRoom",
    align: "center",
    tooltip
  },
  {
    title: "机柜",
    key: "computerRack",
    align: "center",
    tooltip
  },
  {
    title: "端口",
    key: "switchPort",
    align: "center",
    tooltip
  },
  {
    title: "所属部门",
    key: "department",
    align: "center",
    tooltip
  },
  {
    title: "负责人",
    key: "responsiblePerson",
    align: "center",
    tooltip
  },
  {
    title: "联系电话",
    key: "telephone",
    align: "center",
    tooltip
  },
  {
    title: "操作",
    width: 130,
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