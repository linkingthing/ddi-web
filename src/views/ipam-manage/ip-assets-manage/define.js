const tooltip = true;

export const columns = scope => [  
  {
    title: "IP地址",
    key: "ip",
    align: "left",
    tooltip
  },
  {
    title: "主机名",
    key: "name",
    align: "center",
    tooltip
  },
  {
    title: "设备类型",
    key: "type",
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