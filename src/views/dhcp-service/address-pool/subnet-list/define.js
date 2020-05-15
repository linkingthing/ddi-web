export const columns = scope => [    
  {
    title: "子网地址",
    key: "subnet",
    align: "center",
    render: (h, { row }) => {
      return h("div", [
        h("label", {
          class: "operate-label operate-link",
          on: {
            click: () => {
              scope.showDetail(row);
            }
          }
        }, row.subnet)
      ]);
    }
  },
  {
    title: "地址总量",
    key: "total",
    align: "center"
  },
  {
    title: "DHCP使用率",
    key: "usage",
    align: "center",
    render: (h, { row }) => {
      return h("div", 2);
    }
  },
  {
    title: "操作",
    align: "center",      
    render: (h, { row }) => {
      return h("div", [
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