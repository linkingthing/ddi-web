export const columns = scope => [  
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "IP地址",
    key: "ip",
    align: "left"
  },
  {
    title: "主机名",
    key: "name",
    align: "center"
  },
  {
    title: "设备类型",
    key: "type",
    align: "center"
  },
  {
    title: "业务名称",
    key: "deployedService",
    align: "center"
  },
  {
    title: "所属部门",
    key: "department",
    align: "center"
  },
  {
    title: "地理位置",
    key: "location",
    align: "center"
  },
  {
    title: "联系电话",
    key: "telephone",
    align: "center"
  },
  {
    title: "操作",
    width: 120,
    render: (h, { row }) => {
      return h("Button", {
        class: "table-row-button",
        style: { width: "60px" },
        props: {
          type: "default"
        },
        on: {
          click: () => {
            scope.handleEdit(row);
          }
        }
      }, "编辑");
    },
    align: "center"
  }
];