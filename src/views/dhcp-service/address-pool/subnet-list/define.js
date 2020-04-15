export const columns = scope => [    
  {
    title: "网络地址",
    key: "poolName",
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
        }, row.poolName)
      ]);
    }
  },
  {
    title: "地址数量",
    key: "total",
    align: "center"
  },
  {
    title: "使用率",
    key: "usage",
    align: "center"
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