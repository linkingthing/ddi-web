export const columns = scope => [    
  {
    title: "子网地址",
    key: "poolName",
    align: "center"
  },
  {
    title: "地址总量",
    key: "total",
    align: "center"
  },
  // {
  //   title: "类型",
  //   key: "addressType",
  //   align: "center"
  // },
  {
    title: "DHCP使用率",
    key: "usage",
    align: "center"
  },
  {
    title: "创建时间",
    key: "creationTime",
    width: "120",
    align: "center"
  },
  {
    title: "操作",
    align: "center",      
    render: (h, { row }) => {
      return h("div", [
        h("label", {
          class: "operate-label operate-edit",
          on: {
            click: () => {
              scope.handleEdit(row);
            }
          }
        }, "编辑"),
        h("label", {
          class: "operate-label operate-delete",
          on: {
            click: () => {
              scope.handleDelete(row);
            }
          }
        }, "删除")
      ]);
    }
  }
];