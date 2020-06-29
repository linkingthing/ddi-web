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
    title: "终端名称",
    key: "name",
    align: "center",
    tooltip
  },
  {
    title: "设备类型",
    key: "deviceType",
    align: "center",
    tooltip
  },
  {
    title: "业务名称",
    key: "deployedService",
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
    title: "地理位置",
    key: "location",
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
    width: 120,
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